'use client'

import { Fragment, useState } from 'react'
import Image from 'next/image'
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

// ── Interaktivní mapa ──────────────────────────────────────────────────────────
// Rozměry podkladového snímku (mapa.png): 2688 × 772 px
// SVG viewBox musí odpovídat těmto rozměrům.
//
// Jak přidat tvar:
//   - polygon (přímé strany):  { kind: 'polygon', points: 'x1,y1 x2,y2 ...' }
//   - path (zahnuté strany):   { kind: 'path', d: 'M... Z' }
//   Hodnoty zkopírujte přímo z Figmy / Inkscapu – souřadnice jsou ve stejném
//   prostoru jako viewBox="0 0 2688 772".
//
type HouseShape =
  | { kind: 'polygon'; points: string }
  | { kind: 'path'; d: string }

const HOUSE_SHAPES: Record<string, HouseShape> = {
  // ── Dvojdomy ──────────────────────────────────────────────────────────────
  SO01: { kind: 'path',    d: 'M2274.75,300.53l-15.29,75.71-9.18,22.94-10.71,154.47,141.47,52,177.41-186.59,16.06-33.06s-7.65-21.23-35.94-25.82-119.29-16.06-119.29-16.06l1.53-19.88-146.06-23.71Z' },
  SO02: { kind: 'polygon', points: '2067.37 282.4 2132.46 294.55 2135.94 282.4 2274.75 300.53 2259.46 376.24 2250.28 399.18 2239.58 553.65 1998.8 463.8 2002.28 453.09 2067.37 282.4' },
  SO03: { kind: 'polygon', points: '1870.74 233.41 1863.53 257.91 1857.29 268.49 1857.29 282.4 1850.08 301.16 1850.08 310.77 1807.31 379.48 1807.31 398.7 1998.8 463.8 2002.28 453.09 2067.37 282.4 1991.82 273.77 1992.3 252.15 1870.74 233.41' },
  SO04: { kind: 'polygon', points: '1716.5 224.76 1750.14 231.01 1755.9 214.67 1870.74 233.41 1863.53 257.91 1857.29 268.49 1857.29 282.4 1850.08 301.16 1850.08 310.77 1807.31 379.48 1807.31 398.7 1593.02 317.98 1593.02 306.68 1716.5 224.76' },
  SO05: { kind: 'path',    d: 'M1741.13,153.44l-14.41,36.62v17.48h3.75l72.69,12.06,257.98,40.83,2.17-14.23,16.39-56.61s-73.93-57.85-93.11-59.08l-113.22,10.21-13.92-2.47-.62,5.26-117.71,9.93Z' },
  SO06: { kind: 'polygon', points: '1555.04 117.71 1632.09 113.66 1643.81 108.25 1741.13 153.44 1726.72 190.06 1726.72 194.86 1726.72 207.55 1660.03 205.13 1566.76 209.64 1564.5 192.96 1565.41 170.88 1555.04 117.71' },
  SO07: { kind: 'polygon', points: '1234.21 147 1239.62 142.05 1461.77 128.98 1463.57 124.47 1555.04 117.71 1565.41 170.88 1564.5 192.96 1566.76 209.64 1507.73 214.67 1498.26 216.85 1458.16 219.55 1443.29 221.8 1423.91 232.62 1423.01 214.67 1321.63 175.17 1234.21 147' },
  SO08: { kind: 'path',    d: 'M1189,336.02l234.92-103.41-.9-17.95-87.51-34.1-157.34,42.14-28.96-11.9-26.98-2.78-17.06-7.54-42.85,57.8v3.08l7.38,2.28-1.14,5.51-72.61,24.71,1.14,16.35,26.23,18.44,42.77,21.1,25.28,10.83s30.79,4.75,50.37-2.47l47.27-22.1Z' },
  SO09: { kind: 'polygon', points: '1234.21 147 1335.5 180.57 1178.16 222.71 1149.19 210.81 1122.21 208.03 1105.15 200.5 1062.3 258.3 1062.3 261.37 1069.68 263.65 1068.54 269.17 995.93 293.88 997.07 310.23 918.21 264.47 918.21 253.81 1007.7 230.07 1047.58 174.97 1095.98 196.28 1234.21 147' },
  SO10: { kind: 'polygon', points: '1152.81 130.41 1026.13 157.99 1026.13 154.05 993.07 141.59 960.27 135.23 937.63 124.55 897.96 175.16 903.04 179.49 902.64 181.66 868.27 189.02 868.27 200.02 841.66 206.05 841.66 214.22 918.21 264.47 918.21 253.81 1007.7 230.07 1047.58 174.97 1095.98 196.28 1215.65 153.62 1152.81 130.41' },
  SO11: { kind: 'polygon', points: '1064.48 98.55 1152.81 130.41 1026.13 157.99 1026.13 154.05 993.07 141.59 960.27 135.23 937.63 124.55 897.96 175.16 903.04 179.49 902.64 181.66 868.27 189.02 868.27 200.02 841.66 206.05 841.66 214.22 786.95 180.57 786.95 172.74 855.1 153.22 893.04 105.34 932.45 121.91 955.66 122.65 1064.48 98.55' },
  SO12: { kind: 'polygon', points: '995.93 70.34 1064.48 98.55 955.66 122.65 932.45 121.91 893.04 105.34 855.1 153.22 786.95 172.74 786.95 180.57 724.7 142.54 724.7 134.07 773.32 121.91 809.42 74.76 860.62 95.39 995.93 70.34' },
  // ── Solitéry ──────────────────────────────────────────────────────────────
  SO13: { kind: 'polygon', points: '889.02 355.95 892.41 365.42 951.8 405.93 894.59 431.71 902.08 435.39 902.08 443.22 837.63 467.15 827.05 462.55 704.14 521.47 710.58 526.53 399.86 658.19 319.3 555.08 628.18 439.99 626.34 429.41 676.98 413.29 693.55 387.98 693.55 376.93 716.57 355.95 732.68 335.04 803.57 357.36 828.43 374.4 889.02 355.95' },
  SO14: { kind: 'polygon', points: '268.13 484.65 319.3 555.08 628.18 439.99 626.34 429.41 676.98 413.29 693.55 387.98 693.55 376.93 716.57 355.95 732.68 335.04 803.57 357.36 828.43 374.4 889.02 355.95 797.16 296.75 738.63 315.23 681.65 296.75 626.97 366.06 268.13 484.65' },
  SO15: { kind: 'polygon', points: '559.98 305.22 513.78 318.31 513.78 335.04 221.15 422.27 268.13 484.65 626.97 366.06 681.65 296.75 738.63 315.23 797.16 296.75 758.29 267.22 756.49 257.47 698.34 276.25 669.8 255.67 608.04 234.72 591.42 252.78 563.97 264.7 564.33 274.09 548.8 292.15 561.08 301.9 559.98 305.22' },
  SO16: { kind: 'polygon', points: '177.36 362.46 221.15 422.27 513.78 335.04 513.78 318.31 559.98 305.22 561.08 301.9 548.8 292.15 564.33 274.09 563.97 264.7 591.42 252.78 608.04 234.72 669.8 255.67 698.34 276.25 756.49 257.47 692.68 210.06 692.35 214.27 631.78 229.82 625.95 226.58 571.86 206.5 520.36 264.15 523.93 268.36 177.36 362.46' },
  SO17: { kind: 'polygon', points: '463.18 218.57 424.56 228.04 427.37 240.95 139.65 307.79 177.36 362.46 523.93 268.36 520.36 264.15 571.86 206.5 631.78 229.82 692.35 214.27 648.25 184.9 594.69 198.6 569.36 180.75 510.82 158.33 496.29 172.86 471.38 185.73 471.8 193.2 456.85 206.5 465.46 215.27 463.18 218.57' },
  SO18: { kind: 'polygon', points: '105.61 266.33 139.65 307.79 427.37 240.95 424.56 228.04 463.18 218.57 465.46 215.27 456.85 206.5 471.8 193.2 471.38 185.73 496.29 172.86 510.82 158.33 569.36 180.75 594.69 198.6 648.25 184.9 607.29 158.33 552.59 168.77 539.12 158.33 481.97 136.52 437.07 187.95 105.61 262.65 105.61 266.33' },
}

