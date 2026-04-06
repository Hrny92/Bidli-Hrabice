import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Sanity webhook endpoint – okamžitá revalidace stránek po změně v Sanity Studiu.
 *
 * URL pro webhook v Sanity Manage:
 *   https://bidlivdysine.vercel.app/api/revalidate?secret=TVUJ_SECRET
 *
 * Nastav proměnnou prostředí SANITY_REVALIDATE_SECRET v Vercel i lokálně.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET

  // Pokud je secret nastaven, ověř ho
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ message: 'Neplatný secret' }, { status: 401 })
  }

  // Revaliduj obě stránky ihned
  revalidatePath('/pozemky')
  revalidatePath('/byty')

  return NextResponse.json({
    revalidated: true,
    paths: ['/pozemky', '/byty'],
    now: new Date().toISOString(),
  })
}
