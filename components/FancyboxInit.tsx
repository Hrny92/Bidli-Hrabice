'use client'

/**
 * FancyboxInit – načte Fancybox z CDN a inicializuje galerie.
 * Umístit jednou do root layoutu. Funguje i po klientské navigaci Next.js
 * díky event delegaci (bind je globální na document).
 */

import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    Fancybox?: {
      bind: (selector: string, options?: object) => void
      destroy: () => void
      unbind: (selector: string) => void
    }
  }
}

const FANCYBOX_OPTIONS = {
  animated: true,
  dragToClose: false,
  Images: {
    zoom: true,
  },
  Toolbar: {
    display: {
      left: ['infobar'],
      middle: [],
      right: ['thumbs', 'close'],
    },
  },
  Thumbs: {
    type: 'classic',
  },
  Carousel: {
    transition: 'slide',
    friction: 0.8,
  },
}

function bindFancybox() {
  if (typeof window !== 'undefined' && window.Fancybox) {
    window.Fancybox.unbind('[data-fancybox]')
    window.Fancybox.bind('[data-fancybox]', FANCYBOX_OPTIONS)
  }
}

export default function FancyboxInit() {
  const pathname = usePathname()
  const loaded = useRef(false)

  // Re-bind po každé navigaci (pro jistotu, Fancybox používá event delegation)
  useEffect(() => {
    if (loaded.current) {
      bindFancybox()
    }
  }, [pathname])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          loaded.current = true
          bindFancybox()
        }}
      />
    </>
  )
}
