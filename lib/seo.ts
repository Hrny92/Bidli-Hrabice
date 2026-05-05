import type { Metadata } from 'next'

// ─── Konfigurace webu ──────────────────────────────────────────────────────────

export const SITE = {
  name: 'Bidli v Hrabicích',
  url: 'https://www.bidlivhrabicich.cz',
  ogImage: 'https://www.bidlivhrabicich.cz/img/og-image.webp',
  description:
    'Prodej rodinných domů ve hrubé stavbě v obci Hrabice (Město Vimperk). 16 jednotek v 8 dvojdomech a 2 solitérní domy. Dokončení dle vlastních představ. Jihočeský kraj.',
  contactEmail: 'info@bidli.cz',
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
    streetAddress: 'Hrabice',
    parentLocality: 'Vimperk',
  },
  geo: {
    latitude: 49.0583,
    longitude: 13.7786,
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
          type: 'image/webp',
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
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE.url}/domy`,
    },
    'query-input': 'required name=search_term_string',
  },
}

/** Organization / RealEstate brand */
export const schemaOrganization = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'RealEstateAgent'],
  '@id': `${SITE.url}/#organization`,
  name: `${SITE.name} – ${SITE.agent.brand}`,
  alternateName: ['Bidli Hrabice', 'Rodinné domy Hrabice', 'Domy Vimperk Hrabice'],
  url: SITE.url,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE.url}/img/logo.svg`,
    width: 200,
    height: 60,
  },
  image: {
    '@type': 'ImageObject',
    url: SITE.ogImage,
    width: 1200,
    height: 630,
  },
  description: SITE.description,
  telephone: SITE.agent.phone,
  email: SITE.contactEmail,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.streetAddress,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE.geo.latitude,
    longitude: SITE.geo.longitude,
  },
  hasMap: `https://maps.google.com/?q=${SITE.geo.latitude},${SITE.geo.longitude}`,
  areaServed: [
    {
      '@type': 'City',
      name: 'Hrabice',
      containedInPlace: {
        '@type': 'City',
        name: 'Vimperk',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Jihočeský kraj',
        },
      },
    },
  ],
  sameAs: [
    SITE.social.facebook,
    SITE.social.instagram,
    SITE.social.linkedin,
    SITE.social.youtube,
    SITE.agent.brandUrl,
  ],
  employee: {
    '@type': 'Person',
    '@id': `${SITE.url}/#agent`,
    name: SITE.agent.name,
    jobTitle: 'Realitní specialistka',
    telephone: SITE.agent.phone,
    email: SITE.agent.email,
    worksFor: { '@id': `${SITE.url}/#organization` },
    knowsAbout: ['prodej nemovitostí', 'rodinné domy', 'Jihočeský kraj', 'Šumava', 'hypotéky'],
  },
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 1 },
  foundingDate: '2024',
  priceRange: '$$',
}

