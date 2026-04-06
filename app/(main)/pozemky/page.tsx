import { redirect } from 'next/navigation'

// Pozemky se v projektu Hrabice neprodávají – přesměrování na nabídku domů
export default function PozemkyPage() {
  redirect('/domy')
}
