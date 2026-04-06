import { defineField, defineType } from 'sanity'

// Synchronizovat s next-app/lib/icons.tsx → ICON_LIST
const ICON_OPTIONS = [
  // Obecné / Technické
  { value: 'document',   title: '📄 Dokument / Stavební povolení' },
  { value: 'house',      title: '🏠 Dům / Projekt domu' },
  { value: 'plan',       title: '📐 Půdorys / Plán' },
  { value: 'bolt',       title: '⚡ Energie / Inž. sítě' },
  { value: 'key',        title: '🔑 Klíč / Předání' },
  { value: 'shield',     title: '🛡️  Bezpečnost / Záruka' },
  { value: 'wrench',     title: '🔧 Stavba / Rekonstrukce' },
  { value: 'star',       title: '⭐ Výhoda / Prémiové' },
  { value: 'check',      title: '✅ Hotovo / Schváleno' },
  { value: 'building',   title: '🏢 Budova / Bytový dům' },
  { value: 'car',        title: '🚗 Garáž / Parkování' },
  { value: 'garden',     title: '🌿 Zahrada / Pozemek' },
  // Lokalita
  { value: 'bus',        title: '🚌 Autobus / MHD' },
  { value: 'train',      title: '🚆 Vlak / Nádraží' },
  { value: 'shopping',   title: '🛍️  Obchod / Nákupy' },
  { value: 'school',     title: '🎓 Škola / Školka' },
  { value: 'health',     title: '❤️  Zdraví / Lékárna' },
  { value: 'sport',      title: '🏆 Sport / Hřiště' },
  { value: 'restaurant', title: '🍽️  Restaurace / Kavárna' },
  { value: 'golf',       title: '⛳ Golf / Resort' },
  { value: 'water',      title: '🏊 Koupaliště / Voda' },
  { value: 'clock',      title: '⏰ Čas / Dostupnost' },
  { value: 'map-pin',    title: '📍 Místo (výchozí)' },
]

