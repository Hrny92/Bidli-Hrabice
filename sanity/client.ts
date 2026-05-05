import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Pro GROQ dotazy: useCdn: false je nutné při použití SANITY_API_READ_TOKEN
// (token nelze kombinovat s CDN proxy). Data jsou cachována Next.js revalidate.
// Token se předá pouze pokud vypadá jako skutečný Sanity token (začíná "sk").
// Prázdný string nebo placeholder "DOPLNIT" způsobí 401 – proto je ignorujeme.
const rawToken = process.env.SANITY_API_READ_TOKEN
const readToken = rawToken?.startsWith('sk') ? rawToken : undefined

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'fxnzotxb',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: !readToken, // CDN funguje jen bez tokenu; s tokenem přímý API
  token: readToken,
})

// Helper pro URL obrázků ze Sanity CDN (pro asset reference objekty)
const builder = imageUrlBuilder(sanityClient)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

/**
 * Přidá transformační parametry Sanity Image API k existující asset->url.
 *
 * Sanity CDN podporuje on-the-fly transformace přímo v URL:
 *   ?w=<šířka>   – zmenší na danou šířku (výška se přepočítá)
 *   &auto=format – automaticky zvolí nejlepší formát (WebP / AVIF dle Accept)
 *   &q=<0–100>   – kvalita komprese
 *   &fit=max     – nikdy nezvětšuje menší obrázky
 *
 * Doporučené šířky:
 *   gallery thumbnail  → 800
 *   modal fotogalerie  → 1400
 *   hero / about foto  → 1920
 *   OG image           → 1200
 *
 * @param url      Surová URL z GROQ (asset->url)
 * @param width    Maximální šířka v px (default 1400)
 * @param quality  Kvalita 1–100 (default 82)
 */
export function optimizeSanityUrl(
  url: string | null | undefined,
  width = 1400,
  quality = 82,
): string {
  if (!url) return ''
  // Působí pouze na Sanity CDN – ostatní URL (lokální, YouTube…) nechá beze změny
  if (!url.includes('cdn.sanity.io/images')) return url
  try {
    const u = new URL(url)
    u.searchParams.set('w', String(width))
    u.searchParams.set('auto', 'format')
    u.searchParams.set('q', String(quality))
    u.searchParams.set('fit', 'max')
    return u.toString()
  } catch {
    return url
  }
}
