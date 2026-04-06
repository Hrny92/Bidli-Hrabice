/**
 * Cleanup – smaže osiřelé drafty a dokumenty s neplatnými čísly
 * Spuštění (ze složky studio/):
 *   npx sanity exec scripts/cleanup.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ useCdn: false })

// Platná čísla pozemků: 1–10 a 15–20 (11–14 jsou trojdomy)
const VALID_PLOT_NUMBERS = new Set([
  '1','2','3','4','5','6','7','8','9','10',
  '15','16','17','18','19','20'
])

// Platná ID bytů: 11A–14C
const VALID_APT_IDS = new Set([
  '11A','11B','11C','12A','12B','12C',
  '13A','13B','13C','14A','14B','14C'
])

async function cleanup() {
  console.log('Hledám neplatné dokumenty...\n')

  // Načti vše včetně draftů (getCliClient má přístup k draftům)
  const allDocs = await client.fetch<{ _id: string; _type: string; number?: string; id?: string }[]>(
    '*[_type in ["plot","apartment"]]{ _id, _type, number, id }'
  )

  const toDelete: string[] = []

  for (const doc of allDocs) {
    const isDraft = doc._id.startsWith('drafts.')
    const cleanId = isDraft ? doc._id.replace('drafts.', '') : doc._id

    if (doc._type === 'plot') {
      const num = doc.number ?? cleanId.replace('plot-', '')
      if (!VALID_PLOT_NUMBERS.has(num)) {
        toDelete.push(doc._id)
        console.log(`  🗑 Neplatný plot: ${doc._id} (number="${num}")`)
      }
    }

    if (doc._type === 'apartment') {
      const aptId = doc.id ?? cleanId.replace('apartment-', '')
      if (!VALID_APT_IDS.has(aptId)) {
        toDelete.push(doc._id)
        console.log(`  🗑 Neplatný apartment: ${doc._id} (id="${aptId}")`)
      }
    }
  }

  if (toDelete.length === 0) {
    console.log('✓ Žádné neplatné dokumenty nenalezeny.')
    return
  }

  console.log(`\nMažu ${toDelete.length} dokumentů...`)
  for (const id of toDelete) {
    await client.delete(id)
    console.log(`  ✓ Smazán: ${id}`)
  }

  console.log('\n✓ Cleanup dokončen.')
}

cleanup().catch(err => { console.error(err.message); process.exit(1) })