export const homepageSchema = defineType({
  name: 'homepage',
  title: 'Hlavní stránka',
  type: 'document',

  // Skupiny polí – přehledné záložky v Sanity Studiu
  groups: [
    { name: 'hero',     title: '🖼  Hero sekce' },
    { name: 'infoStrip',title: '📊 Info strip' },
    { name: 'about',    title: '📝 O projektu' },
    { name: 'tech',     title: '⚙️  Technické detaily' },
    { name: 'location', title: '📍 Lokalita' },
    { name: 'youtube',  title: '▶️  YouTube video' },
  ],

  fields: [

    // ── HERO ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Nadpis',
      type: 'string',
      group: 'hero',
      description: 'Hlavní tučný nadpis v hero sekci',
    }),
    defineField({
      name: 'heroHeadlineAccent',
      title: 'Nadpis – zvýrazněná část',
      type: 'string',
      group: 'hero',
      description: 'Text který bude oranžový (druhý řádek)',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Podnadpis',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Pozadí hero sekce',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),

    // ── INFO STRIP ────────────────────────────────────────────────────────────
    defineField({
      name: 'infoStats',
      title: 'Statistiky (čísla)',
      type: 'array',
      group: 'infoStrip',
      description: 'Řádek s hodnotami pod hero sekcí (Pozemky, Byty, Dispozice…)',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Popis', type: 'string' },
          { name: 'value', title: 'Hodnota', type: 'string' },
          { name: 'colored', title: 'Oranžová barva', type: 'boolean' },
        ],
        preview: {
          select: { title: 'label', subtitle: 'value' },
        },
      }],
    }),

    // ── O PROJEKTU ────────────────────────────────────────────────────────────
    defineField({
      name: 'aboutHeading',
      title: 'Nadpis sekce',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutParagraph1',
      title: 'Odstavec 1',
      type: 'text',
      rows: 4,
      group: 'about',
    }),
    defineField({
      name: 'aboutParagraph2',
      title: 'Odstavec 2',
      type: 'text',
      rows: 3,
      group: 'about',
    }),
    defineField({
      name: 'aboutParagraph3',
      title: 'Odstavec 3',
      type: 'text',
      rows: 3,
      group: 'about',
    }),
    defineField({
      name: 'aboutHighlightTitle',
      title: 'Highlight box – nadpis',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutHighlightItems',
      title: 'Highlight box – položky',
      type: 'array',
      group: 'about',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Popis (tučně)', type: 'string' },
          { name: 'value', title: 'Hodnota', type: 'string' },
        ],
        preview: {
          select: { title: 'label', subtitle: 'value' },
        },
      }],
    }),
    defineField({
      name: 'aboutImage1',
      title: 'Fotka 1 (nahoře)',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutImage2',
      title: 'Fotka 2 (dole)',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
    }),

    // ── TECHNICKÉ DETAILY ─────────────────────────────────────────────────────
    defineField({
      name: 'techHeading',
      title: 'Nadpis sekce',
      type: 'string',
      group: 'tech',
    }),
    defineField({
      name: 'techCards',
      title: 'Karty (max. 3)',
      type: 'array',
      group: 'tech',
      validation: (Rule) => Rule.max(3),
      of: [{
        type: 'object',
        fields: [
          {
            name: 'icon',
            title: 'Ikona',
            type: 'string',
            options: { list: ICON_OPTIONS, layout: 'dropdown' },
            initialValue: 'document',
          },
          { name: 'title', title: 'Nadpis karty', type: 'string' },
          { name: 'text',  title: 'Text karty', type: 'text', rows: 3 },
        ],
        preview: {
          select: { title: 'title', subtitle: 'icon' },
          prepare({ title, icon }: { title?: string; icon?: string }) {
            const found = ICON_OPTIONS.find(o => o.value === icon)
            return { title: title ?? '(bez názvu)', subtitle: found?.title ?? icon }
          },
        },
      }],
    }),

    // ── LOKALITA ──────────────────────────────────────────────────────────────
    defineField({
      name: 'locationHeading',
      title: 'Nadpis sekce',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'locationIntro',
      title: 'Úvodní text',
      type: 'text',
      rows: 3,
      group: 'location',
    }),
    defineField({
      name: 'locationNote',
      title: 'Doplňující text (pod vzdálenostmi)',
      type: 'text',
      rows: 3,
      group: 'location',
    }),
    defineField({
      name: 'locationDistances',
      title: 'Vzdálenosti od lokality',
      type: 'array',
      group: 'location',
      description: 'Libovolný počet položek – grid se přizpůsobí',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'icon',
            title: 'Ikona',
            type: 'string',
            options: { list: ICON_OPTIONS, layout: 'dropdown' },
            initialValue: 'map-pin',
          },
          { name: 'label', title: 'Název místa', type: 'string' },
          { name: 'dist',  title: 'Vzdálenost (např. 100 m)', type: 'string' },
        ],
        preview: {
          select: { title: 'label', subtitle: 'dist', icon: 'icon' },
          prepare({ title, dist, icon }: { title?: string; dist?: string; icon?: string }) {
            const found = ICON_OPTIONS.find(o => o.value === icon)
            const emoji = found?.title.split(' ')[0] ?? '📍'
            return { title: `${emoji} ${title ?? ''}`, subtitle: dist }
          },
        },
      }],
    }),
    defineField({
      name: 'mapUrl',
      title: 'URL vložené mapy (iframe src)',
      type: 'url',
      group: 'location',
      description: 'Odkaz z mapy.cz nebo Google Maps embed',
    }),

    // ── YOUTUBE ───────────────────────────────────────────────────────────────
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      group: 'youtube',
      description: 'Jen ID videa, např. vk2zYVkkAGw (bez youtube.com/watch?v=)',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Hlavní stránka' }
    },
  },
})
