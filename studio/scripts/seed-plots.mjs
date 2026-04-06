/**
 * Seed skript – vytvoří nebo aktualizuje všech 16 pozemků v Sanity.
 *
 * Spuštění (z adresáře next-app/studio/):
 *   node scripts/seed-plots.mjs
 *
 * Skript je idempotentní – lze spustit opakovaně bez rizika duplicit.
 * Existující data (stav, cena…) NEPŘEPÍŠE – pouze doplní chybějící dokumenty.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'khwbw4wq',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  // Token načti z prostředí:  SANITY_WRITE_TOKEN=xxx node scripts/seed-plots.mjs
  token: process.env.SANITY_WRITE_TOKEN,
})

// Výchozí hodnoty pro nový pozemek (klient je pak přepíše ve Studiu)
const DEFAULTS = {
  disposition: '5+1',
  floorArea: '260,2 m²',
  status: 'volný',
}

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌  Chybí SANITY_WRITE_TOKEN. Spusť jako:')
    console.error('   SANITY_WRITE_TOKEN=<token> node scripts/seed-plots.mjs')
    console.error('\n   Token najdeš na: https://www.sanity.io/manage → projekt → API → Tokens')
    process.exit(1)
  }

  console.log('🌱  Spouštím seed pozemků 1–16...\n')

  for (let i = 1; i <= 16; i++) {
    const docId = `plot-${i}`

    // Zkontroluj jestli dokument již existuje
    const existing = await client.getDocument(docId)

    if (existing) {
      console.log(`✅  Pozemek ${i} – již existuje, přeskakuji`)
      continue
    }

    // Vytvoř nový dokument s pevným _id
    await client.createOrReplace({
      _id: docId,
      _type: 'plot',
      number: String(i),
      status: DEFAULTS.status,
      disposition: DEFAULTS.disposition,
      floorArea: DEFAULTS.floorArea,
    })

    console.log(`🟢  Pozemek ${i} – vytvořen (ID: ${docId})`)
  }

  console.log('\n✨  Hotovo! Všech 16 pozemků je připraveno v Sanity Studiu.')
}

run().catch((err) => {
  console.error('❌  Chyba:', err.message)
  process.exit(1)
})
