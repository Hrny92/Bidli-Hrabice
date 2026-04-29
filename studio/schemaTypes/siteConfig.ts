import { defineField, defineType } from 'sanity'

export const siteConfigSchema = defineType({
  name: 'siteConfig',
  title: 'Nastavení webu',
  type: 'document',
  fields: [
    defineField({ name: 'siteName',    title: 'Název projektu',     type: 'string' }),
    defineField({ name: 'agentName',   title: 'Jméno makléře',      type: 'string' }),
    defineField({ name: 'agentPhone',  title: 'Telefon',            type: 'string' }),
    defineField({ name: 'agentEmail',  title: 'E-mail',             type: 'string' }),
    defineField({ name: 'agentPhoto',  title: 'Foto makléře',       type: 'image', options: { hotspot: true } }),
    defineField({ name: 'agentQuote',  title: 'Citát / motto',      type: 'text' }),
    defineField({ name: 'agentBio',    title: 'Bio (text ve footeru)', type: 'text', description: 'Krátký popis makléře zobrazený ve spodní části footeru.' }),
  ],
  preview: {
    select: { title: 'siteName' },
    prepare({ title }) {
      return { title: title ?? 'Nastavení webu' }
    },
  },
})
