'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    setIsLoading(true)
    // TODO: 실제 가입 플로우 연결
    router.push(`/signup?email=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-orange-400 transition-colors">
        <input
          type="email"
          inputMode="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 py-4 px-5 text-base text-gray-700 placeholder-gray-300 outline-none bg-transparent"
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>
      <button
        type="submit"
        disabled={!email.trim() || isLoading}
        className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-base rounded-2xl shadow-sm shadow-orange-200 disabled:opacity-40 transition-opacity active:scale-95"
      >
        {isLoading ? '이동 중...' : '시작하기'}
      </button>
    </form>
  )
}
