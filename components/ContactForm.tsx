'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.status === 'success') {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setErrorMsg(result.message || 'Neznámá chyba')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Chyba připojení k serveru.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group">
          <input
            type="text"
            name="name"
            placeholder=" "
            required
            className="block w-full px-6 pt-7 pb-3 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:border-accent focus:bg-white transition-all peer"
          />
          <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
            Jméno a příjmení
          </label>
        </div>
        <div className="relative group">
          <input
            type="text"
            name="phone"
            placeholder=" "
            required
            className="block w-full px-6 pt-7 pb-3 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:border-accent focus:bg-white transition-all peer"
          />
          <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
            Telefon
          </label>
        </div>
      </div>

      <div className="relative group">
        <input
          type="email"
          name="email"
          placeholder=" "
          required
          className="block w-full px-6 pt-7 pb-3 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:border-accent focus:bg-white transition-all peer"
        />
        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
          E-mail
        </label>
      </div>

      <div className="relative group">
        <textarea
          name="message"
          placeholder=" "
          rows={4}
          className="block w-full px-6 pt-7 pb-3 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:border-accent focus:bg-white transition-all peer resize-none"
        />
        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
          Váš vzkaz nebo dotaz...
        </label>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              required
              className="peer appearance-none w-6 h-6 border border-gray-300 rounded-md bg-white checked:bg-accent checked:border-accent cursor-pointer transition-colors"
            />
            <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <label className="text-sm text-gray-600 cursor-pointer select-none">
            Souhlasím se zpracováním údajů
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full md:w-auto bg-gray-900 text-white hover:bg-accent px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(239,134,37,0.4)] disabled:opacity-60"
        >
          {status === 'loading' ? 'Odesílám...' : 'Odeslat zprávu'}
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {status === 'success' && (
        <p className="text-green-600 font-medium text-center mt-4">
          Děkujeme! Zpráva byla úspěšně odeslána.
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-600 font-medium text-center mt-4">
          Chyba: {errorMsg}
        </p>
      )}
    </form>
  )
}
