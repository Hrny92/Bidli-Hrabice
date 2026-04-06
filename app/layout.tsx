import type { Metadata, Viewport } from 'next'
import './globals.css'
import SEO from '@/components/SEO'
import { SITE, schemaWebSite, schemaOrganization, schemaFAQ } from '@/lib/seo'

// ─── Globální metadata ─────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Bidli v Hrabicích – Rodinné domy Hrabice u Vimperka',
    template: '%s | Bidli v Hrabicích',
  },
  description: SITE.description,
  keywords: [
    'rodinné domy Hrabice', 'domy Vimperk', 'hrubá stavba k dokončení',
    'dvojdomy Hrabice', 'solitérní domy Hrabice', 'nemovitosti Jihočeský kraj',
    'BIDLI realitní kancelář', 'Zuzana Benedyktová makléřka',
    'rodinný dům Šumava', 'domy k prodeji Vimperk',
  ],
  authors: [{ name: SITE.agent.name, url: SITE.agent.brandUrl }],
  creator: SITE.agent.brand,
  publisher: SITE.agent.brand,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    canonical: SITE.url,
    languages: { 'cs-CZ': SITE.url },
  },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    title: 'Bidli v Hrabicích – Rodinné domy Hrabice u Vimperka',
    description: SITE.description,
    locale: 'cs_CZ',
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: 'Bidli v Hrabicích – rodinné domy u Vimperka', type: 'image/webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bidli v Hrabicích – Rodinné domy u Vimperka',
    description: SITE.description,
    images: [SITE.ogImage],
  },
  category: 'real estate',
}

export const viewport: Viewport = {
  themeColor: '#142f4c',
  width: 'device-width',
  initialScale: 1,
}

// ─── Root layout ───────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <SEO schemas={[schemaWebSite, schemaOrganization, schemaFAQ]} />
      </head>
      <body className="antialiased text-base leading-relaxed bg-white text-gray-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
