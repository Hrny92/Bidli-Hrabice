import { defineField, defineType } from 'sanity'

/**
 * Schema stránky Služby – singleton
 *
 * Klient upravuje pouze nadpis a text u každého z 5 bloků.
 * Ikony a rozložení jsou fixní a mění se pouze v kódu.
 */

export const servicesSchema = defineType({
  name: 'services',
  title: '🛠️ Služby',
  type: 'document',
  fieldsets: [
    { name: 'realEstate', title: '🏠 Prodej nemovitosti',          options: { collapsible: true, collapsed: false } },
    { name: 'financing',  title: '💰 Financování',                  options: { collapsible: true, collapsed: true } },
    { name: 'insurance',  title: '🛡️ Pojištění',                    options: { collapsible: true, collapsed: true } },
    { name: 'energy',     title: '⚡ Energie (plyn a elektřina)',    options: { collapsible: true, collapsed: true } },
    { name: 'solar',      title: '☀️ Fotovoltaika a tepelná čerpadla', options: { collapsible: true, collapsed: true } },
  ],
  fields: [

    // ── 1. Prodej nemovitosti ─────────────────────────────────────────────
    defineField({
      name: 'realEstateTitle',
      title: 'Nadpis',
      type: 'string',
      fieldset: 'realEstate',
      initialValue: 'Prodej stávající nemovitosti',
    }),
    defineField({
      name: 'realEstateText',
      title: 'Text',
      type: 'text',
      rows: 4,
      fieldset: 'realEstate',
      initialValue: 'Kompletně zajistíme prodej či pronájem vaší nemovitosti s využitím nejmodernějších technologií a nejširší inzerce. Díky našemu celorepublikovému pokrytí a více než 600 průvodcům nemovitostmi garantujeme rychlý a výhodný prodej či pronájem.',
    }),

    // ── 2. Financování ────────────────────────────────────────────────────
    defineField({
      name: 'financingTitle',
      title: 'Nadpis',
      type: 'string',
      fieldset: 'financing',
      initialValue: 'Financování',
    }),
    defineField({
      name: 'financingText',
      title: 'Text',
      type: 'text',
      rows: 4,
      fieldset: 'financing',
      initialValue: 'Zajistíme pro vás nejvýhodnější financování nového domova napříč všemi bankami na trhu. Vyjednáme nejlepší úrokové sazby a postaráme se o veškerou administrativu.',
    }),

    // ── 3. Pojištění ──────────────────────────────────────────────────────
    defineField({
      name: 'insuranceTitle',
      title: 'Nadpis',
      type: 'string',
      fieldset: 'insurance',
      initialValue: 'Pojištění',
    }),
    defineField({
      name: 'insuranceText',
      title: 'Text',
      type: 'text',
      rows: 4,
      fieldset: 'insurance',
      initialValue: 'Ochráníme váš nový domov i vás. Pomůžeme vám zorientovat se v nabídkách a sjednáme pro vás to nejvýhodnější majetkové pojištění i komplexní životní pojištění.',
    }),

    // ── 4. Energie ────────────────────────────────────────────────────────
    defineField({
      name: 'energyTitle',
      title: 'Nadpis',
      type: 'string',
      fieldset: 'energy',
      initialValue: 'Energie (plyn a elektřina)',
    }),
    defineField({
      name: 'energyText',
      title: 'Text',
      type: 'text',
      rows: 4,
      fieldset: 'energy',
      initialValue: 'Zajistíme nejen výhodný tarif elektřiny a plynu na míru přímo pro vaši novou domácnost, ale i kompletní přehlášení a administrativu s tím spojenou.',
    }),

    // ── 5. Fotovoltaika a tepelná čerpadla ────────────────────────────────
    defineField({
      name: 'solarTitle',
      title: 'Nadpis',
      type: 'string',
      fieldset: 'solar',
      initialValue: 'Fotovoltaika a tepelná čerpadla',
    }),
    defineField({
      name: 'solarText',
      title: 'Text',
      type: 'text',
      rows: 5,
      fieldset: 'solar',
      initialValue: 'Myslete na budoucnost a snižte provozní náklady svého nového domu od samého začátku. Náš tým specialistů pro vás navrhne optimální energetické řešení, ať už se jedná o fotovoltaickou elektrárnu s bateriovým úložištěm nebo instalaci tepelného čerpadla. Zajistíme návrh, kompletní technickou realizaci a samozřejmě vám pomůžeme s vyřízením všech dostupných státních dotací.',
    }),

  ],
  preview: {
    prepare() {
      return { title: 'Stránka Služby' }
    },
  },
})
