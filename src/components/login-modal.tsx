'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LoginModalProps {
  onClose: () => void
  onSuccess: () => void
  /** 로그인 후 돌아올 URL (결제 재개용). 미지정 시 현재 페이지 */
  redirectTo?: string
}

export default function LoginModal({ onClose, onSuccess, redirectTo }: LoginModalProps) {
  const [loading, setLoading] = useState<'google' | 'naver' | null>(null)

  async function handleGoogle() {
    setLoading('google')
    const supabase = createClient()

    // 로그인 후 돌아올 URL: 현재 결제 페이지 (next 파라미터로 전달)
    const next = redirectTo ?? window.location.pathname + window.location.search
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google 로그인 오류:', error)
      setLoading(null)
    }
    // 성공 시 브라우저가 Google로 리다이렉트되므로 별도 처리 불필요
  }

  async function handleNaver() {
    // TODO: 네이버 OAuth 커스텀 구현
    // 현재는 안내 메시지
    alert('네이버 로그인은 곧 지원될 예정입니다. Google로 로그인해 주세요.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 딤 배경 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 바텀 시트 */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl">
        {/* 핸들 */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        <h2 className="text-lg font-bold text-gray-800 text-center mb-2">
          마음을 전하려면<br />먼저 로그인해 주세요
        </h2>
        <p className="text-gray-500 text-xs text-center mb-8">
          결제 완료 후 확인 메시지를 보내드려요
        </p>

        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors active:scale-95 disabled:opacity-60"
          >
            {loading === 'google' ? (
              <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Google로 계속하기
          </button>
          <button
            onClick={handleNaver}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#03C75A] rounded-2xl text-sm font-medium text-white active:scale-95 disabled:opacity-60"
          >
            <NaverIcon />
            네이버로 계속하기
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 text-sm text-gray-400"
        >
          취소
        </button>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
    </svg>
  )
}
