/**
 * GallerySection – sdílená komponenta galerie pro celý web
 *
 * Podporuje dva zdroje dat:
 *   1. `albums` prop – data načtená ze Sanity (preferováno)
 *   2. Záložní hardcoded `galleryData` – použije se pokud Sanity je prázdná
 *
 * Použití:
 *   <GallerySection groups={['exteriery', 'interiery']} youtubeId="..." albums={sanityAlbums} />
 *   <GallerySection groups={['exteriery', 'interiery', 'pudorysy']} />   ← čistě hardcoded fallback
 */

import YoutubeCard from '@/components/YoutubeCard'

// ─── Typy ────────────────────────────────────────────────────────────────────

export type GalleryGroupId = 'exteriery' | 'interiery' | 'pudorysy'

export interface GalleryGroup {
  id: string
  label: string
  description: string
  thumbnail: string
  images: string[]
}

/** Obrázek z Sanity (GROQ dotaz musí zahrnovat asset->url) */
export interface SanityAlbumImage {
  url: string
  alt?: string
  caption?: string
}

/** Album z Sanity (galleryAlbum document) */
export interface SanityGalleryAlbum {
  _id: string
  title: string
  slug: string   // např. "exteriery" | "interiery" | "pudorysy"
  order: number
  images: SanityAlbumImage[]
}

// ─── Záložní hardcoded data ───────────────────────────────────────────────────

export const galleryData: GalleryGroup[] = [
  {
    id: 'exteriery',
    label: 'Exteriéry',
    description: 'Fotografie a vizualizace exteriéru',
    thumbnail: '/img/foto-exterier/1.webp',
    images: [
      ...Array.from({ length: 2 }, (_, i) => `/img/foto-exterier/${i + 1}.png`),
    ],
  },
  {
    id: 'interiery',
    label: 'Interiéry',
    description: 'Fotografie a vizualizace interiéru',
    thumbnail: '/img/foto-interier/1.webp',
    images: [
      ...Array.from({ length: 1 }, (_, i) => `/img/foto-interier/${i + 1}.jpeg`),
    ],
  },
  {
    id: 'pudorysy',
    label: 'Půdorysy',
    description: 'Plány a půdorysy rodinného domu',
    thumbnail: '/img/pudorys/1.webp',
    images: Array.from({ length: 4 }, (_, i) => `/img/pudorys/${i + 1}.webp`),
  },
]

// ─── Ikony ───────────────────────────────────────────────────────────────────

const defaultIcon = (
  <svg className="w-6 h-6 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const icons: Record<string, React.ReactNode> = {
  exteriery: (
    <svg className="w-6 h-6 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
    </svg>
  ),
  interiery: (
    <svg className="w-6 h-6 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  pudorysy: (
    <svg className="w-6 h-6 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
}

// ─── Karta galerie ────────────────────────────────────────────────────────────

function GalleryCard({ group }: { group: GalleryGroup }) {
  return (
    <a
      href={group.images[0]}
      data-fancybox={group.id}
      className="h-[280px] md:h-auto min-h-[280px] rounded-[2.5rem] overflow-hidden relative group border border-gray-200 hover:border-accent transition-all duration-500 flex flex-col items-center justify-center text-center p-6 cursor-pointer shadow-md bg-gray-50"
    >
      {/* Náhledový obrázek v pozadí */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-500"
        style={{ backgroundImage: `url('${group.thumbnail}')` }}
      />
      {/* Jemný gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />

      {/* Ikona */}
      <div className="w-14 h-14 rounded-full border border-accent flex items-center justify-center mb-4 group-hover:bg-accent transition-all duration-300 relative z-10 bg-white shadow-sm group-hover:shadow-[0_0_20px_rgba(239,134,37,0.3)]">
        {icons[group.id] ?? defaultIcon}
      </div>

      {/* Název a popis */}
      <span className="text-gray-900 font-bold text-xl relative z-10 mb-1">{group.label}</span>
      <span className="text-accent text-sm font-medium relative z-10">
        {group.images.length} fotek
      </span>
    </a>
  )
}

// ─── Pomocná funkce – převod Sanity alb na GalleryGroup ──────────────────────

function sanityAlbumsToGroups(albums: SanityGalleryAlbum[]): GalleryGroup[] {
  return albums
    .filter((a) => a.images?.length > 0)
    .map((a) => ({
      id: a.slug,
      label: a.title,
      description: a.title,
      thumbnail: a.images[0]?.url ?? '',
      images: a.images.map((img) => img.url).filter(Boolean),
    }))
}

// ─── Hlavní komponenta ────────────────────────────────────────────────────────

interface GallerySectionProps {
  /** Které skupiny zobrazit (filtruje podle id/slug) */
  groups?: string[]
  /** Sanity alba – pokud jsou neprázdná, nahrazují hardcoded data */
  albums?: SanityGalleryAlbum[]
  /** YouTube video ID – zobrazí se jako velká karta vlevo (2 sloupce) */
  youtubeId?: string
  /** Nadpis sekce */
  title?: string
  /** CSS třída pro wrapper sekce */
  className?: string
}

export default function GallerySection({
  groups = ['exteriery', 'interiery', 'pudorysy'],
  albums,
  youtubeId,
  title = 'Galerie projektu',
  className = '',
}: GallerySectionProps) {
  // Použij Sanity data pokud existují, jinak fallback na hardcoded
  const sourceData: GalleryGroup[] =
    albums && albums.length > 0 ? sanityAlbumsToGroups(albums) : galleryData

  const filteredGroups = sourceData.filter((g) => groups.includes(g.id))

  return (
    <section id="Galerie" className={`pb-20 pt-0 relative overflow-hidden ${className}`}>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-gray-900 text-center">{title}</h2>

        {youtubeId ? (
          // Layout s videem: video 2 sloupce + galerie karty po 1 sloupci
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
            <YoutubeCard videoId={youtubeId} title="Spustit video" />
            {filteredGroups.map((group) => (
              <GalleryCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          // Standardní layout bez videa
          <div className={`grid grid-cols-1 gap-4 ${
            filteredGroups.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
          }`}>
            {filteredGroups.map((group) => (
              <GalleryCard key={group.id} group={group} />
            ))}
          </div>
        )}

        {/* Skryté obrázky pro Fancybox (od druhého dál) */}
        <div className="hidden" aria-hidden="true">
          {filteredGroups.map((group) =>
            group.images.slice(1).map((src) => (
              <a key={src} href={src} data-fancybox={group.id} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
