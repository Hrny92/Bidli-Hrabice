'use client'

/**
 * ModalCarousel – pravý sloupec modálního okna
 *
 * Rozložení:
 *   ┌────────────────────────────────┐
 *   │  Fotogalerie (carousel, flex-1)│
 *   ├────────────────────────────────┤
 *   │  Soubory ke stažení            │  ← zobrazí se jen pokud existují
 *   │  Půdorysy / Katalogové listy   │
 *   └────────────────────────────────┘
 */

import { useState } from 'react'
import Image from 'next/image'
import { galleryData } from '@/components/GallerySection'

// ─── Záložní fotky (hardcoded) – použijí se pokud Sanity album je prázdné ─────
const FALLBACK_IMAGES: string[] = [
  ...(galleryData.find((g) => g.id === 'exteriery')?.images ?? []),
  ...(galleryData.find((g) => g.id === 'interiery')?.images ?? []),
]

// ─── Typy ────────────────────────────────────────────────────────────────────

export interface ModalFile {
  url: string
  mimeType?: string
  originalFilename?: string
  title?: string
}

interface Props {
  images?: string[]
  floorPlans?: ModalFile[]
  catalogSheets?: ModalFile[]
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function isPdf(file: ModalFile) {
  return (
    file.mimeType === 'application/pdf' ||
    file.url?.toLowerCase().endsWith('.pdf')
  )
}

// ─── Fotky carousel ──────────────────────────────────────────────────────────

function PhotoCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  const total = images.length

  if (!total) return (
    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm bg-gray-100">
      Žádné fotografie
    </div>
  )

  return (
    <div className="relative flex-1 min-h-[240px] md:min-h-[340px] bg-gray-900 overflow-hidden">
      <Image
        key={images[index]}
        src={images[index]}
        alt={`Foto ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 58vw"
      />

      {/* Počítadlo */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none">
        {index + 1} / {total}
      </div>

      {/* Šipka vlevo */}
      <button
        onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + total) % total) }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-105"
        aria-label="Předchozí"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Šipka vpravo */}
      <button
        onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % total) }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-105"
        aria-label="Další"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Tečky */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {images.slice(0, Math.min(total, 9)).map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIndex(i) }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
        {total > 9 && <span className="text-white/50 text-xs leading-none self-center">…</span>}
      </div>
    </div>
  )
}

// ─── Jeden soubor ke stažení ──────────────────────────────────────────────────

function DownloadItem({ file, index }: { file: ModalFile; index: number }) {
  const pdf = isPdf(file)
  const name = file.title ?? file.originalFilename ?? `Soubor ${index + 1}`

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 group transition-colors"
    >
      {/* Ikona typu */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${pdf ? 'bg-red-50' : 'bg-blue-50'}`}>
        {pdf ? (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm0 0V8.25m6 3.75a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      {/* Název */}
      <span className="text-sm text-gray-700 truncate flex-1 group-hover:text-gray-900 transition-colors">
        {name}
      </span>

      {/* Šipka otevřít */}
      <svg className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}

// ─── Sekce souborů ke stažení ─────────────────────────────────────────────────

function DownloadsSection({ floorPlans, catalogSheets }: { floorPlans: ModalFile[]; catalogSheets: ModalFile[] }) {
  const hasFiles = floorPlans.length > 0 || catalogSheets.length > 0
  if (!hasFiles) return null

  return (
    <div className="shrink-0 bg-white border-t border-gray-100 overflow-y-auto" style={{ maxHeight: '220px' }}>
      <div className="px-2 py-3">

        {floorPlans.length > 0 && (
          <div className="mb-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold px-3 pb-1.5">
              Půdorysy
            </p>
            {floorPlans.map((f, i) => (
              <DownloadItem key={i} file={f} index={i} />
            ))}
          </div>
        )}

        {catalogSheets.length > 0 && (
          <div className={floorPlans.length > 0 ? 'mt-2 pt-2 border-t border-gray-50' : ''}>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold px-3 pb-1.5">
              Katalogové listy
            </p>
            {catalogSheets.map((f, i) => (
              <DownloadItem key={i} file={f} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Hlavní komponenta ────────────────────────────────────────────────────────

export default function ModalCarousel({ images = [], floorPlans = [], catalogSheets = [] }: Props) {
  // Pokud Sanity nemá fotky, použij hardcoded zálohu
  const displayImages = images.length > 0 ? images : FALLBACK_IMAGES

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Fotogalerie – roste a vyplní dostupný prostor */}
      <PhotoCarousel images={displayImages} />

      {/* Soubory ke stažení – jen pokud jsou nahrané v Sanity */}
      <DownloadsSection floorPlans={floorPlans} catalogSheets={catalogSheets} />
    </div>
  )
}
