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
// Rozměry podkladového snímku (Dron 1 finalni.png): 2784 × 1536 px
// SVG viewBox musí odpovídat těmto rozměrům.
//
// Jak přidat tvar:
//   - polygon (přímé strany):  { kind: 'polygon', points: 'x1,y1 x2,y2 ...' }
//   - path (zahnuté strany):   { kind: 'path', d: 'M... Z' }
//   Hodnoty zkopírujte přímo z Figmy / Inkscapu – souřadnice jsou ve stejném
//   prostoru jako viewBox="0 0 2784 1536".
//
type HouseShape =
  | { kind: 'polygon'; points: string }
  | { kind: 'path'; d: string }

const HOUSE_SHAPES: Record<string, HouseShape> = {
  // ── Dvojdomy ──────────────────────────────────────────────────────────────
  SO01: { kind: 'path', d: 'M1626.3,1179.32l219-13.44,4.03-30.66,131.03-104.06,118.85,80.37,91.46-6.29,147.55,189.09,41.84,46.8,21.47,31.38s46.8,84.51-91.39,100.2c-56.71,4.72-205.36-5.78-205.36-5.78l-423.93-12.66-54.56-274.96Z' },
  SO02: { kind: 'polygon', points: '1597.91,1014.17 1626.3,1179.32 1845.31,1165.89 1849.34,1135.23 1980.37,1031.17 2099.22,1111.54 2190.69,1105.25 2094.8,981.1 2010.58,986.87 1906.01,914.28 1797.18,1000.22 1597.91,1014.17' },
  SO03: { kind: 'polygon', points: '1709.39,883.55 1580.25,891.4 1597.91,1014.17 1797.18,1000.22 1906.01,914.28 2010.58,986.87 2094.8,981.1 2005.74,869.95 1934.15,874.99 1822.13,787.23 1713.68,855.72 1709.39,883.55' },
  SO04: { kind: 'path', d: 'M1542.91,683.74l37.34,207.66,129.14-7.85,4.28-27.83,108.45-68.5,112.02,87.76,71.59-5.04-75.73-101.95s-77.78-86.07-171.84-96.02l-215.26,11.76Z' },
  SO06: { kind: 'path', d: 'M1774.32,612.22l25.52-25.07v-26.48l31.87-82.4,125.2,31.83,2.12,3.89,16.62,16.62,9.9,7.07,9.9-1.06,128.75,36.53-4.12,14.54-102.62,141.32s-112.24-74.5-243.14-116.78Z' },
  SO07: { kind: 'path', d: 'M1666.89,454.63l50.6,10.18,6.78-13.57,107.44,27.03-31.87,82.4v26.48l-25.52,25.07s-94.71-32.64-195.07-48.19v-18.66l27.14-32.23,33.07-31.94,27.42-26.57Z' },
  SO08: { kind: 'path', d: 'M1396.47,460.42v22.33l174.37,31.1v16.75l-31.1,29.77-63.53-4.52-126.52-3.46-198.02-5.05s-35.35-2.39-5.58-49.7l11.43-15.95,38.01-21.26,79.47-46.52h26.58l34.55-17.28,60.34,63.79Z' },
  SO09: { kind: 'polygon', points: '1636.46,460.04 1570.84,513.85 1396.47,482.75 1396.47,460.42 1336.13,396.63 1301.58,413.91 1275,413.91 1321.1,384.33 1352.5,388.32 1385.99,366.69 1432.1,412.8 1636.46,460.04' },
  SO10: { kind: 'polygon', points: '1527.14,369.66 1527.14,390.81 1687.03,420.91 1636.46,460.04 1432.1,412.8 1385.99,366.69 1352.5,388.32 1321.1,384.33 1387.92,345.09 1413.17,345.09 1472.2,310.97 1527.14,369.66' },
  SO11: { kind: 'polygon', points: '1751.47,371.15 1687.03,420.91 1527.14,390.81 1527.14,369.66 1472.2,310.97 1413.17,345.09 1387.92,345.09 1460.48,302.31 1486.36,302.31 1513.7,285.71 1561.55,332.09 1751.47,371.15' },
  SO13: { kind: 'polygon', points: '1041.63,382.54 1041.63,408.75 1094.04,417.06 1094.04,430.48 1007.75,481.61 994.33,478.5 994.33,450.93 965.57,449.01 960.45,460.04 912.52,452.21 899.09,454.77 838.37,443.26 838.37,439.21 743.66,415.39 722.05,423.77 706.16,419.8 698.66,410.09 694.69,410.53 688.08,416.71 662.49,416.27 662.49,411.42 791.31,355.39 894.1,377.45 923.66,352.3 989.4,321.42 1041.63,382.54' },
  SO14: { kind: 'polygon', points: '878.27,316.78 791.31,355.39 894.1,377.45 923.66,352.3 989.4,321.42 1041.63,382.54 1041.63,408.75 1094.04,417.06 1094.04,430.48 1190,379.46 1189.15,364.6 1099.66,346.49 1048.94,292.14 994.95,318.59 984.73,322.41 878.27,303.01 878.27,316.78' },
  SO15: { kind: 'polygon', points: '1199.36,301 1199.24,329.77 1243.25,335.46 1243.27,349.96 1190,379.46 1189.15,364.6 1099.66,346.49 1048.94,292.14 990.65,320.2 984.73,322.41 878.27,303.01 984.98,265.74 1080.75,283.94 1097.99,269.58 1150.66,244.67 1199.36,301' },
  SO16: { kind: 'polygon', points: '1332.39,285.96 1332.39,300.55 1243.27,349.96 1243.25,335.46 1199.24,329.77 1199.36,301 1150.66,244.67 1097.99,269.58 1080.75,283.94 984.98,265.74 1042.62,244.67 1055.19,247.06 1055.59,239.36 1135.76,250.45 1200.71,220.5 1250.37,273.45 1332.39,285.96' },
  SO17: { kind: 'polygon', points: '1332.39,234.99 1332.39,255.24 1377.47,262.88 1377.47,275.49 1332.39,300.55 1332.39,285.96 1250.37,273.45 1200.71,220.5 1135.76,250.45 1055.59,239.36 1114.23,217.8 1210.89,225.82 1240.69,202.13 1288.06,179.59 1332.39,234.99' },
  SO18: { kind: 'polygon', points: '1426.37,236.14 1426.37,249.89 1377.47,275.49 1377.47,262.88 1332.39,255.24 1332.39,234.99 1288.06,179.59 1240.69,202.13 1210.89,225.82 1114.23,217.8 1158.68,198.31 1232.26,206.69 1330.01,159.75 1377.47,210.96 1369.65,215.2 1369.65,220.5 1426.37,236.14' },

  // ── Solitéry ──────────────────────────────────────────────────────────────
  SO05: { kind: 'polygon', points: '2100.48,639.63 2044.42,713.21 2183.87,870.88 2180.36,894.7 2420.72,870.88 2523.03,760.86 2526.53,742.64 2338.03,699.9 2250.33,641.84 2214.25,668.76 2114.88,645.69 2114.88,642.43 2100.48,639.63' },
  SO12: { kind: 'polygon', points: '1837.52,303.41 1751.47,371.15 1561.55,332.09 1513.7,285.71 1486.36,302.31 1460.48,302.31 1531.48,259.79 1548.03,261.73 1625.5,215.13 1677.14,266.48 1670.61,271.53 1670.57,273.95 1742.16,285.71 1837.52,303.41' },
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

        {/* Wrapper zachovává poměr stran 2784:1536 = 13:7.17 */}
        <div
          className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 bg-gray-100"
          style={{ aspectRatio: '2784 / 1536' }}
        >
          {/* Podkladový snímek */}
          <Image
            src="/img/dron-finalni.png"
            alt="Letecký pohled na lokalitu Hrabice"
            fill
            className="object-cover pointer-events-none select-none"
            sizes="(max-width: 1280px) 100vw, 1152px"
            priority
          />

          {/* SVG overlay – tvary domů */}
          <svg
            viewBox="0 0 2784 1536"
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
              const tx = Math.min(x + 16, 2784 - tw - 8)
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
