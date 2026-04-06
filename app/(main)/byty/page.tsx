import { redirect } from 'next/navigation'

// Byty se v projektu Hrabice neprodávají – přesměrování na nabídku domů
export default function BytyPage() {
  redirect('/domy')
}
