'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import GallerySection, { type SanityGalleryAlbum } from '@/components/GallerySection'
import ModalCarousel from '@/components/ModalCarousel'

export type PlotStatus = 'volný' | 'rezervováno' | 'prodáno'

import type { ModalFile } from '@/components/ModalCarousel'

export interface SanityPlot {
  _id: string
  number: string
  disposition?: string
  floorArea?: string
  plotSize?: string
  price?: string
  status: PlotStatus
  hidden?: boolean
  description?: string
  floorPlans?: ModalFile[]
  catalogSheets?: ModalFile[]
}

// ─── Hardcoded polygon souřadnice (viewBox 0 0 1280 853) ───────────────────
// Klíč = číslo pozemku jako string. FIXNÍ – nemění se ze Sanity.
// Přečíslování: 11→20, 12→19, 13→18, 14→17, 15→16, 16→15
const POLYGON_POINTS: Record<string, string> = {
  '20': '192.43 593.73 152.65 674.52 143.72 742.11 149.4 743.13 154.68 745.56 160.36 749.62 320.92 742.11 369.02 699.69 383.43 585.82 192.43 593.73',
  '19': '244.26 462.05 401.58 455.72 386.25 581.98 194.62 589.33 244.26 462.05',
  '18': '284.98 345.54 339.59 343.48 348.86 336.61 362.26 341.81 415.5 341.07 401.76 452.01 245.13 457.85 284.98 345.54',
  '17': '276.21 250.1 354.91 248.67 368.57 237.31 386.74 246.88 429.11 246.88 416.95 337.88 355.75 339.28 348.86 336.61 343.83 340.33 285.19 341.81 294.84 313.92 276.21 250.1',
  '16': '480.25 181.88 475.81 243.03 383.23 244.74 368.57 237.31 358.47 246.08 290.27 247.6 275.04 247.6 271.23 220.36 383.61 197.12 383.8 191.02 444.19 188.17 480.25 181.88',
  '15': '587.89 164.89 485.5 182.44 477.31 282.69 502.37 298.6 591.06 298.6 587.89 164.89',
  '1':  '1149.43 468.31 1059.42 477.35 1010.76 479.5 1090.86 694.4 1189.05 692.25 1214.89 650.05 1194.22 569.08 1149.43 468.31',
  '2':  '874.1 485.17 1006.58 480.4 1085.25 694.4 929.52 700.78 874.1 485.17',
  '3':  '735.97 490.45 868.69 485.59 924.4 700.78 766.25 708.42 735.97 490.45',
  '4':  '596.44 496.55 731.73 491.51 761.33 709.99 602.36 717.68 596.44 496.55',
  '5':  '591.7 495.95 597.62 717.68 480.69 725.38 442.2 689.86 456.41 501.28 591.7 495.95',
  '6':  '591.94 492.77 456.57 498.1 468.25 358.3 500.02 335.63 588.98 332.32 591.94 492.77',
  '7':  '591.94 332.32 596.44 491.51 730.95 486.88 709 327.86 591.94 332.32',
  '8':  '713.77 327.86 735.97 485.59 868.34 480.4 828.9 323.09 713.77 327.86',
  '9':  '832.72 323.09 874.1 480.4 1005.41 475.75 948.16 318.64 832.72 323.09',
  '10': '952.61 318.64 1010.76 475.43 1059.15 473.52 1148.2 463.66 1090.32 332 1053.11 314.51 952.61 318.64',
}

const PLOT_DESCRIPTION_DEFAULT = 'Pozemek je situován v klidné části lokality s přímým přístupem na obslužnou komunikaci. Součástí je platné stavební povolení a kompletní projektová dokumentace pro prostorný rodinný dům dispozice 5+1 s podlahovou plochou 260 m².'

