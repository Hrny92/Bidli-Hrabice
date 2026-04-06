/**
 * Sdílená knihovna ikon pro Bidli Dýšina
 *
 * Každá ikona má:
 *   - id:    klíč používaný v Sanity (value pole) i v kódu
 *   - label: český popis zobrazený v Sanity Studiu
 *   - svg:   SVG obsah (jeden nebo více <path> elementů)
 *
 * Použití:
 *   import { SiteIcon, ICON_LIST } from '@/lib/icons'
 *   <SiteIcon id="bolt" className="w-8 h-8 text-accent" />
 */

import React from 'react'

// ─── Definice ikon ──────────────────────────────────────────────────────────

const iconPaths: Record<string, React.ReactNode> = {

  // ── Obecné / Technické ──────────────────────────────────────────────────

  /** Stavební povolení, dokumenty */
  'document': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  ),

  /** Dům, projekt rodinného domu */
  'house': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  ),

  /** Energie, inženýrské sítě */
  'bolt': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  ),

  /** Klíč, předání nemovitosti */
  'key': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  ),

  /** Bezpečnost, záruka, garance */
  'shield': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  ),

  /** Stavba, rekonstrukce, práce */
  'wrench': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  ),

  /** Výhoda, kvalita, prémiové */
  'star': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  ),

  /** Hotovo, schváleno, v pořádku */
  'check': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),

  /** Budova, bytový dům, projekt */
  'building': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  ),

  /** Projekt, půdorys, plán */
  'plan': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  ),

  /** Garáž, parkování, auto */
  'car': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h1M13 16H9m4 0h3m0 0l2-7H6.5l-1 7m11.5 0H13" />
  ),

  /** Zahrada, terasa, pozemek */
  'garden': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </>
  ),

  // ── Lokalita / Vzdálenosti ──────────────────────────────────────────────

  /** Autobus, MHD, zastávka */
  'bus': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6v12M16 6v12M4 6h16a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18v2m12-2v2M3 10h18" />
    </>
  ),

  /** Vlak, nádraží */
  'train': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l-2 3m8-3l2 3M5 6h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M9 14h.01M15 14h.01" />
    </>
  ),

  /** Obchod, nákupy, supermarket */
  'shopping': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  ),

  /** Škola, školka, vzdělání */
  'school': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  ),

  /** Zdraví, lékárna, nemocnice */
  'health': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  ),

  /** Park, příroda, zeleň */
  'tree': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 10h14M5 14h14" />
    </>
  ),

  /** Sport, hřiště, fitnes */
  'sport': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  ),

  /** Restaurace, kavárna, stravování */
  'restaurant': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </>
  ),

  /** Místo, poloha – výchozí ikona */
  'map-pin': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </>
  ),

  /** Čas, dostupnost, hodiny */
  'clock': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </>
  ),

  /** Golf, sport na čerstvém vzduchu */
  'golf': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M12 3v12m0 0l-4-4m4 4l4-4" />
    </>
  ),

  /** Koupaliště, voda, plavání */
  'water': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  ),
}

// ─── Seznam pro Sanity (value + česky popsaný title) ───────────────────────

export const ICON_LIST = [
  // Obecné / Technické
  { value: 'document',   title: '📄 Dokument / Stavební povolení' },
  { value: 'house',      title: '🏠 Dům / Projekt domu' },
  { value: 'plan',       title: '📐 Půdorys / Plán' },
  { value: 'bolt',       title: '⚡ Energie / Inž. sítě' },
  { value: 'key',        title: '🔑 Klíč / Předání' },
  { value: 'shield',     title: '🛡️  Bezpečnost / Záruka' },
  { value: 'wrench',     title: '🔧 Stavba / Rekonstrukce' },
  { value: 'star',       title: '⭐ Výhoda / Prémiové' },
  { value: 'check',      title: '✅ Hotovo / Schváleno' },
  { value: 'building',   title: '🏢 Budova / Bytový dům' },
  { value: 'car',        title: '🚗 Garáž / Parkování' },
  { value: 'garden',     title: '🌿 Zahrada / Pozemek' },
  // Lokalita
  { value: 'bus',        title: '🚌 Autobus / MHD' },
  { value: 'train',      title: '🚆 Vlak / Nádraží' },
  { value: 'shopping',   title: '🛍️  Obchod / Nákupy' },
  { value: 'school',     title: '🎓 Škola / Školka' },
  { value: 'health',     title: '❤️  Zdraví / Lékárna' },
  { value: 'sport',      title: '🏆 Sport / Hřiště' },
  { value: 'restaurant', title: '🍽️  Restaurace / Kavárna' },
  { value: 'golf',       title: '⛳ Golf / Resort' },
  { value: 'water',      title: '🏊 Koupaliště / Voda' },
  { value: 'clock',      title: '⏰ Čas / Dostupnost' },
  { value: 'map-pin',    title: '📍 Místo (výchozí)' },
] as const

export type IconId = typeof ICON_LIST[number]['value']

// ─── Komponenta ─────────────────────────────────────────────────────────────

interface SiteIconProps {
  /** ID ikony (hodnota z ICON_LIST) */
  id?: string | null
  /** CSS třídy (ovlivní velikost a barvu) */
  className?: string
  strokeWidth?: number
}

export function SiteIcon({ id, className = 'w-6 h-6', strokeWidth = 1.5 }: SiteIconProps) {
  const paths = id && iconPaths[id] ? iconPaths[id] : iconPaths['map-pin']

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  )
}
