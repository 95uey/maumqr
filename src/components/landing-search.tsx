'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim().replace(/^@/, '')
    if (trimmed) router.push(`/u/${trimmed}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-orange-400 transition-colors">
        <span className="pl-5 text-gray-400 font-medium text-base select-none">@</span>
        <input
          type="text"
          placeholder="ID 입력"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 py-4 px-3 text-base text-gray-700 placeholder-gray-300 outline-none bg-transparent"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="mr-2 px-4 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl disabled:opacity-40 transition-opacity"
        >
          검색
        </button>
      </div>
    </form>
  )
}
