/**
 * SEO.tsx — JSON-LD structured data renderer
 *
 * Použití:
 *   <SEO schemas={[schemaWebSite, schemaOrganization, schemaFAQ]} />
 *
 * Komponenta renderuje <script type="application/ld+json"> tagy pro každé
 * předané schéma. Vkládá se do <head> přes Next.js layout nebo přímo na stránce.
 */

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemas: Record<string, any>[]
}

export default function SEO({ schemas }: Props) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
    </>
  )
}
