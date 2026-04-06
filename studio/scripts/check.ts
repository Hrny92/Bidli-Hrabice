/**
 * Diagnostický skript – vypíše co je aktuálně v Sanity
 * Spuštění (ze složky studio/):
 *   npx sanity exec scripts/check.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ useCdn: false })

async function check() {
  const plots = await client.fetch<{ _id: string; number?: string; status?: string }[]>(
    '*[_type == "plot"] | order(number asc) { _id, number, status }'
  )
  const apts = await client.fetch<{ _id: string; id?: string; status?: string }[]>(
    '*[_type == "apartment"] | order(id asc) { _id, id, status }'
  )

  console.log(`\nPOZEMKY (${plots.length}):`)
  plots.forEach(p => console.log(`  ${p._id}  number="${p.number}"  status="${p.status}"`))

  console.log(`\nBYTY (${apts.length}):`)
  apts.forEach(a => console.log(`  ${a._id}  id="${a.id}"  status="${a.status}"`))
}

check().catch(err => { console.error(err.message); process.exit(1) })
