import Image from 'next/image'
import TransitionLink from './TransitionLink'
import ContactForm from './ContactForm'
import { sanityClient } from '@/sanity/client'
import { SITE } from '@/lib/seo'

interface SiteConfig {
  agentName?: string
  agentPhone?: string
  agentEmail?: string
  agentPhotoUrl?: string
  agentQuote?: string
  agentBio?: string
}

const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0] {
  agentName,
  agentPhone,
  agentEmail,
  "agentPhotoUrl": agentPhoto.asset->url,
  agentQuote,
  agentBio
}`

export default async function Footer() {
  let config: SiteConfig = {}
  try {
    config = await sanityClient.fetch<SiteConfig>(SITE_CONFIG_QUERY) ?? {}
  } catch {
    // fallback na hardcoded hodnoty
  }

  const agentName     = config.agentName     || SITE.agent.name
  const agentPhone    = config.agentPhone    || SITE.agent.phoneFormatted
  const agentEmail    = config.agentEmail    || SITE.agent.email
  const agentPhotoUrl = config.agentPhotoUrl || '/img/Benedyktova.png'
  const agentQuote    = config.agentQuote    || 'Ráda se s vámi potkám přímo na místě, nebo vám zašlu doplňující informace a plány. Napište mi.'
  const agentBio      = config.agentBio      || `${agentName}, realitní specialistka sítě BIDLI. Ráda vás provedu nabídkou rodinných domů v obci Hrabice u Vimperka a pomohu zajistit hladký průběh koupě.`
  const agentPhoneRaw = agentPhone.replace(/\s/g, '')

  return (
    <footer
      className="text-gray-900 rounded-t-[2rem] mt-0 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(99.75% 99.75% at 50% 99.75%, rgba(249, 133, 37, 0.15) 0%, rgba(255, 255, 255, 0) 100%), #f9fafb',
      }}
    >
      <div id="Kontakt" className="relative pt-0 pb-0 overflow-hidden">
        <div className="absolute top-10 left-0 w-full text-center overflow-hidden pointer-events-none select-none z-0">
          <span className="text-[15vw] font-black text-gray-900/[0.03] md:text-gray-900/[0.02] leading-none whitespace-nowrap">
            NAPIŠTE MI
          </span>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">

            {/* Levý sloupec s agentem */}
            <div className="lg:col-span-5 relative flex flex-col justify-end min-h-[350px] lg:min-h-[550px]">
              <div className="absolute bottom-0 lg:bottom-20 left-0 w-full z-30 text-center lg:text-left pointer-events-none px-4 lg:px-0">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)]">
                  Zajímají vás <br />
                  <span>tyto domy?</span>
                </h2>
                <div className="bg-white/60 backdrop-blur-md border border-gray-200 p-6 rounded-[2rem] shadow-xl relative z-30 max-w-sm mx-auto lg:mx-0 pointer-events-auto">
                  <p className="text-gray-700 text-lg font-light italic border-l-2 border-accent pl-4">
                    „{agentQuote}"
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-accent rounded-full blur-[120px] opacity-10 z-0" />
              <Image
                src={agentPhotoUrl}
                alt={agentName}
                width={500}
                height={600}
                className="w-full max-w-[500px] object-contain object-bottom relative z-10 mx-auto lg:ml-auto lg:mr-0 -mb-px pt-48 drop-shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pointer-events-none"
                unoptimized={agentPhotoUrl.startsWith('https://')}
              />
            </div>

            {/* Kontaktní formulář */}
            <div className="lg:col-span-7 relative z-20 mb-10 lg:mb-16">
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent rounded-full blur-[80px] opacity-10 pointer-events-none" />
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spodní lišta footeru */}
      <div className="bg-primary mx-auto w-[98%] rounded-t-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.03)] text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-[120px] opacity-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <TransitionLink href="/">
              <Image src="/img/logo-white.svg" alt="Logo" width={112} height={40} className="w-24 md:w-28 opacity-90 hover:opacity-100 transition-opacity" />
            </TransitionLink>
            <p className="font-light leading-relaxed max-w-sm">
              {agentBio}
            </p>
            <div className="flex gap-4 mt-2">
              {[
                { href: 'https://www.facebook.com/bidlicz',                          src: '/img/Social-icon/FB-white.svg', alt: 'Facebook' },
                { href: 'https://www.instagram.com/bidlicz',                         src: '/img/Social-icon/Ig-white.svg', alt: 'Instagram' },
                { href: 'https://www.linkedin.com/company/18437972/',                src: '/img/Social-icon/In-white.svg', alt: 'LinkedIn' },
                { href: 'https://www.youtube.com/@BIDLIsev%C5%A1%C3%ADmv%C5%A1udy', src: '/img/Social-icon/Y2B-white.svg', alt: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.alt}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent hover:scale-110 transition-all duration-300 group"
                >
                  <Image
                    src={social.src}
                    alt={social.alt}
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="font-bold text-lg mb-6">Menu</h3>
            <ul className="space-y-3">
              {[
                { href: '/',        label: 'O projektu' },
                { href: '/domy',    label: 'Domy' },
                { href: '/sluzby',  label: 'Služby' },
                { href: '#Kontakt', label: 'Kontakt' },
              ].map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    className="text-white hover:text-accent transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-6">Kontakt</h3>
            <div className="flex flex-col gap-4">
              <a href={`tel:${agentPhoneRaw}`} className="group">
                <p className="text-xs uppercase tracking-wider mb-1">Zavolejte mi</p>
                <span className="text-xl md:text-2xl font-bold group-hover:text-accent transition-colors">
                  {agentPhone}
                </span>
              </a>
              <a href={`mailto:${agentEmail}`} className="group mt-2">
                <p className="text-xs uppercase tracking-wider mb-1">Napište mi</p>
                <span className="text-lg font-light group-hover:text-accent transition-colors">
                  {agentEmail}
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 relative z-10">
          <p>&copy; 2026 {agentName} | BIDLI. Všechna práva vyhrazena.</p>
          <div className="flex gap-6">
            <a
              href="https://www.bidli.cz/informace-o-webu/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GDPR & VOP
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
