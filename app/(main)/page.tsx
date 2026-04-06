import type { Metadata } from 'next'
import GallerySection, { type SanityGalleryAlbum } from '@/components/GallerySection'
import { sanityClient } from '@/sanity/client'
import { SiteIcon } from '@/lib/icons'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import TransitionLink from '@/components/TransitionLink'
import SEO from '@/components/SEO'
import { buildMetadata, schemaDomy } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Bidli v Hrabicích – Rodinné domy ve hrubé stavbě Hrabice u Vimperka',
  description: 'Nabídka 18 rodinných domů ve hrubé stavbě k dokončení v obci Hrabice (Město Vimperk). 8 dvojdomů (16 jednotek, 110,5 m²) a 2 solitérní domy (94,7 m²). Jihočeský kraj.',
  path: '',
})

// ─── Typy ─────────────────────────────────────────────────────────────────────

interface SanityImage {
  _type: 'image'
  asset: { _ref: string }
}

interface SanityHomepage {
  heroHeadline?: string
  heroHeadlineAccent?: string
  heroSubheadline?: string
  heroImage?: SanityImage
  infoStats?: { label: string; value: string; colored?: boolean }[]
  aboutHeading?: string
  aboutParagraph1?: string
  aboutParagraph2?: string
  aboutParagraph3?: string
  aboutHighlightTitle?: string
  aboutHighlightItems?: { label: string; value: string }[]
  aboutImage1?: SanityImage
  aboutImage2?: SanityImage
  techHeading?: string
  techCards?: { icon?: string; title: string; text: string }[]
  locationHeading?: string
  locationIntro?: string
  locationNote?: string
  locationDistances?: { icon?: string; label: string; dist: string }[]
  mapUrl?: string
  youtubeId?: string
}

// ─── GROQ dotazy ──────────────────────────────────────────────────────────────