/** FAQPage – rozšířená pro AI vyhledávače */
export const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Kde se projekt Bidli v Hrabicích nachází?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Projekt se nachází v obci Hrabice, která je součástí Města Vimperk v Jihočeském kraji. GPS souřadnice: 49.0583° N, 13.7786° E. Lokalita nabízí klidné bydlení v přírodě v bezprostřední blízkosti Národního parku Šumava, přibližně 3 km od centra Vimperka.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kolik domů je v nabídce a jak jsou označeny?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'V nabídce je celkem 18 rodinných domů. Dvojdomy (16 jednotek): SO01, SO02, SO03, SO04, SO06, SO07, SO08, SO09, SO10, SO11, SO13, SO14, SO15, SO16, SO17, SO18. Solitérní domy (2 kusy): SO05 a SO12.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaká je užitná plocha a plocha pozemku?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jednotky v dvojdomech mají užitnou plochu 110,5 m² a pozemky 608–659 m². Solitérní rodinné domy mají užitnou plochu 94,7 m² a pozemky 802–807 m².',
      },
    },
    {
      '@type': 'Question',
      name: 'Co znamená hrubá stavba k dokončení?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hrubá stavba k dokončení znamená, že dům je dokončen po stránce nosné konstrukce, střechy a hrubých instalací. Kupující si zajišťuje veškeré dokončovací práce dle vlastního výběru: podlahy, obklady, sanitu, kuchyni, malby a fasádu. Tento model umožňuje individuální přizpůsobení interiéru a nižší celkové náklady.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak kontaktovat prodejce domů v Hrabicích?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kontaktujte nás e-mailem na info@bidli.cz nebo telefonicky na +420 723 117 023 (makléřka Zuzana Benedyktová, BIDLI realitní kancelář). Poptávkový formulář je dostupný na www.bidlivhrabicich.cz.',
      },
    },
    {
      '@type': 'Question',
      name: 'Je možné financovat koupě domu hypotékou?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano, domy jsou vhodné jako zástava pro hypoteční úvěr. BIDLI nabízí pomoc se sjednáním hypotéky u vybraných bank včetně vyřízení veškeré administrativy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaká je vzdálenost od Prahy, Českých Budějovic a Plzně?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hrabice leží přibližně 140 km od Prahy, 55 km od Českých Budějovic a 100 km od Plzně. Nejbližší dálniční napojení je přes Písek nebo Strakonice na D4.',
      },
    },
    {
      '@type': 'Question',
      name: 'Je každý dům na vlastním pozemku?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano, každá bytová jednotka (i každá polovina dvojdomu) je prodávána na vlastním přiděleném pozemku s výměrou 608–807 m².',
      },
    },
  ],
}

/** RealEstateListing – souhrn nabídky */
export const schemaDomy = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE.url}/domy#listing`,
  name: 'Rodinné domy Hrabice – nabídka k prodeji',
  description: '18 rodinných domů ve hrubé stavbě k dokončení v obci Hrabice (Město Vimperk, Jihočeský kraj). 16 jednotek v 8 dvojdomech (110,5 m²) a 2 solitérní domy (94,7 m²). Každý dům na vlastním pozemku 608–807 m².',
  numberOfItems: 18,
  url: `${SITE.url}/domy`,
  provider: { '@id': `${SITE.url}/#organization` },
  itemListElement: [
    { '@type': 'ListItem', position: 1,  name: 'SO01 – dvojdům 110,5 m², pozemek 621 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 2,  name: 'SO02 – dvojdům 110,5 m², pozemek 622 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 3,  name: 'SO03 – dvojdům 110,5 m², pozemek 635 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 4,  name: 'SO04 – dvojdům 110,5 m², pozemek 641 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 5,  name: 'SO05 – solitér 94,7 m², pozemek 807 m²',   url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 6,  name: 'SO06 – dvojdům 110,5 m², pozemek 651 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 7,  name: 'SO07 – dvojdům 110,5 m², pozemek 659 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 8,  name: 'SO08 – dvojdům 110,5 m², pozemek 643 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 9,  name: 'SO09 – dvojdům 110,5 m², pozemek 639 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 10, name: 'SO10 – dvojdům 110,5 m², pozemek 612 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 11, name: 'SO11 – dvojdům 110,5 m², pozemek 608 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 12, name: 'SO12 – solitér 94,7 m², pozemek 802 m²',   url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 13, name: 'SO13 – dvojdům 110,5 m², pozemek 616 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 14, name: 'SO14 – dvojdům 110,5 m², pozemek 621 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 15, name: 'SO15 – dvojdům 110,5 m², pozemek 625 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 16, name: 'SO16 – dvojdům 110,5 m², pozemek 635 m²',  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 17, name: 'SO17 – dvojdům 110,5 m²',                  url: `${SITE.url}/domy` },
    { '@type': 'ListItem', position: 18, name: 'SO18 – dvojdům 110,5 m²',                  url: `${SITE.url}/domy` },
  ],
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
