/**
 * SEED SKRIPT – vytvoří výchozí galerie v Sanity (pokud ještě neexistují)
 *
 * Vytvoří albums:
 *   - gallery-exteriery   (slug: exteriery,  order: 1)
 *   - gallery-interiery   (slug: interiery,   order: 2)
 *   - gallery-pudorysy    (slug: pudorysy,    order: 3)
 *   - gallery-pozemky     (slug: pozemky,     order: 4)
 *
 * Spuštění (ze složky next-app/studio/):
 *   npx sanity exec scripts/seed-galleries.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ useCdn: false })

const ALBUMS = [
  { _id: 'gallery-exteriery', title: 'Exteriéry',  slug: 'exteriery', order: 1 },
  { _id: 'gallery-interiery', title: 'Interiéry',  slug: 'interiery', order: 2 },
  { _id: 'gallery-pudorysy',  title: 'Půdorysy',   slug: 'pudorysy',  order: 3 },
  { _id: 'gallery-pozemky',   title: 'Pozemky',    slug: 'pozemky',   order: 4 },
]

async function main() {
  console.log('Vytvářím galerie...\n')

  for (const album of ALBUMS) {
    const doc = {
      _id: album._id,
      _type: 'galleryAlbum',
      title: album.title,
      slug: { _type: 'slug', current: album.slug },
      order: album.order,
      images: [],
    }

    const result = await client.createIfNotExists(doc)
    const existed = result._createdAt === result._updatedAt ? false : true
    console.log(`${existed ? '✓ již existuje' : '✅ vytvořeno  '}  ${album._id}  (${album.slug})`)
  }

  console.log('\nHotovo. Fotky nahraj přes Sanity Studio → Galerie.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
