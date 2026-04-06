import { defineField, defineType } from 'sanity'

/**
 * Schema rodinného domu – Hrabice
 *
 * Pole která SPRAVUJE KLIENT (editovatelná):
 *   - status        – volný / rezervováno / prodáno
 *   - price         – cena
 *   - usableArea    – užitná plocha (předvyplněna dle typu)
 *   - plotSize      – plocha pozemku (dle situačního výkresu)
 *   - description   – popis na kartě v detailu
 *   - photos        – vlastní fotky / vizualizace domu
 *   - floorPlans    – soubory: půdorysy (PDF, obrázek, Word)
 *   - catalogSheets – soubory: katalogové listy
 *
 * Pole FIXNÍ (jen pro identifikaci, klient neupravuje):
 *   - id            – označení domu (SO01–SO16, SO05, SO12) – propojení s webem
 *   - typ           – dvojdům / solitér
 */

const ACCEPT_FILES =
  'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const houseSchema = defineType({
  name: 'house',
  title: 'Domy',
  type: 'document',
  fields: [

    // ── FIXNÍ – jen pro identifikaci ──────────────────────────────────────────
    defineField({
      name: 'id',
      title: 'Označení domu',
      type: 'string',
      description: 'Označení dle projektu (SO01–SO16, SO05, SO12). Neupravujte – propojení s webem.',
      readOnly: true,
    }),

    defineField({
      name: 'typ',
      title: 'Typ domu',
      type: 'string',
      description: 'Dvojdům nebo solitér. Nastaveno automaticky – neupravujte.',
      readOnly: true,
      options: {
        list: [
          { title: 'Dvojdům', value: 'dvojdům' },
          { title: 'Solitér', value: 'solitér' },
        ],
      },
    }),

    // ── EDITOVATELNÁ – klient mění ─────────────────────────────────────────────
    defineField({
      name: 'hidden',
      title: 'Skrýt dům',
      type: 'boolean',
      description: 'Skrytý dům se nezobrazuje na webu.',
      initialValue: false,
    }),

    defineField({
      name: 'status',
      title: 'Stav',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Volný',     value: 'volný' },
          { title: '🟡 Rezervace', value: 'rezervováno' },
          { title: '🔴 Prodáno',   value: 'prodáno' },
        ],
        layout: 'radio',
      },
      initialValue: 'volný',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Cena',
      type: 'string',
      description: 'Např. „4 990 000 Kč" nebo „Info u makléře"',
    }),

    defineField({
      name: 'usableArea',
      title: 'Užitná plocha (m²)',
      type: 'string',
      description: 'Dvojdomy: 110,5 m² | Solitéry: 94,7 m²',
    }),

    defineField({
      name: 'plotSize',
      title: 'Plocha pozemku (m²)',
      type: 'string',
      description: 'Dle situačního výkresu, např. „621 m²"',
    }),

    defineField({
      name: 'description',
      title: 'Popis domu',
      type: 'text',
      rows: 4,
      description: 'Text v detailu domu. Pokud nevyplníte, použije se výchozí popis.',
    }),

    defineField({
      name: 'photos',
      title: 'Fotky / vizualizace domu',
      type: 'array',
      description: 'Vlastní fotky nebo vizualizace tohoto domu. Pokud nevyplníte, použijí se fotky z centrální galerie.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    defineField({
      name: 'floorPlans',
      title: 'Půdorysy',
      type: 'array',
      description: 'Nahrajte půdorysy jako PDF, Word (.docx) nebo obrázky.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'file',
              title: 'Soubor',
              type: 'file',
              options: { accept: ACCEPT_FILES },
            },
            {
              name: 'title',
              title: 'Název souboru (volitelný)',
              type: 'string',
              description: 'Např. „Přízemí", „Patro 1", „Celkový půdorys"',
            },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }: { title?: string }) {
              return { title: `📐 ${title ?? 'Půdorys'}` }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'catalogSheets',
      title: 'Katalogové listy',
      type: 'array',
      description: 'Nahrajte katalogové listy jako PDF, Word (.docx) nebo obrázky.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'file',
              title: 'Soubor',
              type: 'file',
              options: { accept: ACCEPT_FILES },
            },
            {
              name: 'title',
              title: 'Název souboru (volitelný)',
              type: 'string',
              description: 'Např. „Katalogový list – SO01"',
            },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }: { title?: string }) {
              return { title: `📋 ${title ?? 'Katalogový list'}` }
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: { houseId: 'id', docId: '_id', subtitle: 'status', typ: 'typ' },
    prepare({
      houseId,
      docId,
      subtitle,
      typ,
    }: {
      houseId?: string
      docId?: string
      subtitle?: string
      typ?: string
    }) {
      const label = houseId ?? docId?.replace(/^house-/, '') ?? '?'
      const emoji =
        subtitle === 'volný' ? '🟢' : subtitle === 'rezervováno' ? '🟡' : '🔴'
      const typLabel = typ === 'solitér' ? '🏠 solitér' : '🏘 dvojdům'
      return { title: `${label}`, subtitle: `${emoji} ${subtitle ?? '–'} · ${typLabel}` }
    },
  },
})
