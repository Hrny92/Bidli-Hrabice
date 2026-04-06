'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import GallerySection, { type SanityGalleryAlbum } from '@/components/GallerySection'
import ModalCarousel, { type ModalFile } from '@/components/ModalCarousel'

export type HouseStatus = 'volný' | 'rezervováno' | 'prodáno'
export type HouseTyp = 'dvojdům' | 'solitér'

export interface SanityHouse {
  _id: string
  id: string           // 'SO01'–'SO16', 'SO05', 'SO12'
  typ: HouseTyp
  usableArea?: string
  plotSize?: string
  price?: string
  status: HouseStatus
  hidden?: boolean
  description?: string
  photos?: string[]
  floorPlans?: ModalFile[]
  catalogSheets?: ModalFile[]
}

const HOUSE_DESCRIPTION_DVOJDUM =
  'Jednotka v dvojdomu ve hrubé stavbě k dokončení. Celé dokončení interiérů a povrchových úprav realizuje kupující po vlastní ose dle svého vkusu. Součástí je vlastní přidělený pozemek.'

const HOUSE_DESCRIPTION_SOLITER =
  'Solitérní rodinný dům ve hrubé stavbě k dokončení. Nabízí větší soukromí na vlastním pozemku. Celé dokončení interiérů a povrchových úprav realizuje kupující po vlastní ose dle svého vkusu.'