// Barvy dle stavu – normální / hover
const SHAPE_FILL: Record<HouseStatus, { normal: string; hover: string }> = {
  'volný':       { normal: 'rgba(34,197,94,0.30)',   hover: 'rgba(34,197,94,0.60)'   },
  'rezervováno': { normal: 'rgba(251,146,60,0.35)',  hover: 'rgba(251,146,60,0.65)'  },
  'prodáno':     { normal: 'rgba(156,163,175,0.35)', hover: 'rgba(156,163,175,0.65)' },
}
const SHAPE_STROKE: Record<HouseStatus, string> = {
  'volný':       '#16a34a',
  'rezervováno': '#ea580c',
  'prodáno':     '#9ca3af',
}

// Střed tvaru pro label
// polygon: průměr vrcholů
// path:    skutečný parser – převede relativní příkazy (l, v, c, s…) na absolutní
//          souřadnice a vrátí průměr vrcholů (kontrolní body Bezier přeskakujeme)
function pathEndpoints(d: string): Array<[number, number]> {
  const pts: Array<[number, number]> = []
  let cx = 0, cy = 0
  const nums = (raw: string) => (raw.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
  const cmdRe = /([MmLlHhVvCcSsZz])([^MmLlHhVvCcSsZz]*)/g
  let m: RegExpExecArray | null
  while ((m = cmdRe.exec(d)) !== null) {
    const cmd = m[1], a = nums(m[2])
    switch (cmd) {
      case 'M': for (let i=0;i+1<a.length;i+=2){ cx=a[i];cy=a[i+1];pts.push([cx,cy]) } break
      case 'm': for (let i=0;i+1<a.length;i+=2){ cx+=a[i];cy+=a[i+1];pts.push([cx,cy]) } break
      case 'L': for (let i=0;i+1<a.length;i+=2){ cx=a[i];cy=a[i+1];pts.push([cx,cy]) } break
      case 'l': for (let i=0;i+1<a.length;i+=2){ cx+=a[i];cy+=a[i+1];pts.push([cx,cy]) } break
      case 'H': for (let i=0;i<a.length;i++){ cx=a[i];pts.push([cx,cy]) } break
      case 'h': for (let i=0;i<a.length;i++){ cx+=a[i];pts.push([cx,cy]) } break
      case 'V': for (let i=0;i<a.length;i++){ cy=a[i];pts.push([cx,cy]) } break
      case 'v': for (let i=0;i<a.length;i++){ cy+=a[i];pts.push([cx,cy]) } break
      // Cubic bezier – endpoint je každý 6. pár (absolutní)
      case 'C': for (let i=0;i+5<a.length;i+=6){ cx=a[i+4];cy=a[i+5];pts.push([cx,cy]) } break
      // Cubic bezier – endpoint je každý 6. pár (relativní)
      case 'c': for (let i=0;i+5<a.length;i+=6){ cx+=a[i+4];cy+=a[i+5];pts.push([cx,cy]) } break
      // Smooth cubic bezier – endpoint je každý 4. pár (absolutní)
      case 'S': for (let i=0;i+3<a.length;i+=4){ cx=a[i+2];cy=a[i+3];pts.push([cx,cy]) } break
      // Smooth cubic bezier – endpoint je každý 4. pár (relativní)
      case 's': for (let i=0;i+3<a.length;i+=4){ cx+=a[i+2];cy+=a[i+3];pts.push([cx,cy]) } break
    }
  }
  return pts
}

function shapeCentroid(shape: HouseShape): { cx: number; cy: number } {
  let pts: Array<[number, number]>
  if (shape.kind === 'polygon') {
    const a = shape.points.trim().split(/[\s,]+/).map(Number)
    pts = []
    for (let i = 0; i + 1 < a.length; i += 2) pts.push([a[i], a[i+1]])
  } else {
    pts = pathEndpoints(shape.d)
  }
  if (!pts.length) return { cx: 0, cy: 0 }
  return {
    cx: pts.reduce((s, [x]) => s + x, 0) / pts.length,
    cy: pts.reduce((s, [, y]) => s + y, 0) / pts.length,
  }
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
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Lookup map id → house
  const houseById = Object.fromEntries(houses.map((h) => [h.id, h]))

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
        <div className="relative flex flex-col justify-center h-full rounded-[3rem] overflow-hidden bg-gray-900">
          <Image
            src="/img/ext-1.png"
            alt="Vizualizace rodinných domů Hrabice"
            fill
            className="object-cover pointer-events-none"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />
          <div className="relative z-10 container mx-auto px-6 mt-16 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Nabídka <span className="text-accent">domů</span>
              </h1>
              <p className="text-lg md:text-xl font-light opacity-90">
                20 rodinných domů ve hrubé stavbě — vyberte si ten svůj a dokončete ho po svém.
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

      {/* MAPA – interaktivní situační výkres */}
      <section className="py-12 md:py-16 container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Situace lokality</h2>
          <p className="text-gray-600 font-light text-lg">Klikněte na dům pro zobrazení detailu.</p>
        </div>

        {/* Wrapper zachovává poměr stran 2688:772 */}
        <div
          className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 bg-gray-100"
          style={{ aspectRatio: '2688 / 772' }}
        >
          {/* Podkladový snímek */}
          <Image
            src="/img/mapa.webp"
            alt="Situační mapa lokality Hrabice"
            fill
            className="object-cover pointer-events-none select-none"
            sizes="(max-width: 1280px) 100vw, 1152px"
            priority
          />

          {/* SVG overlay – tvary domů */}
          <svg
            viewBox="0 0 2688 772"
            className="absolute inset-0 w-full h-full z-10"
            preserveAspectRatio="xMidYMid meet"
            style={{ cursor: 'default' }}
          >
            {Object.entries(HOUSE_SHAPES).map(([soId, shape]) => {
              const house = houseById[soId]
              if (!house || house.hidden) return null
              const st = house.status
              const { cx, cy } = shapeCentroid(shape)

              const isHovered = hoveredId === soId
              // Společné SVG props pro polygon i path
              const shapeProps = {
                fill: isHovered ? SHAPE_FILL[st].hover : SHAPE_FILL[st].normal,
                stroke: SHAPE_STROKE[st],
                strokeWidth: isHovered ? 4 : 3,
                strokeLinejoin: 'round' as const,
                style: { cursor: 'pointer', transition: 'fill 0.15s, stroke-width 0.15s' },
                onMouseEnter: (e: React.MouseEvent<SVGElement>) => {
                  setHoveredId(soId)
                  const svgEl = e.currentTarget.closest('svg') as SVGSVGElement
                  const pt = svgEl.createSVGPoint()
                  pt.x = e.clientX; pt.y = e.clientY
                  const svgPt = pt.matrixTransform(svgEl.getScreenCTM()!.inverse())
                  setTooltip({ house, x: svgPt.x, y: svgPt.y })
                },
                onMouseLeave: () => { setHoveredId(null); setTooltip(null) },
                onClick: () => { setHoveredId(null); setTooltip(null); setSelectedHouse(house) },
              }

              return (
                <g key={soId}>
                  {shape.kind === 'polygon'
                    ? <polygon points={shape.points} {...shapeProps} />
                    : <path d={shape.d} {...shapeProps} />
                  }
                  {/* Label – označení domu */}
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={28}
                    fontWeight="bold"
                    fill="white"
                    stroke="rgba(0,0,0,0.6)"
                    strokeWidth={4}
                    paintOrder="stroke"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {soId}
                  </text>
                </g>
              )
            })}

            {/* Tooltip uvnitř SVG */}
            {tooltip && (() => {
              const { house, x, y } = tooltip
              const tw = 260; const th = 80
              // Posun tooltippu, aby nevylezl mimo viewBox
              const tx = Math.min(x + 16, 2688 - tw - 8)
              const ty = Math.max(y - th - 12, 8)
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <rect x={tx} y={ty} width={tw} height={th} rx={12} fill="white" opacity={0.97} filter="drop-shadow(0 4px 16px rgba(0,0,0,0.18))" />
                  <text x={tx + 16} y={ty + 26} fontSize={22} fontWeight="bold" fill="#111">{house.id} – {house.typ}</text>
                  <text x={tx + 16} y={ty + 50} fontSize={18} fill="#555">{house.price ?? 'Cena na dotaz'}</text>
                  <text x={tx + 16} y={ty + 70} fontSize={15} fill={SHAPE_STROKE[house.status]}>{statusConfig[house.status].label}</text>
                </g>
              )
            })()}
          </svg>
        </div>

        {/* Legenda pod mapou */}
        <div className="flex flex-wrap justify-center gap-4 mt-5 text-sm text-gray-600">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Volný</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400" /> Rezervace</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400" /> Prodáno</div>
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

      {/* DISCLAIMER – vizualizace */}
      <section className="container mx-auto px-6 pb-8 -mt-4">
        <p className="text-center text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
          * Fotografie a vizualizace jsou pouze ilustrační. Skutečná podoba dokončených domů se může lišit v závislosti na zvoleném provedení interiérů, materiálech a terénních úpravách pozemku.
        </p>
      </section>

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
              {(selectedHouse.photos?.filter(Boolean).length ?? 0) === 0 &&
               (selectedHouse.floorPlans?.length ?? 0) === 0 &&
               (selectedHouse.catalogSheets?.length ?? 0) === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-sm font-medium">Fotografie zatím nejsou k dispozici</p>
                  <p className="text-gray-300 text-xs">Kontaktujte nás pro více informací o tomto domu.</p>
                </div>
              ) : (
                <ModalCarousel
                  images={selectedHouse.photos?.filter(Boolean) ?? []}
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
