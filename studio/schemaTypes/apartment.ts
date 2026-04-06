import { defineField, defineType } from 'sanity'

/**
 * Schema bytu
 *
 * Pole která SPRAVUJE KLIENT (editovatelná):
 *   - status       – volný / rezervováno / prodáno
 *   - description  – popis na kartě v modálním okně
 *   - disposition  – dispozice (3+kk, 4+kk…)
 *   - area         – plocha bytu
 *   - gardenArea   – plocha zahrady / pozemku
 *   - price        – cena vč. DPH
 *   - photos       – vlastní fotky bytu (přebíjí centrální galerii)
 *   - floorPlans   – soubory: půdorysy (PDF, obrázek, Word)
 *   - catalogSheets – soubory: katalogové listy (PDF, obrázek, Word)
 *
 * Pole FIXNÍ (jen pro identifikaci, klient neupravuje):
 *   - id           – označení bytu (11A–14C) – propojení s mapou
 */

const ACCEPT_FILES = 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const apartmentSchema = defineType({
  name: 'apartment',
  title: 'Byty',
  type: 'document',
  fields: [

    

    // ── FIXNÍ – jen pro identifikaci, klient neupravuje ───────────────────
    defineField({
      name: 'id',
      title: 'ID bytu',
      type: 'string',
      description: 'Označení bytu – propojení s mapou (např. 11A, 13B…). Neupravujte.',
      readOnly: true,
    }),

    // ── EDITOVATELNÁ – klient mění ─────────────────────────────────────────
    defineField({
      name: 'hidden',
      title: 'Skrýt byt',
      type: 'boolean',
      description: 'Skrytý byt se nezobrazuje na mapě ani v tabulce na webu.',
      initialValue: false,
    }),

    defineField({
      name: 'status',
      title: 'Stav bytu',
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
      title: 'Cena vč. DPH',
      type: 'string',
      description: 'Např. „6 490 000 Kč" nebo „Info u makléře"',
    }),

    defineField({
      name: 'disposition',
      title: 'Dispozice',
      type: 'string',
      description: 'Např. „3+kk" nebo „4+kk"',
    }),

    defineField({
      name: 'area',
      title: 'Plocha bytu (m²)',
      type: 'string',
      description: 'Např. „85,5 m²"',
    }),

    defineField({
      name: 'gardenArea',
      title: 'Plocha zahrady / pozemku (m²)',
      type: 'string',
      description: 'Např. „154 m²"',
    }),

    defineField({
      name: 'description',
      title: 'Popis bytu',
      type: 'text',
      rows: 4,
      description: 'Text zobrazený na kartě v detailu bytu. Pokud nevyplníte, použije se výchozí popis.',
    }),

    defineField({
      name: 'photos',
      title: 'Fotky bytu',
      type: 'array',
      description: 'Vlastní fotky tohoto bytu. Pokud nevyplníte, použijí se fotky z centrální galerie (Exteriéry + Interiéry).',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    defineField({
      name: 'floorPlans',
      title: 'Půdorysy',
      type: 'array',
      description: 'Nahrajte půdorysy jako PDF, Word (.docx) nebo obrázky.',
      of: [{
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
            description: 'Např. „Přízemí", „Patro 1"',
          },
        ],
        preview: {
          select: { title: 'title' },
          prepare({ title }: { title?: string }) {
            return { title: `📐 ${title ?? 'Půdorys'}` }
          },
        },
      }],
    }),

    defineField({
      name: 'catalogSheets',
      title: 'Katalogové listy',
      type: 'array',
      description: 'Nahrajte katalogové listy jako PDF, Word (.docx) nebo obrázky.',
      of: [{
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
            description: 'Např. „Katalogový list – byt 17A"',
          },
        ],
        preview: {
          select: { title: 'title' },
          prepare({ title }: { title?: string }) {
            return { title: `📋 ${title ?? 'Katalogový list'}` }
          },
        },
      }],
    }),

  ],
  preview: {
    select: { aptId: 'id', docId: '_id', subtitle: 'status' },
    prepare({ aptId, docId, subtitle }: { aptId?: string; docId?: string; subtitle?: string }) {
      // Označení bytu: z pole id, nebo z _id (apartment-17A → "17A"), nebo "?"
      const label = aptId ?? docId?.replace(/^apartment-/, '') ?? '?'
      const emoji = subtitle === 'volný' ? '🟢' : subtitle === 'rezervováno' ? '🟡' : '🔴'
      return { title: `Byt ${label}`, subtitle: `${emoji} ${subtitle ?? '–'}` }
    },
  },
})