const statusConfig: Record<HouseStatus, { label: string; badge: string; dot: string; text: string }> = {
  'volný':       { label: 'Volný',     badge: 'bg-green-100 text-green-700 border-green-200',   dot: 'bg-green-500',  text: 'text-green-600' },
  'rezervováno': { label: 'Rezervace', badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400', text: 'text-orange-500' },
  'prodáno':     { label: 'Prodáno',   badge: 'bg-gray-100 text-gray-500 border-gray-200',       dot: 'bg-gray-400',   text: 'text-gray-400' },
}

function StatusBadge({ status }: { status: HouseStatus }) {
  const { label, badge } = statusConfig[status]
  return (
    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border ${badge}`}>
      {label.toUpperCase()}
    </span>
  )
}

interface TooltipState {
  house: SanityHouse
  x: number
  y: number
}

interface Props {
  houses: SanityHouse[]
  galleryImages?: string[]
  albums?: SanityGalleryAlbum[]
}

export default function DomyClient({ houses, galleryImages = [], albums }: Props) {
  const [selectedHouse, setSelectedHouse] = useState<SanityHouse | null>(null)

  const dvojdomy = houses.filter((h) => h.typ === 'dvojdům' && !h.hidden)
  const solitery = houses.filter((h) => h.typ === 'solitér' && !h.hidden)

  // Seskupení dvojdomů po párech (dvojdomy jsou po 2 – sousedé na zdi)
  const dvojdomyPairs: SanityHouse[][] = []
  for (let i = 0; i < dvojdomy.length; i += 2) {
    dvojdomyPairs.push(dvojdomy.slice(i, i + 2))
  }

  return (
    <>
      {/* HERO */}
      <section className="relative p-2 h-[40vh] min-h-[400px]">
        <div
          className="relative flex flex-col justify-center h-full rounded-[3rem] overflow-hidden"
          style={{ backgroundColor: '#ec4899' }}
        >
          {/* Růžový placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/30 text-sm font-bold uppercase tracking-widest select-none">
              Vizualizace / fotografie
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />
          <div className="relative z-10 container mx-auto px-6 mt-16 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Nabídka <span className="text-accent">domů</span>
              </h1>
              <p className="text-lg md:text-xl font-light opacity-90">
                18 rodinných domů ve hrubé stavbě — vyberte si ten svůj a dokončete ho po svém.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEGENDA */}
      <section className="container mx-auto px-6 pt-12 pb-4">
        <div className="flex flex-wrap justify-center gap-4">
          {(Object.entries(statusConfig) as [HouseStatus, typeof statusConfig[HouseStatus]][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`w-3 h-3 rounded-full ${val.dot}`} />
              {val.label}
            </div>
          ))}
        </div>
      </section>

      {/* MAPA – situační výkres jako růžový placeholder */}
      <section className="py-12 md:py-16 container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Situace lokality</h2>
          <p className="text-gray-600 font-light text-lg">Přehled rozmístění domů v lokalitě.</p>
        </div>
        <div
          className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 flex items-center justify-center"
          style={{ aspectRatio: '16/9', backgroundColor: '#ec4899' }}
        >
          <span className="text-white/50 text-sm font-bold uppercase tracking-widest select-none">
            Situační výkres / interaktivní mapa
          </span>
        </div>
      </section>

      {/* TABULKA DVOJDOMŮ */}
      <section className="py-12 relative overflow-hidden bg-gray-50 rounded-[3rem] mx-2 md:mx-6 mb-8">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Dvojdomy <span className="text-accent">110,5 m²</span>
          </h2>
          <div className="w-full bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs md:text-sm uppercase tracking-wider">
                    {['Označení', 'Typ', 'Užitná plocha', 'Plocha pozemku', 'Cena', 'Stav'].map((h) => (
                      <th key={h} className={`p-5 md:p-6 font-medium ${h === 'Stav' ? 'text-center' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {dvojdomyPairs.map((pair, pairIdx) => (
                    <Fragment key={`pair-${pairIdx}`}>
                      <tr className="bg-accent/5 border-b border-accent/10">
                        <td colSpan={6} className="px-5 md:px-6 py-3">
                          <span className="text-xs font-bold text-accent uppercase tracking-widest">
                            Dvojdům {pairIdx + 1} — {pair.map((h) => h.id).join(' + ')}
                          </span>
                        </td>
                      </tr>
                      {pair.map((house) => (
                        <tr
                          key={house._id}
                          onClick={() => setSelectedHouse(house)}
                          className={`hover:bg-gray-50 transition-colors group cursor-pointer ${house.status === 'prodáno' ? 'opacity-60' : ''}`}
                        >
                          <td className="p-5 md:p-6 font-black text-lg text-gray-900">{house.id}</td>
                          <td className="p-5 md:p-6 text-gray-600 capitalize">{house.typ}</td>
                          <td className="p-5 md:p-6 text-gray-900 font-medium">{house.usableArea ?? '–'}</td>
                          <td className="p-5 md:p-6 text-gray-900 font-medium">{house.plotSize ?? '–'}</td>
                          <td className="p-5 md:p-6 font-bold text-gray-900 group-hover:text-accent transition-colors">{house.price ?? '–'}</td>
                          <td className="p-5 md:p-6 text-center"><StatusBadge status={house.status} /></td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="block md:hidden text-center py-3 bg-gray-50 border-t border-gray-100 text-gray-500 text-xs">
              ← Posunutím zobrazíte další informace →
            </div>
          </div>
        </div>
      </section>

      {/* TABULKA SOLITÉRŮ */}
      <section className="py-12 relative overflow-hidden bg-gray-50 rounded-[3rem] mx-2 md:mx-6 mb-12">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Solitérní domy <span className="text-accent">94,7 m²</span>
          </h2>
          <div className="w-full bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs md:text-sm uppercase tracking-wider">
                    {['Označení', 'Typ', 'Užitná plocha', 'Plocha pozemku', 'Cena', 'Stav'].map((h) => (
                      <th key={h} className={`p-5 md:p-6 font-medium ${h === 'Stav' ? 'text-center' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {solitery.map((house) => (
                    <tr
                      key={house._id}
                      onClick={() => setSelectedHouse(house)}
                      className={`hover:bg-gray-50 transition-colors group cursor-pointer ${house.status === 'prodáno' ? 'opacity-60' : ''}`}
                    >
                      <td className="p-5 md:p-6 font-black text-lg text-gray-900">{house.id}</td>
                      <td className="p-5 md:p-6 text-gray-600 capitalize">{house.typ}</td>
                      <td className="p-5 md:p-6 text-gray-900 font-medium">{house.usableArea ?? '–'}</td>
                      <td className="p-5 md:p-6 text-gray-900 font-medium">{house.plotSize ?? '–'}</td>
                      <td className="p-5 md:p-6 font-bold text-gray-900 group-hover:text-accent transition-colors">{house.price ?? '–'}</td>
                      <td className="p-5 md:p-6 text-center"><StatusBadge status={house.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <GallerySection
        groups={['exteriery', 'interiery', 'pudorysy']}
        title="Galerie projektu"
        albums={albums}
      />

      {/* DETAIL MODAL */}
      {selectedHouse && (
        <div
          className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6"
          onClick={() => setSelectedHouse(null)}
        >
          <div
            className="relative bg-white w-full h-full md:h-auto md:max-h-[92vh] md:max-w-5xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedHouse(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-gray-100 flex items-center justify-center shadow-md transition-all"
              aria-label="Zavřít"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* LEVÝ SLOUPEC */}
            <div className="w-full md:w-[42%] flex flex-col p-8 md:p-10 overflow-y-auto">
              <StatusBadge status={selectedHouse.status} />
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-2 leading-tight">
                {selectedHouse.id}
              </h2>
              <p className="text-accent font-bold mb-6 capitalize">{selectedHouse.typ}</p>

              <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                {selectedHouse.description ??
                  (selectedHouse.typ === 'dvojdům'
                    ? HOUSE_DESCRIPTION_DVOJDUM
                    : HOUSE_DESCRIPTION_SOLITER)}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-8">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Označení</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedHouse.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Typ</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{selectedHouse.typ}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Užitná plocha</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedHouse.usableArea ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Plocha pozemku</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedHouse.plotSize ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Stav</p>
                  <p className={`text-2xl font-bold ${statusConfig[selectedHouse.status].text}`}>
                    {statusConfig[selectedHouse.status].label}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Hrubá stavba</p>
                  <p className="text-lg font-bold text-gray-900">K dokončení</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cena</p>
                  <p className="text-3xl font-bold text-accent">{selectedHouse.price ?? '–'}</p>
                </div>
              </div>

              <Link
                href="/#Kontakt"
                onClick={() => setSelectedHouse(null)}
                className="flex items-center justify-center w-full bg-accent hover:bg-accentDark text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 group shadow-[0_0_20px_rgba(239,134,37,0.3)] mt-auto"
              >
                Poptat dům
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* PRAVÝ SLOUPEC – obrázky / půdorysy */}
            <div className="w-full md:w-[58%] bg-gray-50 flex flex-col min-h-[320px] md:min-h-0 border-t md:border-t-0 md:border-l border-gray-100">
              {/* Růžový placeholder dokud nejsou fotky */}
              {(selectedHouse.photos?.filter(Boolean).length ?? 0) === 0 &&
               galleryImages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-pink-500">
                  <span className="text-white/60 text-sm font-bold uppercase tracking-widest select-none">
                    Fotografie / vizualizace
                  </span>
                </div>
              ) : (
                <ModalCarousel
                  images={
                    (selectedHouse.photos?.filter(Boolean).length ?? 0) > 0
                      ? selectedHouse.photos!.filter(Boolean)
                      : galleryImages
                  }
                  floorPlans={selectedHouse.floorPlans ?? []}
                  catalogSheets={selectedHouse.catalogSheets ?? []}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
