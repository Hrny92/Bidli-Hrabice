import type { Metadata } from 'next'
import { sanityClient } from '@/sanity/client'
import DomyClient, { type SanityHouse } from './DomyClient'
import { buildMetadata } from '@/lib/seo'
import type { SanityGalleryAlbum } from '@/components/GallerySection'

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Nabídka domů – 18 rodinných domů Hrabice u Vimperka',
  description: '16 jednotek v 8 dvojdomech (110,5 m²) a 2 solitérní domy (94,7 m²) ve hrubé stavbě k dokončení. Obec Hrabice, Město Vimperk, Jihočeský kraj.',
  path: '/domy',
})

// ─── Záložní data ──────────────────────────────────────────────────────────────
// Dvojdomy: SO01–SO04, SO06–SO11, SO13–SO16 (110,5 m²)
// Solitéry: SO05, SO12 (94,7 m²)
// Rozlohy pozemků dle situačního výkresu C.4

const FALLBACK_HOUSES: SanityHouse[] = [
  // ── Dvojdomy ────────────────────────────────────────────────────────────────
  { _id: 'so01', id: 'SO01', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '621 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so02', id: 'SO02', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '622 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so03', id: 'SO03', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '635 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so04', id: 'SO04', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '641 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so06', id: 'SO06', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '651 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so07', id: 'SO07', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '659 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so08', id: 'SO08', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '643 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so09', id: 'SO09', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '639 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so10', id: 'SO10', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '612 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so11', id: 'SO11', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '608 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so13', id: 'SO13', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '616 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so14', id: 'SO14', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '621 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so15', id: 'SO15', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '625 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so16', id: 'SO16', typ: 'dvojdům', usableArea: '110,5 m²', plotSize: '635 m²', price: 'Info u makléře', status: 'volný' },
  // ── Solitéry ────────────────────────────────────────────────────────────────
  { _id: 'so05', id: 'SO05', typ: 'solitér', usableArea: '94,7 m²',  plotSize: '807 m²', price: 'Info u makléře', status: 'volný' },
  { _id: 'so12', id: 'SO12', typ: 'solitér', usableArea: '94,7 m²',  plotSize: '802 m²', price: 'Info u makléře', status: 'volný' },
]

const HOUSE_ORDER = [
  'SO01','SO02','SO03','SO04','SO05',
  'SO06','SO07','SO08','SO09','SO10',
  'SO11','SO12','SO13','SO14','SO15','SO16',
]

const GALLERY_ALBUMS_QUERY = `*[_type == "galleryAlbum"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  order,
  images[] {
    "url": asset->url,
    alt,
    caption
  }
}`

const HOUSES_QUERY = `*[_type == "house"] {
  _id,
  id,
  typ,
  usableArea,
  plotSize,
  price,
  status,
  hidden,
  description,
  "photos": photos[].asset->url,
  floorPlans[] {
    "url": file.asset->url,
    "mimeType": file.asset->mimeType,
    "originalFilename": file.asset->originalFilename,
    title
  },
  catalogSheets[] {
    "url": file.asset->url,
    "mimeType": file.asset->mimeType,
    "originalFilename": file.asset->originalFilename,
    title
  }
}`

export default async function DomyPage() {
  let houses: SanityHouse[] = []
  let galleryImages: string[] = []
  let albums: SanityGalleryAlbum[] = []

  try {
    const [houseData, albumData] = await Promise.all([
      sanityClient.fetch<SanityHouse[]>(HOUSES_QUERY),
      sanityClient.fetch<SanityGalleryAlbum[]>(GALLERY_ALBUMS_QUERY),
    ])

    houses = houseData?.length
      ? houseData.sort((a, b) => HOUSE_ORDER.indexOf(a.id) - HOUSE_ORDER.indexOf(b.id))
      : FALLBACK_HOUSES

    albums = albumData ?? []

    galleryImages = albums
      .filter((a) => ['exteriery', 'interiery'].includes(a.slug))
      .flatMap((a) => a.images?.map((img) => img.url).filter(Boolean) ?? [])
  } catch {
    houses = FALLBACK_HOUSES
  }

  return <DomyClient houses={houses} galleryImages={galleryImages} albums={albums} />
}
