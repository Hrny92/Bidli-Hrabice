'use client'

import { useEffect, useState } from 'react'

export default function CookieBar() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setVisible(true)
    }
  }, [])

  function acceptAll() {
    localStorage.setItem('cookieConsent', 'all')
    setVisible(false)
    setModalOpen(false)
  }

  function saveMinimal() {
    localStorage.setItem('cookieConsent', 'minimal')
    setVisible(false)
    setModalOpen(false)
  }

  if (!visible) return null

  return (
    <>
      <div className="fixed bottom-5 left-5 right-5 bg-white text-gray-600 p-5 rounded-2xl shadow-2xl z-[10000] border border-gray-200">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            Na tomto webu používáme cookies k zajištění funkčnosti a analýze návštěvnosti.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="underline text-sm hover:text-accent"
            >
              Nastavení
            </button>
            <button
              onClick={acceptAll}
              className="bg-accent text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-accentDark"
            >
              Povolit vše
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10001]"
            onClick={() => setModalOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-[2rem] p-8 z-[10002] shadow-2xl text-gray-600">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">Nastavení cookies</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Používáme nezbytné cookies pro fungování webu a analytické cookies pro zlepšení uživatelského zážitku.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={saveMinimal}
                className="border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 text-sm"
              >
                Jen nezbytné
              </button>
              <button
                onClick={acceptAll}
                className="bg-accent text-white px-4 py-2 rounded-full hover:bg-accentDark text-sm font-bold"
              >
                Povolit vše
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
