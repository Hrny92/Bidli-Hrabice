import type { Metadata } from 'next'
import Image from 'next/image'
import { sanityClient } from '@/sanity/client'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Služby – financování, pojištění, energie | Bidli v Hrabicích',
  description: 'Komplexní služby Bidli pro váš nový domov v Hrabicích: prodej stávající nemovitosti, hypoteční financování, pojištění, dodávky energií, fotovoltaika a tepelná čerpadla.',
  path: '/sluzby',
})

// ─── Typy ─────────────────────────────────────────────────────────────────────

interface SanityServices {
  realEstateTitle?: string
  realEstateText?: string
  financingTitle?: string
  financingText?: string
  insuranceTitle?: string
  insuranceText?: string
  energyTitle?: string
  energyText?: string
  solarTitle?: string
  solarText?: string
}

// ─── GROQ dotaz ───────────────────────────────────────────────────────────────

const SERVICES_QUERY = `*[_type == "services" && _id == "services"][0] {
  realEstateTitle, realEstateText,
  financingTitle,  financingText,
  insuranceTitle,  insuranceText,
  energyTitle,     energyText,
  solarTitle,      solarText
}`

// ─── Výchozí texty (fallback pokud Sanity je prázdná) ─────────────────────────

const D = {
  realEstate: {
    title: 'Prodej stávající nemovitosti',
    text:  'Kompletně zajistíme prodej či pronájem vaší nemovitosti s využitím nejmodernějších technologií a nejširší inzerce. Díky našemu celorepublikovému pokrytí a více než 600 průvodcům nemovitostmi garantujeme rychlý a výhodný prodej či pronájem.',
  },
  financing: {
    title: 'Financování',
    text:  'Zajistíme pro vás nejvýhodnější financování nového domova napříč všemi bankami na trhu. Vyjednáme nejlepší úrokové sazby a postaráme se o veškerou administrativu.',
  },
  insurance: {
    title: 'Pojištění',
    text:  'Ochráníme váš nový domov i vás. Pomůžeme vám zorientovat se v nabídkách a sjednáme pro vás to nejvýhodnější majetkové pojištění i komplexní životní pojištění.',
  },
  energy: {
    title: 'Energie (plyn a elektřina)',
    text:  'Zajistíme nejen výhodný tarif elektřiny a plynu na míru přímo pro vaši novou domácnost, ale i kompletní přehlášení a administrativu s tím spojenou.',
  },
  solar: {
    title: 'Fotovoltaika a tepelná čerpadla',
    text:  'Myslete na budoucnost a snižte provozní náklady svého nového domu od samého začátku. Náš tým specialistů pro vás navrhne optimální energetické řešení, ať už se jedná o fotovoltaickou elektrárnu s bateriovým úložištěm nebo instalaci tepelného čerpadla. Zajistíme návrh, kompletní technickou realizaci a samozřejmě vám pomůžeme s vyřízením všech dostupných státních dotací.',
  },
}

// ─── Stránka ──────────────────────────────────────────────────────────────────

export default async function SluzbyPage() {
  let cms: SanityServices = {}
  try {
    cms = (await sanityClient.fetch<SanityServices>(SERVICES_QUERY)) ?? {}
  } catch {
    // fallback na výchozí texty
  }

  // Sestavení bloků – ikony a layout jsou fixní, texty přijdou ze Sanity nebo fallbacku
  const services = [
    {
      title: cms.realEstateTitle ?? D.realEstate.title,
      text:  cms.realEstateText  ?? D.realEstate.text,
      icon:  'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      wide:  false,
    },
    {
      title: cms.financingTitle ?? D.financing.title,
      text:  cms.financingText  ?? D.financing.text,
      icon:  'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      wide:  false,
    },
    {
      title: cms.insuranceTitle ?? D.insurance.title,
      text:  cms.insuranceText  ?? D.insurance.text,
      icon:  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      wide:  false,
    },
    {
      title: cms.energyTitle ?? D.energy.title,
      text:  cms.energyText  ?? D.energy.text,
      icon:  'M13 10V3L4 14h7v7l9-11h-7z',
      wide:  false,
    },
    {
      title: cms.solarTitle ?? D.solar.title,
      text:  cms.solarText  ?? D.solar.text,
      icon:  'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
      wide:  true,
    },
  ]

  return (
    <>
      {/* HERO */}
      <section className="relative p-2 h-[40vh] min-h-[400px]">
        <div className="relative flex flex-col justify-center h-full rounded-[3rem] overflow-hidden bg-gray-100">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-pink-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />
          </div>
          <div className="relative z-10 container mx-auto px-6 mt-16 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Komplexní služby <br />
                <span className="text-accent">pod jednou střechou</span>
              </h1>
              <p className="text-lg md:text-xl font-light opacity-90">
                Od prodeje vaší staré nemovitosti přes financování až po moderní technologie a energie pro váš nový domov v Hrabicích.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOKY SLUŽEB */}
      <section className="py-20 md:py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {services.map((service) => (
            <div
              key={service.title}
              className={`bg-gray-50 rounded-[2.5rem] p-8 md:p-12 border border-gray-200 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all group relative overflow-hidden ${service.wide ? 'lg:col-span-2 bg-white border-accent/20 shadow-lg' : ''}`}
            >
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform ${service.wide ? 'bg-accent/10' : 'bg-white shadow-md'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 font-light leading-relaxed">{service.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
