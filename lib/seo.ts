import type { Metadata } from 'next'

// ─── Konfigurace webu ──────────────────────────────────────────────────────────

export const SITE = {
  name: 'Bidli v Hrabicích',
  url: 'https://www.bidlivhrabicich.cz',
  ogImage: 'https://www.bidlivhrabicich.cz/img/og-image.webp',
  description:
    'Prodej rodinných domů ve hrubé stavbě v obci Hrabice (Město Vimperk). 16 jednotek v 8 dvojdomech a 2 solitérní domy. Dokončení dle vlastních představ. Jihočeský kraj.',
  agent: {
    name: 'Zuzana Benedyktová',
    phone: '+420723117023',
    phoneFormatted: '+420 723 117 023',
    email: 'zuzana.benedyktova@bidli.cz',
    brand: 'BIDLI',
    brandUrl: 'https://www.bidli.cz',
  },
  address: {
    locality: 'Hrabice',
    region: 'Jihočeský kraj',
    postalCode: '385 01',
    country: 'CZ',
    countryName: 'Česká republika',
  },
  social: {
    facebook: 'https://www.facebook.com/bidlicz',
    instagram: 'https://www.instagram.com/bidlicz',
    linkedin: 'https://www.linkedin.com/company/18437972/',
    youtube: 'https://www.youtube.com/@BIDLIsevšímvšudy',
  },
} as const

// ─── Metadata builder ──────────────────────────────────────────────────────────

interface BuildMetadataOptions {
  title: string
  description?: string
  path?: string
  ogImage?: string
  noindex?: boolean
}

export function buildMetadata({
  title,
  description = SITE.description,
  path = '',
  ogImage = SITE.ogImage,
  noindex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE.url}${path}`

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      type: 'website',
      url,
      siteName: SITE.name,
      title,
      description,
      locale: 'cs_CZ',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ─── JSON-LD schémata ──────────────────────────────────────────────────────────

/** WebSite schema */
export const schemaWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'cs',
  publisher: {
    '@id': `${SITE.url}/#organization`,
  },
}

/** Organization / RealEstate brand */
export const schemaOrganization = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'RealEstateAgent'],
  '@id': `${SITE.url}/#organization`,
  name: `${SITE.name} – ${SITE.agent.brand}`,
  url: SITE.url,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE.url}/img/logo.svg`,
  },
  image: SITE.ogImage,
  description: SITE.description,
  telephone: SITE.agent.phone,
  email: SITE.agent.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.0583,
    longitude: 13.7786,
  },
  areaServed: {
    '@type': 'City',
    name: 'Hrabice',
  },
  sameAs: [
    SITE.social.facebook,
    SITE.social.instagram,
    SITE.social.linkedin,
    SITE.social.youtube,
    SITE.agent.brandUrl,
  ],
  employee: {
    '@type': 'Person',
    name: SITE.agent.name,
    jobTitle: 'Realitní specialistka',
    telephone: SITE.agent.phone,
    email: SITE.agent.email,
    worksFor: { '@id': `${SITE.url}/#organization` },
  },
}

/** FAQPage */
export const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Kde se projekt Bidli v Hrabicích nachází?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Projekt se nachází v obci Hrabice, která je součástí Města Vimperk, v Jihočeském kraji. Lokalita nabízí klidné bydlení v přírodě v blízkosti Šumavy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kolik domů je v nabídce?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'V nabídce je celkem 18 rodinných domů: 16 jednotek v 8 dvojdomech (SO01–SO16) a 2 solitérní rodinné domy (SO05, SO12).',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaká je užitná plocha domů?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jednotky v dvojdomech mají užitnou plochu 110,5 m². Solitérní rodinné domy mají užitnou plochu 94,7 m².',
      },
    },
    {
      '@type': 'Question',
      name: 'V jakém stavu jsou domy prodávány?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Domy jsou prodávány ve stavu hrubé stavby k dokončení. Klient si dokončení interiérů a povrchů řeší po vlastní ose dle svých představ a potřeb.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak kontaktovat makléřku Zuzanu Benedyktovou?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zuzanu Benedyktovou zastihete na telefonním čísle +420 723 117 023 nebo e-mailem zuzana.benedyktova@bidli.cz.',
      },
    },
  ],
}

/** RealEstateListing pro domy */
export const schemaDomy = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE.url}/domy#listing`,
  name: 'Rodinné domy Hrabice – nabídka',
  description: '18 rodinných domů ve hrubé stavbě k dokončení v obci Hrabice (Město Vimperk). 16 jednotek v dvojdomech + 2 solitéry.',
  numberOfItems: 18,
  url: `${SITE.url}/domy`,
  provider: { '@id': `${SITE.url}/#organization` },
}

// Aliases pro zpětnou kompatibilitu
export const schemaPozemky = schemaDomy
export const schemaByty = schemaDomy

/** BreadcrumbList builder */
export function schemaBreadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Domů',
        item: SITE.url,
      },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.name,
        item: `${SITE.url}${item.path}`,
      })),
    ],
  }
}
