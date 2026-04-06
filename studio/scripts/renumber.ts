/**
 * Migrační skript – přečíslování pozemků a bytů v Sanity databázi
 *
 * Spuštění (ze složky studio/):
 *   npx sanity exec scripts/renumber.ts --with-user-token
 *
 * Pozemky: 11→20, 12→19, 13→18, 14→17, 15→16, 16→15
 * Byty:    17→14, 18→13, 19→12, 20→11
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ useCdn: false })

const PLOT_MAP: Record<string, string> = {
  '11': '20',
  '12': '19',
  '13': '18',
  '14': '17',
  '15': '16',
  '16': '15',
}

const APT_MAP: Record<string, string> = {
  '17A': '14A', '17B': '14B', '17C': '14C',
  '18A': '13A', '18B': '13B', '18C': '13C',
  '19A': '12A', '19B': '12B', '19C': '12C',
  '20A': '11A', '20B': '11B', '20C': '11C',
}

async function migrate() {
  // ── Pozemky ────────────────────────────────────────────────────────────
  const plots = await client.fetch<{ _id: string; number?: string | null }[]>(
    '*[_type == "plot"]{_id, number}'
  )

  console.log(`\nNalezeno ${plots.length} pozemků`)
  let plotUpdated = 0

  for (const plot of plots) {
    // Pokud pole number není vyplněno, zkusíme ho odvodit z _id (např. plot-11 → "11")
    const currentNumber = plot.number ?? plot._id.replace(/^plot-/, '')
    const newNumber = PLOT_MAP[currentNumber]
    if (newNumber) {
      await client.patch(plot._id).set({ number: newNumber }).commit()
      console.log(`  Pozemek ${plot._id}: number "${currentNumber}" → "${newNumber}"`)
      plotUpdated++
    } else {
      console.log(`  Pozemek ${plot._id}: number "${currentNumber}" – nepřečíslovává se`)
    }
  }
  console.log(`Pozemky: aktualizováno ${plotUpdated} záznamů`)

  // ── Byty ───────────────────────────────────────────────────────────────
  const apartments = await client.fetch<{ _id: string; id?: string | null }[]>(
    '*[_type == "apartment"]{_id, id}'
  )

  console.log(`\nNalezeno ${apartments.length} bytů`)
  let aptUpdated = 0

  for (const apt of apartments) {
    // Pokud pole id není vyplněno, zkusíme ho odvodit z _id (např. apartment-17A → "17A")
    const currentId = apt.id ?? apt._id.replace(/^apartment-/, '')
    const newId = APT_MAP[currentId]
    if (newId) {
      await client.patch(apt._id).set({ id: newId }).commit()
      console.log(`  Byt ${apt._id}: id "${currentId}" → "${newId}"`)
      aptUpdated++
    } else {
      console.log(`  Byt ${apt._id}: id "${currentId}" – nepřečíslovává se`)
    }
  }
  console.log(`Byty: aktualizováno ${aptUpdated} záznamů`)

  console.log('\n✓ Migrace dokončena')
}

migrate().catch((err) => {
  console.error('Chyba:', err.message)
  process.exit(1)
})
