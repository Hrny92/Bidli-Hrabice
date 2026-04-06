'use client'

import { Fragment, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import GallerySection, { type SanityGalleryAlbum } from '@/components/GallerySection'
import ModalCarousel, { type ModalFile } from '@/components/ModalCarousel'

export type ApartmentStatus = 'volný' | 'rezervováno' | 'prodáno'

export interface SanityApartment {
  _id: string
  id: string            // '11A'–'14C'
  disposition?: string
  area?: string
  gardenArea?: string
  price?: string
  status: ApartmentStatus
  hidden?: boolean
  description?: string
  photos?: string[]
  floorPlans?: ModalFile[]
  catalogSheets?: ModalFile[]
}

// ─── Hardcoded polygon souřadnice (viewBox 0 0 1500 844) ───────────────────
// Přečíslování: 17→14, 18→13, 19→12, 20→11
const POLYGON_POINTS: Record<string, string> = {
  '14A': '834.46 563.79 1046.58 690.72 1104.53 611.05 1059 587.59 1064.52 534.48 1068.66 531.03 971.39 444.8 881.71 438.94 821.01 492.4 821.01 495.02 827.22 495.99 834.46 563.79',
  '14B': '1097.71 541.89 1112.08 467.43 1126.46 450.1 1029.15 388.91 943.62 369.74 881.33 422 887.59 424.3 888.43 439.38 971.39 444.8 1068.66 531.03 1064.52 534.48 1059 587.59 1104.53 611.05 1142.29 559.74 1097.71 541.89',
  '14C': '994.48 345.49 1080.23 340.42 1164.59 416.02 1154.45 428.47 1142.29 485.64 1182.04 505.02 1142.29 559.74 1097.71 541.89 1112.08 467.43 1126.46 450.1 1029.15 388.91 961.15 373.67 994.48 345.49',
  '13A': '779.85 450.08 767.52 380.51 691.98 309.42 643.11 317.1 573.23 355.47 574.43 358.01 578.09 358.41 604.74 426.56 753.79 515.02 807.91 470.79 807.91 464.13 779.85 450.08',
  '13B': '826.39 324.49 834.48 407.01 867.25 422 846.82 438.94 842.97 438.94 836.1 438.94 829.22 438.94 823.96 440.99 821.01 444.63 815.87 444.63 815.87 451.51 811.83 455.15 809.8 459.6 807.91 464.13 779.85 450.08 767.52 380.51 691.98 309.42 643.11 317.1 638.28 303.05 633.43 301.03 701.39 264.21 757.62 272.31 831.65 320.04 826.39 324.49',
  '13C': '758.83 250.87 815.06 237.92 883.83 301.84 879.38 304.26 883.83 369.74 915.38 382.74 867.25 422 834.48 407.01 826.39 324.49 831.65 320.04 757.62 272.31 728.51 268.12 758.83 250.87',
  '12A': '404.36 260.31 440.35 327.21 551.85 393.6 584.05 373.64 578.09 358.41 574.43 358.01 573.23 355.47 587.39 347.69 562.41 278.65 497.37 218.22 485.41 223.26 467.78 228.29 401.48 259.56 402.4 261.04 404.36 260.31',
  '12B': '621.04 233.28 642.01 296.38 633.43 301.03 638.28 303.05 643.11 317.1 587.39 347.69 562.41 278.65 497.37 218.22 485.41 223.26 467.78 228.29 463.03 218.22 460.76 216.12 525.84 188.45 561.37 191.36 624.74 231.15 621.04 233.28',
  '12C': '624.11 165.22 683.35 219.73 678.75 222.03 692.32 269.13 642.01 296.38 621.04 233.28 624.74 231.15 561.37 191.36 624.11 165.22',
  '11A': '253.29 189.71 293.4 252.89 393.81 295.15 416.4 282.68 404.36 260.31 402.4 261.04 401.48 259.56 420.35 250.66 398.15 196.35 333.83 147.85 308.64 156.69 271.93 170.09 250.76 188.45 251.62 190.43 253.29 189.71',
  '11B': '363.26 125.43 318.44 142.24 314.44 145.84 314.44 147.85 303.03 151.6 303.03 152.88 307.14 152.88 308.64 156.69 333.83 147.85 398.15 196.35 420.35 250.66 467.78 228.29 463.03 218.22 460.76 216.12 474.19 210.42 450.76 157.76 452.81 156.47 452.17 154.68 397.75 124 380.81 130.16 374.91 125.8 367.97 128.49 363.26 125.43',
  '11C': '451.51 103.72 508.62 147.85 506.07 149.24 521.84 190.15 474.19 210.42 450.76 157.76 452.81 156.47 452.17 154.68 397.75 124 451.51 103.72',
}

const APARTMENT_DESCRIPTION_DEFAULT = 'Světlý byt s dispozicí 3+kk nabízí moderní bydlení v nové zástavbě. Součástí je předzahrádka a přidělené parkovací místo. Budova je navržena jako nízkoenergetická s důrazem na kvalitu použitých materiálů.'

const statusConfig: Record<ApartmentStatus, { label: string; badge: string; dot: string; text: string }> = {
  'volný':       { label: 'Volný',     badge: 'bg-green-100 text-green-700 border-green-200',   dot: 'bg-green-500',  text: 'text-green-600' },
  'rezervováno': { label: 'Rezervace', badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400', text: 'text-orange-500' },
  'prodáno':     { label: 'Prodáno',   badge: 'bg-gray-100 text-gray-500 border-gray-200',       dot: 'bg-gray-400',   text: 'text-gray-400' },
}

const polygonColor: Record<ApartmentStatus, string> = {
  'volný':       'fill-green-400/25 hover:fill-green-400/55 stroke-green-500 stroke-1',
  'rezervováno': 'fill-orange-400/25 hover:fill-orange-400/55 stroke-orange-500 stroke-1',
  'prodáno':     'fill-gray-400/25 hover:fill-gray-400/55 stroke-gray-500 stroke-1',
}

const unitConfig: Record<string, { desc: string }> = {
  A: { desc: 'Rohový levý' },
  B: { desc: 'Prostřední' },
  C: { desc: 'Rohový pravý' },
}

function StatusBadge({ status }: { status: ApartmentStatus }) {
  const { label, badge } = statusConfig[status]
  return (
    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border ${badge}`}>
      {label.toUpperCase()}
    </span>
  )
}

function polygonCentroid(points: string): { x: number; y: number } {
  const nums = points.trim().split(/\s+/).map(Number)
  let sx = 0, sy = 0, n = 0
  for (let i = 0; i < nums.length; i += 2) {
    sx += nums[i]; sy += nums[i + 1]; n++
  }
  return { x: sx / n, y: sy / n }
}

interface TooltipState {
  apartment: SanityApartment
  x: number
  y: number
}

interface Props {
  apartments: SanityApartment[]
  galleryImages?: string[]
  albums?: SanityGalleryAlbum[]
}

export default function BytyClient({ apartments, galleryImages = [], albums }: Props) {
  const [selectedApartment, setSelectedApartment] = useState<SanityApartment | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  // Mapa bytů podle id
  const aptById = Object.fromEntries(apartments.map((a) => [a.id, a]))

  // Unikátní čísla budov – odvozeno z id (11A → "11"), přeskočí apt bez id
  const buildingSet = new Set(apartments.filter((a) => a.id).map((a) => a.id.slice(0, -1)))
  const buildings = Array.from(buildingSet).sort()

  function handleMouseMove(e: React.MouseEvent, apt: SanityApartment) {
    setTooltip({ apartment: apt, x: e.clientX, y: e.clientY })
  }

  function handleMouseLeave() {
    setTooltip(null)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative p-2 h-[40vh] min-h-[400px]">
        <div className="relative flex flex-col justify-center h-full rounded-[3rem] overflow-hidden bg-gray-100">
          <div className="absolute inset-0">
            <Image src="/img/Dysina-hero.png" alt="Byty Dýšina" fill priority className="object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />
          </div>
          <div className="relative z-10 container mx-auto px-6 mt-16 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Nabídka <span className="text-accent">bytů</span>
              </h1>
              <p className="text-lg md:text-xl font-light opacity-90">
                12 bytů ve 4 trojdomech — vyberte si ten svůj.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="py-20 md:py-32 container mx-auto px-6 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Interaktivní mapa</h2>
          <p className="text-gray-600 font-light text-lg">Klikněte na budovu pro detail bytů.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(Object.entries(statusConfig) as [ApartmentStatus, typeof statusConfig[ApartmentStatus]][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`w-3 h-3 rounded-full ${val.dot}`} />
              {val.label}
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 bg-gray-50 aspect-[1500/844]">
          <Image src="/img/byty2.png" alt="Mapa bytů" fill className="object-cover pointer-events-none" />
          <svg viewBox="0 0 1500 844" className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none">
            {Object.entries(POLYGON_POINTS).map(([aptId, defaultPts]) => {
              const apt = aptById[aptId]
              if (!apt || apt.hidden) return null
              const pts = defaultPts
              const center = polygonCentroid(pts)
              return (
                <g key={aptId}>
                  <polygon
                    points={pts}
                    className={`cursor-pointer transition-all duration-200 ${polygonColor[apt.status]}`}
                    onClick={() => setSelectedApartment(apt)}
                    onMouseMove={(e) => handleMouseMove(e, apt)}
                    onMouseLeave={handleMouseLeave}
                  />
                  <text
                    x={center.x} y={center.y}
                    textAnchor="middle" dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    style={{ fontSize: 28, fontWeight: 700, fill: 'white', paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.5)', strokeWidth: 4 }}
                  >
                    {aptId}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </section>

      {/* TABULKA */}
      <section className="py-20 relative overflow-hidden bg-gray-50 rounded-[3rem] mx-2 md:mx-6 mb-20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="w-full bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs md:text-sm uppercase tracking-wider">
                    {['Byt', 'Dispozice', 'Plocha bytu', 'Plocha zahrady', 'Cena vč. DPH', 'Stav'].map((h) => (
                      <th key={h} className={`p-5 md:p-6 font-medium ${h === 'Stav' ? 'text-center' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {buildings.map((building) => {
                    const units = apartments.filter((a) => a.id && a.id.slice(0, -1) === building && !a.hidden)
                    if (units.length === 0) return null
                    return (
                      <Fragment key={building}>
                        <tr className="bg-accent/5 border-b border-accent/10">
                          <td colSpan={6} className="px-5 md:px-6 py-3">
                            <span className="text-xs font-bold text-accent uppercase tracking-widest">
                              Pozemek č. {building} — Trojdům
                            </span>
                          </td>
                        </tr>
                        {units.map((apt) => {
                          const unit = apt.id.slice(-1)
                          return (
                            <tr
                              key={apt._id}
                              onClick={() => setSelectedApartment(apt)}
                              className={`hover:bg-gray-50 transition-colors group cursor-pointer ${apt.status === 'prodáno' ? 'opacity-60' : ''}`}
                            >
                              <td className="p-5 md:p-6">
                                <span className="font-black text-lg text-gray-900">Byt {apt.id}</span>
                                <span className="ml-2 text-xs text-gray-400">{unitConfig[unit]?.desc ?? ''}</span>
                              </td>
                              <td className="p-5 md:p-6 text-gray-600">{apt.disposition ?? '–'}</td>
                              <td className="p-5 md:p-6 text-gray-900 font-medium">{apt.area ?? '–'}</td>
                              <td className="p-5 md:p-6 text-gray-600">{apt.gardenArea ?? '–'}</td>
                              <td className="p-5 md:p-6 font-bold text-gray-900 group-hover:text-accent transition-colors">{apt.price ?? '–'}</td>
                              <td className="p-5 md:p-6 text-center"><StatusBadge status={apt.status} /></td>
                            </tr>
                          )
                        })}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="block md:hidden text-center py-3 bg-gray-50 border-t border-gray-100 text-gray-500 text-xs">
              ← Posunutím zobrazíte další informace →
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

      {/* MODAL */}
      {selectedApartment && (
        <div
          className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6"
          onClick={() => setSelectedApartment(null)}
        >
          <div
            className="relative bg-white w-full h-full md:h-auto md:max-h-[92vh] md:max-w-5xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedApartment(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-gray-100 flex items-center justify-center shadow-md transition-all"
              aria-label="Zavřít"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* LEVÝ SLOUPEC */}
            <div className="w-full md:w-[42%] flex flex-col p-8 md:p-10 overflow-y-auto">
              <StatusBadge status={selectedApartment.status} />
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-8 leading-tight">
                Byt {selectedApartment.id}
              </h2>

              <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                {selectedApartment.description ?? APARTMENT_DESCRIPTION_DEFAULT}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-8">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Označení</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedApartment.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Jednotka</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {selectedApartment.id.slice(-1)}
                    <span className="text-base font-normal text-gray-400 ml-2">{unitConfig[selectedApartment.id.slice(-1)]?.desc ?? ''}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Dispozice</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedApartment.disposition ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Plocha bytu</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedApartment.area ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Plocha zahrady</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedApartment.gardenArea ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Stav</p>
                  <p className={`text-2xl font-bold ${statusConfig[selectedApartment.status].text}`}>
                    {statusConfig[selectedApartment.status].label}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cena vč. DPH</p>
                  <p className="text-3xl font-bold text-accent">{selectedApartment.price ?? '–'}</p>
                </div>
              </div>

              <Link
                href="/#Kontakt"
                onClick={() => setSelectedApartment(null)}
                className="flex items-center justify-center w-full bg-accent hover:bg-accentDark text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 group shadow-[0_0_20px_rgba(239,134,37,0.3)] mt-auto"
              >
                Poptat byt
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* PRAVÝ SLOUPEC */}
            <div className="w-full md:w-[58%] bg-gray-50 flex flex-col min-h-[320px] md:min-h-0 border-t md:border-t-0 md:border-l border-gray-100">
              <ModalCarousel
                images={
                  // Vlastní fotky bytu → centrální galerie → hardcoded záloha (v ModalCarousel)
                  (selectedApartment.photos?.filter(Boolean).length ?? 0) > 0
                    ? selectedApartment.photos!.filter(Boolean)
                    : galleryImages
                }
                floorPlans={selectedApartment.floorPlans ?? []}
                catalogSheets={selectedApartment.catalogSheets ?? []}
              />
            </div>
          </div>
        </div>
      )}

      {/* TOOLTIP */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 16, top: tooltip.y - 10 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 min-w-[190px]">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Byt {tooltip.apartment.id}</p>
            <p className="text-lg font-bold text-gray-900 mb-1">{tooltip.apartment.area ?? '–'}</p>
            {tooltip.apartment.gardenArea && (
              <p className="text-xs text-gray-500 mb-2">{tooltip.apartment.gardenArea} zahrada</p>
            )}
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={tooltip.apartment.status} />
              <span className="text-sm font-bold text-accent">{tooltip.apartment.price ?? '–'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
