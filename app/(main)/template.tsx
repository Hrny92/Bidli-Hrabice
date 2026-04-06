'use client'

import { useEffect, useState } from 'react'

type Phase = 'instant'   // přímý vstup – plně viditelné, žádná animace
           | 'hidden'    // interní navigace – začínáme na 0 (žádná transition)
           | 'fadein'    // fade-in běží (transition + opacity 1)

export default function Template({ children }: { children: React.ReactNode }) {
  /**
   * Líný inicializátor – rozhodne se synchronně při prvním renderu na klientu:
   *   přímý vstup   → 'instant'  (obsah okamžitě viditelný)
   *   interní nav   → 'hidden'   (obsah schovaný, useEffect spustí fade-in)
   */
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === 'undefined') return 'instant'
    return sessionStorage.getItem('nav_internal') ? 'hidden' : 'instant'
  })

  useEffect(() => {
    if (phase !== 'hidden') return
    // Jeden rAF: browser namaluje opacity:0 → pak přepneme na fade-in
    const raf = requestAnimationFrame(() => setPhase('fadein'))
    return () => cancelAnimationFrame(raf)
  }, [])

  const style: React.CSSProperties =
    phase === 'hidden'  ? { opacity: 0 } :
    phase === 'fadein'  ? { opacity: 1, transition: 'opacity 0.35s ease' } :
                          {}

  return (
    <div id="page-wrapper" style={style}>
      {children}
    </div>
  )
}
