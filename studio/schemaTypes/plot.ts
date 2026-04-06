import { defineField, defineType } from 'sanity'

/**
 * Schema pozemku
 *
 * Pole která SPRAVUJE KLIENT (editovatelná):
 *   - status       – volný / rezervováno / prodáno
 *   - description  – popis na kartě v modálním okně
 *   - disposition  – dispozice dle dokumentace
 *   - floorArea    – užitná plocha RD
 *   - plotSize     – velikost pozemku
 *   - price        – cena pozemku
 *   - floorPlans   – soubory: půdorysy (PDF, obrázek, Word)
 *   - catalogSheets – soubory: katalogové listy (PDF, obrázek, Word)
 *
 * Pole FIXNÍ (jen pro identifikaci, klient neupravuje):
 *   - number       – číslo pozemku (read-only, propojení s mapou)
 */

// Typy souborů které klient může nahrát
const ACCEPT_FILES = 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const plotSchema = defineType({
  name: 'plot',
  title: 'Pozemky',
  type: 'document',
  fields: [

    

    // ── FIXNÍ – jen pro identifikaci, klient neupravuje ───────────────────
    defineField({
      name: 'number',
      title: 'Číslo pozemku',
      type: 'string',
      description: 'Číslo pozemku – propojení s mapou (např. 1, 15, 20…). Neupravujte.',
      readOnly: true,
    }),

    // ── EDITOVATELNÁ – klient mění ─────────────────────────────────────────
    defineField({
      name: 'hidden',
      title: 'Skrýt pozemek',
      type: 'boolean',
      description: 'Skrytý pozemek se nezobrazuje na mapě ani v tabulce na webu.',
      initialValue: false,
    }),

    defineField({
      name: 'status',
      title: 'Stav pozemku',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Volný',      value: 'volný' },
          { title: '🟡 Rezervace',  value: 'rezervováno' },
          { title: '🔴 Prodáno',    value: 'prodáno' },
        ],
        layout: 'radio',
      },
      initialValue: 'volný',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Cena pozemku',
      type: 'string',
      description: 'Např. „4 950 000 Kč" nebo „Info u makléře"',
    }),

    defineField({
      name: 'disposition',
      title: 'Dispozice dle dokumentace',
      type: 'string',
      description: 'Např. „5+1" nebo „4+kk"',
    }),

    defineField({
      name: 'floorArea',
      title: 'Užitná plocha RD (m²)',
      type: 'string',
      description: 'Např. „260,2 m²"',
    }),

    defineField({
      name: 'plotSize',
      title: 'Velikost pozemku (m²)',
      type: 'string',
      description: 'Např. „728 m²"',
    }),

    defineField({
      name: 'description',
      title: 'Popis pozemku',
      type: 'text',
      rows: 4,
      description: 'Text zobrazený na kartě v detailu pozemku. Pokud nevyplníte, použije se výchozí popis.',
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
            description: 'Např. „Přízemí", „Patro 1", „Celkový půdorys"',
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
            description: 'Např. „Katalogový list – pozemek 16"',
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
    select: { num: 'number', id: '_id', subtitle: 'status' },
    prepare({ num, id, subtitle }: { num?: string; id?: string; subtitle?: string }) {
      // Číslo pozemku: z pole number, nebo z _id (plot-1 → "1"), nebo "?"
      const n = num ?? id?.replace(/^plot-/, '') ?? '?'
      const emoji = subtitle === 'volný' ? '🟢' : subtitle === 'rezervováno' ? '🟡' : '🔴'
      return { title: `Pozemek ${n}`, subtitle: `${emoji} ${subtitle ?? '–'}` }
    },
  },
})
