'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export type AosAnimation = 'up' | 'left' | 'right' | 'scale' | 'fade'

interface Props {
  children: ReactNode
  animation?: AosAnimation
  /** Zpoždění v ms — pro stagger efekt u karet */
  delay?: number
  /** Jak velká část elementu musí být vidět (0–1) */
  threshold?: number
  className?: string
}

export default function AnimateOnScroll({
  children,
  animation = 'up',
  delay = 0,
  threshold = 0.1,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            el.classList.add('aos-visible')
          }, delay)
          observer.unobserve(el)
          // cleanup timeru pokud se komponenta odmountuje dřív
          ;(el as HTMLElement & { _aosTimer?: ReturnType<typeof setTimeout> })._aosTimer = timer
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      const t = (el as HTMLElement & { _aosTimer?: ReturnType<typeof setTimeout> })._aosTimer
      if (t) clearTimeout(t)
    }
  }, [delay, threshold])

  return (
    <div ref={ref} className={`aos-init aos--${animation} ${className}`}>
      {children}
    </div>
  )
}
