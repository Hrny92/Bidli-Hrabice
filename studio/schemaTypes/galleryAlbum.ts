import { defineField, defineType } from 'sanity'

/**
 * Galerie – každý dokument = jeden album (Exteriéry / Interiéry / Půdorysy)
 * Slug je klíčem pro načítání v Next.js:
 *   "exteriery" | "interiery" | "pudorysy"
 */
export const galleryAlbumSchema = defineType({
  name: 'galleryAlbum',
  title: 'Galerie',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Název galerie',
      type: 'string',
      description: 'Např. Exteriéry, Interiéry, Půdorysy',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (identifikátor)',
      type: 'slug',
      description: 'Klíč pro načítání v kódu – použijte: exteriery / interiery / pudorysy',
      options: {
        source: 'title',
        slugify: (input: string) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')  // odstranit diakritiku
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
        isUnique: () => true, // alba mají pevná ID, duplicita nemůže nastat
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Pořadí (1 = první)',
      type: 'number',
      description: 'Určuje pořadí záložek galerie na webu',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'images',
      title: 'Fotografie',
      type: 'array',
      description: 'Nahrajte fotky – zobrazí se v galerii na webu ve stejném pořadí',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Popis fotky (alt text)',
              type: 'string',
              description: 'Krátký popis pro SEO a přístupnost',
            },
            {
              name: 'caption',
              title: 'Titulek (volitelný)',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],

  orderings: [
    {
      title: 'Pořadí',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      order: 'order',
    },
    prepare({ title, media, order }) {
      return {
        title: `${order}. ${title}`,
        media,
      }
    },
  },
})
