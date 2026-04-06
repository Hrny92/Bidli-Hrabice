'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { ComponentProps, MouseEvent } from 'react'

type Props = Omit<ComponentProps<'a'>, 'href'> & { href: string }

/**
 * Nahrazuje Next.js <Link> pro navigaci mezi stránkami.
 * Exit: aktuální stránka fade-out (opacity 0)
 * Enter: nová stránka fade-in (template.tsx)
 */
export default function TransitionLink({ href, children, onClick, ...props }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Hash-only linky (#Kontakt) → nechej browser scrollovat nativně
    if (href.startsWith('#')) return

    // Stejná stránka → jen zavolej onClick (např. closeMenu) bez animace
    if (pathname === href) {
      onClick?.(e)
      return
    }

    e.preventDefault()
    onClick?.(e)

    // Označíme, že příští navigace je interní → template.tsx spustí fade-in
    sessionStorage.setItem('nav_internal', '1')

    const wrapper = document.getElementById('page-wrapper')
    if (wrapper) {
      // Fade-out exit
      wrapper.style.transition = 'opacity 0.25s ease'
      wrapper.style.opacity = '0'
      setTimeout(() => router.push(href), 260)
    } else {
      router.push(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
