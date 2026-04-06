/**
 * SEED SKRIPT – kompletní reset bytů a pozemků v Sanity
 *
 * Co dělá:
 *  1. Smaže VŠECHNY stávající apartment dokumenty (i drafty)
 *  2. Vytvoří 12 bytů: apartment-11A až apartment-14C
 *  3. Vytvoří nebo aktualizuje 16 pozemků: plot-1 až plot-20
 *     (pozemky 1,2,3,6 přepíše, zbytek vytvoří)
 *
 * Spuštění (ze složky next-app/studio/):
 *   npx sanity exec scripts/seed.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ useCdn: false })

// ─── DATA: BYTY 11A–14C ──────────────────────────────────────────────────────

const BYTY = [
  { id: '11A', area: '85,5 m²', gardenArea: '171 m²', price: '6 590 000 Kč',   status: 'volný'       },
  { id: '11B', area: '80,2 m²', gardenArea: '67 m²',  price: '5 990 000 Kč',   status: 'volný'       },
  { id: '11C', area: '85,5 m²', gardenArea: '144 m²', price: 'Info u makléře', status: 'rezervováno' },
  { id: '12A', area: '85,5 m²', gardenArea: '165 m²', price: 'Info u makléře', status: 'rezervováno' },
  { id: '12B', area: '80,2 m²', gardenArea: '64 m²',  price: '5 990 000 Kč',   status: 'volný'       },
  { id: '12C', area: '85,5 m²', gardenArea: '139 m²', price: '6 290 000 Kč',   status: 'volný'       },
  { id: '13A', area: '85,5 m²', gardenArea: '148 m²', price: '6 490 000 Kč',   status: 'volný'       },
  { id: '13B', area: '80,2 m²', gardenArea: '60 m²',  price: 'Info u makléře', status: 'prodáno'     },
  { id: '13C', area: '85,5 m²', gardenArea: '125 m²', price: '6 290 000 Kč',   status: 'volný'       },
  { id: '14A', area: '85,5 m²', gardenArea: '154 m²', price: '6 490 000 Kč',   status: 'volný'       },
  { id: '14B', area: '80,2 m²', gardenArea: '62 m²',  price: '5 990 000 Kč',   status: 'rezervováno' },
  { id: '14C', area: '85,5 m²', gardenArea: '131 m²', price: '6 290 000 Kč',   status: 'volný'       },
] as const

// ─── DATA: POZEMKY 1–10 a 15–20 ─────────────────────────────────────────────

const POZEMKY = [
  { number: '1',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '2',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '3',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '4',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '5',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '6',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '7',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '8',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '9',  plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '10', plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '15', plotSize: '728 m²', price: '4 950 000 Kč',   status: 'volný'       },
  { number: '16', plotSize: '644 m²', price: 'Info u makléře', status: 'rezervováno' },
  { number: '17', plotSize: '659 m²', price: '4 990 000 Kč',   status: 'volný'       },
  { number: '18', plotSize: '652 m²', price: 'Info u makléře', status: 'prodáno'     },
  { number: '19', plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
  { number: '20', plotSize: '536 m²', price: '4 422 000 Kč',   status: 'volný'       },
] as const

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  SEED SKRIPT – reset bytů a pozemků')
  console.log('═══════════════════════════════════════════════════\n')

  // ── 1. BYTY: smaž vše, vytvoř znovu ──────────────────────────────────────
  console.log('── BYTY ──────────────────────────────────────────')

  // Načti všechny apartment dokumenty (published)
  const existingIds = await client.fetch<string[]>('*[_type == "apartment"]._id')
  console.log(`Stávající apartment dokumenty (${existingIds.length}): ${existingIds.join(', ') || 'žádné'}`)

  // Smaž každý published dokument + jeho draft variantu
  let deleted = 0
  for (const id of existingIds) {
    await client.delete(id)
    deleted++
    // Zkus smazat draft variantu (neexistence nevadí)
    try { await client.delete(`drafts.${id}`) } catch {}
    console.log(`  🗑  Smazán: ${id}`)
  }

  // Smaž případné osiřelé drafty
  const orphanDrafts = await client.fetch<string[]>(
    '*[_id in path("drafts.apartment-*")]._id'
  )
  for (const id of orphanDrafts) {
    await client.delete(id)
    deleted++
    console.log(`  🗑  Smazán draft: ${id}`)
  }

  console.log(`\nSmazáno celkem: ${deleted} dokumentů`)

  // Vytvoř 12 nových bytů
  console.log('\nVytvářím byty 11A–14C...')
  for (const byt of BYTY) {
    await client.createOrReplace({
      _id: `apartment-${byt.id}`,
      _type: 'apartment',
      id: byt.id,
      disposition: '3+kk',
      area: byt.area,
      gardenArea: byt.gardenArea,
      price: byt.price,
      status: byt.status,
    })
    console.log(`  ✓  Byt ${byt.id}`)
  }

  // ── 2. POZEMKY: vytvoř nebo aktualizuj ────────────────────────────────────
  console.log('\n── POZEMKY ───────────────────────────────────────')
  console.log('Vytvářím/aktualizuji pozemky 1–10 a 15–20...')

  for (const p of POZEMKY) {
    await client.createOrReplace({
      _id: `plot-${p.number}`,
      _type: 'plot',
      number: p.number,
      disposition: '5+1',
      floorArea: '260,2 m²',
      plotSize: p.plotSize,
      price: p.price,
      status: p.status,
    })
    console.log(`  ✓  Pozemek ${p.number}`)
  }

  // ── HOTOVO ────────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════')
  console.log('  ✓ HOTOVO!')
  console.log('───────────────────────────────────────────────────')
  console.log('  Byty v Sanity:    11A, 11B, 11C, 12A … 14C')
  console.log('  Pozemky v Sanity: 1–10 a 15–20')
  console.log('───────────────────────────────────────────────────')
  console.log('  Všechny hodnoty (ceny, plochy, stavy) jsou')
  console.log('  záložní – uprav v Sanity Studiu podle potřeby.')
  console.log('═══════════════════════════════════════════════════')
}

seed().catch((err) => {
  console.error('\n✗ Chyba:', err.message)
  process.exit(1)
})
