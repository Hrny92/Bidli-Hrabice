import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Dvojdomy: SO01–SO04, SO06–SO11, SO13–SO18 (110,5 m²)
const DVOJDOMY_IDS = [
  'SO01', 'SO02', 'SO03', 'SO04',
  'SO06', 'SO07', 'SO08', 'SO09', 'SO10', 'SO11',
  'SO13', 'SO14', 'SO15', 'SO16', 'SO17', 'SO18',
]

// Solitéry: SO05, SO12 (94,7 m²)
const SOLITERY_IDS = ['SO05', 'SO12']

export default defineConfig({
  name: 'default',
  title: 'Bidli-Hrabice',

  projectId: 'fxnzotxb',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Obsah webu – Hrabice')
          .items([

            // ── Singletons ──────────────────────────────────────────────────
            S.listItem()
              .title('⚙️  Nastavení webu')
              .id('siteConfig')
              .child(
                S.document()
                  .schemaType('siteConfig')
                  .documentId('siteConfig')
              ),

            S.listItem()
              .title('🏠 Hlavní stránka')
              .id('homepage')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage')
              ),

            S.listItem()
              .title('🛠️  Služby')
              .id('services')
              .child(
                S.document()
                  .schemaType('services')
                  .documentId('services')
              ),

            S.divider(),

            // ── Dvojdomy ────────────────────────────────────────────────────
            S.listItem()
              .title('🏘  Dvojdomy (18 jednotek)')
              .child(
                S.list()
                  .title('Dvojdomy')
                  .items(
                    DVOJDOMY_IDS.map((soId) =>
                      S.listItem()
                        .title(soId)
                        .id(`house-${soId}`)
                        .child(
                          S.document()
                            .schemaType('house')
                            .documentId(`house-${soId}`)
                            .title(soId)
                            .initialValueTemplate('house-with-id', {
                              soId,
                              typ: 'dvojdům',
                              usableArea: '110,5 m²',
                            })
                        )
                    )
                  )
              ),

            // ── Solitéry ────────────────────────────────────────────────────
            S.listItem()
              .title('🏠 Solitéry (2 domy)')
              .child(
                S.list()
                  .title('Solitéry')
                  .items(
                    SOLITERY_IDS.map((soId) =>
                      S.listItem()
                        .title(soId)
                        .id(`house-${soId}`)
                        .child(
                          S.document()
                            .schemaType('house')
                            .documentId(`house-${soId}`)
                            .title(soId)
                            .initialValueTemplate('house-with-id', {
                              soId,
                              typ: 'solitér',
                              usableArea: '94,7 m²',
                            })
                        )
                    )
                  )
              ),

            S.divider(),

            // ── Galerie ─────────────────────────────────────────────────────
            S.listItem()
              .title('📸 Galerie – Exteriéry')
              .id('gallery-exteriery')
              .child(
                S.document()
                  .schemaType('galleryAlbum')
                  .documentId('gallery-exteriery')
              ),
            S.listItem()
              .title('🛋️  Galerie – Interiéry')
              .id('gallery-interiery')
              .child(
                S.document()
                  .schemaType('galleryAlbum')
                  .documentId('gallery-interiery')
              ),
            S.listItem()
              .title('📐 Galerie – Půdorysy')
              .id('gallery-pudorysy')
              .child(
                S.document()
                  .schemaType('galleryAlbum')
                  .documentId('gallery-pudorysy')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      // Odebrat výchozí prázdné šablony (klient nemůže přidávat ručně)
      ...prev.filter((t) => t.schemaType !== 'house'),

      // Domy – parametrizovaná šablona předvyplní označení, typ a užitnou plochu
      {
        id: 'house-with-id',
        title: 'Dům',
        schemaType: 'house',
        parameters: [
          { name: 'soId',       title: 'Označení (SO01…)', type: 'string' },
          { name: 'typ',        title: 'Typ (dvojdům / solitér)', type: 'string' },
          { name: 'usableArea', title: 'Užitná plocha',    type: 'string' },
        ],
        value: ({
          soId,
          typ,
          usableArea,
        }: {
          soId: string
          typ: string
          usableArea: string
        }) => ({
          id: soId,
          typ,
          usableArea,
          status: 'volný',
        }),
      },
    ],
  },
})