const statusConfig: Record<PlotStatus, { label: string; badge: string; dot: string }> = {
  'volný':       { label: 'Volný',     badge: 'bg-green-100 text-green-700 border-green-200',   dot: 'bg-green-500' },
  'rezervováno': { label: 'Rezervace', badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
  'prodáno':     { label: 'Prodáno',   badge: 'bg-gray-100 text-gray-500 border-gray-200',       dot: 'bg-gray-400' },
}

const polygonColor: Record<PlotStatus, string> = {
  'volný':       'fill-green-400/20 hover:fill-green-400/60',
  'rezervováno': 'fill-orange-400/20 hover:fill-orange-400/60',
  'prodáno':     'fill-gray-400/20 hover:fill-gray-400/60',
}

function StatusBadge({ status }: { status: PlotStatus }) {
  const { label, badge } = statusConfig[status]
  return (
    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border ${badge}`}>
      {label.toUpperCase()}
    </span>
  )
}

interface TooltipState {
  plot: SanityPlot
  x: number
  y: number
}

interface Props {
  plots: SanityPlot[]
  galleryImages?: string[]
  albums?: SanityGalleryAlbum[]
}

export default function PozemkyClient({ plots, galleryImages = [], albums }: Props) {
  const [selectedPlot, setSelectedPlot] = useState<SanityPlot | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  // Mapa pozemků podle čísla (pro rychlé vyhledávání)
  const plotByNumber = Object.fromEntries(plots.map((p) => [p.number, p]))

  function handleMouseMove(e: React.MouseEvent, plot: SanityPlot) {
    setTooltip({ plot, x: e.clientX, y: e.clientY })
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
            <Image src="/img/Dysina-hero.png" alt="Pozemky Dýšina" fill priority className="object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />
          </div>
          <div className="relative z-10 container mx-auto px-6 mt-16 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Nabídka <span className="text-accent">pozemků</span>
              </h1>
              <p className="text-lg md:text-xl font-light opacity-90">
                Vyberte si na interaktivní mapě ideální parcelu pro váš nový domov.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="py-20 md:py-32 container mx-auto px-6 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Interaktivní mapa</h2>
          <p className="text-gray-600 font-light text-lg">Najeďte na pozemek pro detail, kliknutím otevřete nabídku.</p>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(Object.entries(statusConfig) as [PlotStatus, typeof statusConfig[PlotStatus]][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`w-3 h-3 rounded-full ${val.dot}`} />
              {val.label}
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 bg-gray-50 aspect-[1280/853]">
          <Image src="/img/dysina.jpg" alt="Mapa pozemků" fill className="object-cover pointer-events-none" />
          <svg viewBox="0 0 1280 853" className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none">
            {Object.entries(POLYGON_POINTS).map(([num, points]) => {
              const plot = plotByNumber[num]
              if (!plot || plot.hidden) return null
              return (
                <polygon
                  key={num}
                  points={points}
                  className={`cursor-pointer transition-all duration-200 ${polygonColor[plot.status]}`}
                  onClick={() => setSelectedPlot(plot)}
                  onMouseMove={(e) => handleMouseMove(e, plot)}
                  onMouseLeave={handleMouseLeave}
                />
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
                    {['Pozemek', 'Dispozice RD', 'Velikost pozemku', 'Cena vč. DPH', 'Stav'].map((h) => (
                      <th key={h} className={`p-5 md:p-6 font-medium ${h === 'Stav' ? 'text-center' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {plots.filter((p) => !p.hidden).map((plot) => (
                    <tr
                      key={plot._id}
                      onClick={() => setSelectedPlot(plot)}
                      className={`hover:bg-gray-50 transition-colors group cursor-pointer ${plot.status === 'prodáno' ? 'opacity-60' : ''}`}
                    >
                      <td className="p-5 md:p-6 font-bold text-lg text-gray-900">Pozemek č. {plot.number}</td>
                      <td className="p-5 md:p-6 text-gray-600">{plot.disposition ?? '–'}</td>
                      <td className="p-5 md:p-6 text-gray-900 font-medium">{plot.plotSize ?? '–'}</td>
                      <td className="p-5 md:p-6 font-bold text-gray-900 group-hover:text-accent transition-colors">{plot.price ?? '–'}</td>
                      <td className="p-5 md:p-6 text-center"><StatusBadge status={plot.status} /></td>
                    </tr>
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

      {/* GALERIE */}
      <GallerySection
        groups={['exteriery', 'interiery', 'pudorysy']}
        title="Galerie projektu"
        albums={albums}
      />

      {/* FLOATING TOOLTIP */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 16, top: tooltip.y - 10 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 min-w-[180px]">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Pozemek č. {tooltip.plot.number}</p>
            <p className="text-lg font-bold text-gray-900 mb-2">{tooltip.plot.plotSize ?? '–'}</p>
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={tooltip.plot.status} />
              <span className="text-sm font-bold text-accent">{tooltip.plot.price ?? '–'}</span>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedPlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedPlot(null)}
        >
          <div
            className="relative bg-white w-full max-w-6xl max-h-[92vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Zavřít */}
            <button
              onClick={() => setSelectedPlot(null)}
              className="absolute top-5 right-5 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* LEVÝ SLOUPEC */}
            <div className="w-full md:w-[42%] flex flex-col p-8 md:p-10 overflow-y-auto">
              <div className="mb-1">
                <StatusBadge status={selectedPlot.status} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-8 leading-tight">
                Pozemek č.{selectedPlot.number}
              </h2>

              <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                {selectedPlot.description ?? PLOT_DESCRIPTION_DEFAULT}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-8">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Označení</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedPlot.number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Dispozice dle dokumentace</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedPlot.disposition ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Užitná plocha m²</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedPlot.floorArea ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Velikost pozemku m²</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedPlot.plotSize ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Stav</p>
                  <p className={`text-2xl font-bold ${
                    selectedPlot.status === 'volný' ? 'text-green-600' :
                    selectedPlot.status === 'rezervováno' ? 'text-orange-500' : 'text-gray-400'
                  }`}>
                    {statusConfig[selectedPlot.status].label}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cena</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedPlot.price ?? '–'}</p>
                </div>
              </div>

              <Link
                href="/#Kontakt"
                onClick={() => setSelectedPlot(null)}
                className="flex items-center justify-center w-full bg-accent hover:bg-accentDark text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 group shadow-[0_0_20px_rgba(239,134,37,0.3)] mt-auto"
              >
                Poptat nemovitost
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* PRAVÝ SLOUPEC – carousel */}
            <div className="w-full md:w-[58%] bg-gray-50 flex flex-col min-h-[320px] md:min-h-0 border-t md:border-t-0 md:border-l border-gray-100">
              <ModalCarousel
                images={galleryImages}
                floorPlans={selectedPlot.floorPlans ?? []}
                catalogSheets={selectedPlot.catalogSheets ?? []}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
