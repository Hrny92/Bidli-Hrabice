'use client'

import { useState } from 'react'
import Image from 'next/image'

interface YoutubeCardProps {
  videoId: string
  title?: string
}

export default function YoutubeCard({ videoId, title = 'Přehrát video' }: YoutubeCardProps) {
  const [playing, setPlaying] = useState(false)
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div className="md:col-span-2 aspect-video rounded-[2.5rem] overflow-hidden relative group border border-gray-200 shadow-xl bg-black">
      {playing ? (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}?si=zJp6O9jjAHqHK5Y2&autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full cursor-pointer"
          aria-label={title}
        >
          {/* Thumbnail */}
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Tmavý overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          {/* Play tlačítko */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(239,134,37,0.5)]">
              <svg className="w-9 h-9 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-white font-bold tracking-widest uppercase text-sm drop-shadow">
              {title}
            </span>
          </div>
        </button>
      )}
    </div>
  )
}
