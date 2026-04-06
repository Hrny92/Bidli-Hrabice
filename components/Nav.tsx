'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import TransitionLink from './TransitionLink'

const NAV_ITEMS = [
  { href: '/#O-projektu',       label: 'O projektu' },
  { href: '/#Technicke-udaje',  label: 'Parametry' },
  { href: '/#Lokalita',         label: 'Lokalita' },
  { href: '/#Galerie',          label: 'Galerie' },
  { href: '/domy',              label: 'Domy' },
  { href: '/sluzby',            label: 'Služby' },
]

export default function Nav() {
  const topbarWrapperRef = useRef<HTMLDivElement>(null)
  const topbarRef        = useRef<HTMLElement>(null)
  const sidebarRef       = useRef<HTMLDivElement>(null)
  const overlayRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = topbarWrapperRef.current
    const topbar  = topbarRef.current

    const handleScroll = () => {
      if (!wrapper || !topbar) return
      if (window.scrollY > 50) {
        wrapper.classList.remove('top-4')
        wrapper.classList.add('top-0')
        topbar.classList.remove('w-[86vw]', 'pl-5', 'rounded-full')
        topbar.classList.add('w-full', 'pl-5', 'rounded-none')
      } else {
        wrapper.classList.add('top-4')
        wrapper.classList.remove('top-0')
        topbar.classList.add('w-[86vw]', 'pl-5', 'rounded-full')
        topbar.classList.remove('w-full', 'pl-[9%]', 'pr-[10%]', 'rounded-none')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function openMenu() {
    sidebarRef.current?.classList.remove('translate-x-full')
    sidebarRef.current?.classList.add('menu-open')
    overlayRef.current?.classList.remove('opacity-0', 'pointer-events-none')
    document.body.classList.add('no-scroll')
  }

  function closeMenu() {
    sidebarRef.current?.classList.add('translate-x-full')
    sidebarRef.current?.classList.remove('menu-open')
    overlayRef.current?.classList.add('opacity-0', 'pointer-events-none')
    document.body.classList.remove('no-scroll')
  }

  return (
    <>
      {/* Topbar */}
      <div
        ref={topbarWrapperRef}
        className="fixed top-4 left-0 right-0 z-50 transition-all duration-300"
      >
        <header
          ref={topbarRef}
          className="flex items-center justify-between w-[86vw] mx-auto bg-white rounded-full p-1 pl-5 shadow-sm transition-all duration-300"
        >
          <TransitionLink href="/" className="block mr-auto">
            <Image src="/img/logo.svg" alt="Logo" width={100} height={32} className="h-8 w-auto" />
          </TransitionLink>

          <nav className="hidden xl:block">
            <ul className="flex items-center gap-1 font-bold text-primary">
              <li><TransitionLink href="/"       className="px-5 py-2.5 rounded-full hover:text-accent transition-colors">O projektu</TransitionLink></li>
              <li><TransitionLink href="/domy"   className="px-5 py-2.5 rounded-full hover:text-accent transition-colors">Domy</TransitionLink></li>
              <li><TransitionLink href="/sluzby" className="px-5 py-2.5 rounded-full hover:text-accent transition-colors">Služby</TransitionLink></li>
            </ul>
          </nav>

          <a
            href="#Kontakt"
            className="hidden md:inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-accent hover:text-white transition-colors gap-2 group"
          >
            Kontakt
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <button
            onClick={openMenu}
            className="xl:hidden p-2 mr-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Otevřít menu"
          >
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeMenu}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] opacity-0 pointer-events-none transition-opacity duration-300"
      />

      {/* Mobile menu */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-[85vw] max-w-[360px] bg-white z-[70] translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-2xl flex flex-col rounded-l-[2.5rem] overflow-hidden"
      >
        <div className="h-1 bg-gradient-to-r from-accent to-amber-300 flex-shrink-0" />

        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <TransitionLink href="/" onClick={closeMenu}>
            <Image src="/img/logo.svg" alt="Logo" width={100} height={32} className="h-8 w-auto" />
          </TransitionLink>
          <button
            onClick={closeMenu}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:rotate-90 transition-all duration-300"
            aria-label="Zavřít menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.href} className="menu-item">
                <TransitionLink
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-orange-50 group transition-all duration-200"
                >
                  <span className="text-[11px] font-bold text-accent/50 w-4 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-lg font-bold text-gray-800 group-hover:text-accent transition-colors">
                    {item.label}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-cta px-6 py-6 border-t border-gray-100">
          <a
            href="#Kontakt"
            onClick={closeMenu}
            className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accentDark text-white py-4 rounded-full text-base font-bold transition-colors shadow-[0_4px_20px_rgba(239,134,37,0.3)]"
          >
            Kontaktovat nás
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
