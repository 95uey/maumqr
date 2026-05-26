'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PayResultClientProps {
  profileId: string
  paymentId: string | null
  errorCode: string | null
  errorMessage: string | null
}

type Status = 'verifying' | 'success' | 'failed'

export default function PayResultClient({
  profileId,
  paymentId,
  errorCode,
  errorMessage,
}: PayResultClientProps) {
  const [status, setStatus] = useState<Status>(
    errorCode ? 'failed' : paymentId ? 'verifying' : 'failed'
  )

  useEffect(() => {
    if (!paymentId || errorCode) return

    // 세션 스토리지에서 결제 정보 복원 (pay-client에서 저장)
    const pending = sessionStorage.getItem('pending_payment')
    if (!pending) {
      setStatus('failed')
      return
    }

    const { expectedAmount, recipientId, messageKey } = JSON.parse(pending)

    async function verify() {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, expectedAmount, recipientId, messageKey }),
        })

        if (res.ok) {
          sessionStorage.removeItem('pending_payment')
          setStatus('success')
        } else {
          setStatus('failed')
        }
      } catch {
        setStatus('failed')
      }
    }

    verify()
  }, [paymentId, errorCode])

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center max-w-md mx-auto px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">결제를 확인하고 있어요</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center max-w-md mx-auto px-6">
        <div className="text-center">
          <p className="text-6xl mb-6">☀️</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">마음이 전달됐어요</h1>
          <p className="text-gray-500 text-sm mt-2">따뜻한 마음 감사해요</p>
          <Link
            href={`/u/${profileId}`}
            className="mt-10 block w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-base rounded-2xl text-center"
          >
            돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center max-w-md mx-auto px-6">
      <div className="text-center">
        <p className="text-5xl mb-4">😔</p>
        <h1 className="text-xl font-bold text-gray-800 mb-2">결제에 실패했어요</h1>
        <p className="text-gray-400 text-sm mb-1">
          {errorMessage ?? '알 수 없는 오류가 발생했어요'}
        </p>
        <Link
          href={`/u/${profileId}/pay`}
          className="mt-8 block w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-base rounded-2xl text-center"
        >
          다시 시도하기
        </Link>
      </div>
    </div>
  )
}