const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  heroHeadline,
  heroHeadlineAccent,
  heroSubheadline,
  heroImage,
  infoStats,
  aboutHeading,
  aboutParagraph1,
  aboutParagraph2,
  aboutParagraph3,
  aboutHighlightTitle,
  aboutHighlightItems,
  aboutImage1,
  aboutImage2,
  techHeading,
  techCards,
  locationHeading,
  locationIntro,
  locationNote,
  locationDistances,
  mapUrl,
  youtubeId
}`

const GALLERY_QUERY = `*[_type == "galleryAlbum"] | order(order asc) {
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

// ─── Záložní data ──────────────────────────────────────────────────────────────

const FALLBACK_INFO_STATS = [
  { label: 'Dvojdomy', value: '8 budov / 16 jed.', colored: false },
  { label: 'Solitéry', value: '2 domy', colored: false },
  { label: 'Hrubá stavba', value: 'k dokončení', colored: true },
]

const FALLBACK_DISTANCES = [
  { icon: 'shopping', label: 'Vimperk – centrum',  dist: '~3 km' },
  { icon: 'school',   label: 'Škola a školka',     dist: 'Vimperk' },
  { icon: 'sport',    label: 'Příroda / Šumava',   dist: 'v dosahu' },
  { icon: 'bus',      label: 'Dopravní dostupnost', dist: 'Vimperk' },
]

const FALLBACK_TECH_CARDS = [
  {
    icon: 'document',
    title: 'Hrubá stavba k dokončení',
    text: 'Domy jsou prodávány ve stavu hrubé stavby. Dokončení interiérů, povrchů a vybavení si klient realizuje zcela po vlastní ose – dle svého vkusu a požadavků.',
  },
  {
    icon: 'plan',
    title: 'Dvojdomy 110,5 m²',
    text: 'Osm dvojdomů nabízí celkem 16 jednotek s užitnou plochou 110,5 m² každá. Označení SO01–SO16 (bez SO05 a SO12).',
  },
  {
    icon: 'bolt',
    title: 'Solitéry 94,7 m²',
    text: 'Dva solitérní rodinné domy SO05 a SO12 s užitnou plochou 94,7 m² – ideální volba pro menší rodinu nebo ty, kteří preferují vlastní parcelu bez sousedů na zdi.',
  },
]

// ─── Stránka ───────────────────────────────────────────────────────────────────

export default async function HomePage() {
  let hp: SanityHomepage = {}
  let galleries: SanityGalleryAlbum[] = []

  try {
    const [hpData, galData] = await Promise.all([
      sanityClient.fetch<SanityHomepage>(HOMEPAGE_QUERY),
      sanityClient.fetch<SanityGalleryAlbum[]>(GALLERY_QUERY),
    ])
    hp = hpData ?? {}
    galleries = galData ?? []
  } catch {
    // Sanity nedostupná → záložní hodnoty
  }

  const infoStats = hp.infoStats?.length ? hp.infoStats : FALLBACK_INFO_STATS
  const distances = hp.locationDistances?.length ? hp.locationDistances : FALLBACK_DISTANCES
  const techCards = hp.techCards?.length ? hp.techCards : FALLBACK_TECH_CARDS

  return (
    <>
      <SEO schemas={[schemaDomy]} />

      {/* HERO */}
      <section className="relative p-2 h-2/4">
        <div
          className="relative flex flex-col justify-end h-full rounded-[3rem] overflow-hidden"
          style={{ minHeight: '75vh', backgroundColor: '#ec4899' }}
        >
          {/* Růžový placeholder – bude nahrazen fotografií */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/40 text-sm font-bold uppercase tracking-widest select-none">
              Vizualizace / fotografie
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/100 via-gray-900/80 to-transparent" />
          <div className="relative z-10 container mx-auto px-6 pb-14 md:pb-32 pt-32">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {hp.heroHeadline ?? '18 rodinných domů'} <br />
                <span className="text-white md:text-accent">
                  {hp.heroHeadlineAccent ?? 've hrubé stavbě – Hrabice'}
                </span>
              </h1>
              <p className="text-lg md:text-xl font-light mb-8 opacity-90">
                {hp.heroSubheadline ??
                  'Dokončete si dům přesně podle sebe. 8 dvojdomů a 2 solitéry v klidné lokalitě obce Hrabice (Město Vimperk), Jihočeský kraj.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="container mx-auto px-6 relative z-20 -mt-10 md:-mt-20 mb-12">
        <AnimateOnScroll animation="up">
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl flex flex-col xl:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-[100px] opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 md:gap-12 w-full xl:w-auto">
            {infoStats.map((item, i) => (
              <div key={item.label} className="flex items-center gap-8 md:gap-12">
                {i > 0 && <div className="hidden md:block w-px bg-gray-200 self-stretch" />}
                <div>
                  <p className="text-gray-500 text-sm md:text-base uppercase tracking-widest mb-1 font-bold">
                    {item.label}
                  </p>
                  <div
                    className={`text-3xl md:text-4xl font-bold tracking-tight ${
                      item.colored ? 'text-accent' : 'text-gray-900'
                    }`}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto mt-4 xl:mt-0">
            <TransitionLink
              href="/domy"
              className="flex items-center justify-center w-full md:w-auto bg-accent hover:bg-black text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(239,134,37,0.3)] hover:shadow-none group whitespace-nowrap"
            >
              Prohlédnout domy
              <svg
                className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </TransitionLink>
          </div>
        </div>
        </AnimateOnScroll>
      </section>

      {/* O PROJEKTU */}
      <section id="O-projektu" className="py-20 md:py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <AnimateOnScroll animation="left">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900">
              {hp.aboutHeading ?? 'O projektu'}
            </h2>
            <div className="text-lg font-light text-gray-600 space-y-6">
              {hp.aboutParagraph1 ? (
                <p className="hyphens-auto">{hp.aboutParagraph1}</p>
              ) : (
                <p className="hyphens-auto">
                  Nabízíme k prodeji <strong>rodinné domy ve hrubé stavbě</strong> v nově vzniklé
                  lokalitě v obci Hrabice, která je součástí Města Vimperk v Jihočeském kraji.
                  Lokalita nabízí klidné bydlení v přírodním prostředí v blízkosti Šumavy.
                </p>
              )}
              {hp.aboutParagraph2 ? (
                <p className="hyphens-auto">{hp.aboutParagraph2}</p>
              ) : (
                <p className="hyphens-auto">
                  Domy jsou prodávány <strong>ve stavu hrubé stavby k dokončení</strong> –
                  klient si dokončení interiérů, povrchových úprav a vybavení řeší zcela po
                  vlastní ose, přesně podle svých představ a potřeb.
                </p>
              )}
              {hp.aboutParagraph3 ? (
                <p className="hyphens-auto">{hp.aboutParagraph3}</p>
              ) : (
                <p className="hyphens-auto">
                  V nabídce jsou <strong>dvojdomy</strong> (8 budov, 16 jednotek, každá 110,5 m²
                  užitné plochy) a <strong>solitérní rodinné domy</strong> (2 jednotky, každá
                  94,7 m²). Všechny domy mají vlastní přidělený pozemek.
                </p>
              )}

              {hp.aboutHighlightItems?.length ? (
                <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 mt-6">
                  {hp.aboutHighlightTitle && (
                    <h3 className="font-bold text-accent mb-2">{hp.aboutHighlightTitle}</h3>
                  )}
                  <ul className="text-sm text-gray-700 space-y-2">
                    {hp.aboutHighlightItems.map((item) => (
                      <li key={item.label}>
                        <strong>{item.label}:</strong> {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 mt-6">
                  <h3 className="font-bold text-accent mb-2">Klíčové informace</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>Stav:</strong> Hrubá stavba k dokončení</li>
                    <li><strong>Dvojdomy:</strong> 8 budov × 2 jednotky = 16 jed. (110,5 m²)</li>
                    <li><strong>Solitéry:</strong> 2 samostatné domy (94,7 m²)</li>
                    <li><strong>Lokalita:</strong> Hrabice, Město Vimperk, Jihočeský kraj</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          </AnimateOnScroll>

          {/* Fotografie – růžový placeholder */}
          <AnimateOnScroll animation="right" delay={150}>
          <div className="flex flex-col gap-8 w-full h-full justify-center mt-8 lg:mt-0">
            <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-xl relative bg-pink-500 flex items-center justify-center">
              <span className="text-white/50 text-sm font-bold uppercase tracking-widest select-none">
                Vizualizace exteriéru
              </span>
            </div>
            <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-xl relative bg-pink-500 flex items-center justify-center">
              <span className="text-white/50 text-sm font-bold uppercase tracking-widest select-none">
                Vizualizace interiéru
              </span>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* TECHNICKÉ DETAILY */}
      <section id="Technicke-udaje" className="py-32 relative overflow-hidden rounded-[3rem] mx-2 md:mx-6 bg-primary">
        <div className="container mx-auto px-6 relative z-10">
          <AnimateOnScroll animation="up">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white text-center">
              {hp.techHeading ?? 'Detaily projektu'}
            </h2>
          </AnimateOnScroll>
          <div className={
            techCards.length === 1
              ? 'max-w-sm mx-auto'
              : techCards.length === 2
                ? 'grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-6'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }>
            {techCards.map((card, i) => (
              <AnimateOnScroll key={card.title} animation="scale" delay={i * 120}>
                <div className="bg-white/40 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all text-white h-full">
                  <div className="mb-4">
                    <SiteIcon id={card.icon} className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="font-light text-sm">{card.text}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* LOKALITA */}
      <section id="Lokalita" className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AnimateOnScroll animation="left">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              {hp.locationHeading ?? 'Proč bydlet v Hrabicích?'}
            </h2>
            <p className="text-gray-600 font-light text-lg mb-8 leading-relaxed hyphens-auto">
              {hp.locationIntro ??
                'Hrabice je klidná obec, která je součástí Města Vimperk v Jihočeském kraji. Lokalita nabízí přírodu a klid v blízkosti Šumavy, s dobrou dostupností do centra Vimperka.'}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-8">
              {distances.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <SiteIcon id={item.icon} className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <strong className="block text-gray-900">{item.label}</strong>
                    <span className="text-sm text-gray-500">{item.dist}</span>
                  </div>
                </div>
              ))}
            </div>
            {hp.locationNote && (
              <p className="text-sm text-gray-500 hyphens-auto mt-4">{hp.locationNote}</p>
            )}
            {!hp.locationNote && (
              <p className="text-sm text-gray-500 hyphens-auto mt-4">
                Vimperk nabízí kompletní občanskou vybavenost – obchody, zdravotní péči, školy
                a kulturní vyžití. Okolí Šumavy láká na turistiku, cykloturistiku a zimní sporty.
              </p>
            )}
          </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="right" delay={150} className="relative h-[400px] lg:h-auto">
            <div className="h-full rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-200">
              <iframe
                style={{ border: 'none' }}
                src={hp.mapUrl ?? 'https://mapy.com/s/hrabice-vimperk'}
                width="100%"
                height="100%"
                title="Mapa lokality Hrabice"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* GALERIE + VIDEO */}
      <AnimateOnScroll animation="up">
      <GallerySection
        groups={['exteriery', 'interiery']}
        albums={galleries}
        youtubeId={hp.youtubeId ?? ''}
        title="Prozkoumejte projekt"
      />
      </AnimateOnScroll>
    </>
  )
}
