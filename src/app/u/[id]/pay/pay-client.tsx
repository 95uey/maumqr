'use client'

import { useState } from 'react'
import Link from 'next/link'
import PortOne from '@portone/browser-sdk/v2'
import { ProfileWithMessages, PRESET_MESSAGES, MessageKey } from '@/lib/types'
import ProfileAvatar from '@/components/profile-avatar'
import LoginModal from '@/components/login-modal'

interface PayClientProps {
  profile: ProfileWithMessages
  backHref: string
}

type PayMethod = 'KAKAOPAY' | 'NAVERPAY'

const DEFAULT_AMOUNT = 10000
const DEFAULT_MESSAGE = PRESET_MESSAGES[0].key as MessageKey
const DEFAULT_PAY_METHOD: PayMethod = 'KAKAOPAY'

export default function PayClient({ profile, backHref }: PayClientProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(DEFAULT_AMOUNT)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<MessageKey>(DEFAULT_MESSAGE)
  const [selectedPayMethod, setSelectedPayMethod] = useState<PayMethod>(DEFAULT_PAY_METHOD)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const finalAmount = selectedAmount ??
    (customAmount ? parseInt(customAmount.replace(/,/g, ''), 10) : null)

  const isReady =
    finalAmount !== null && !isNaN(finalAmount) && finalAmount >= 1000

  function handleAmountSelect(amount: number) {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  function handleCustomAmountChange(value: string) {
    const numeric = value.replace(/[^0-9]/g, '')
    setCustomAmount(numeric ? Number(numeric).toLocaleString() : '')
    setSelectedAmount(null)
  }

  // 보내기 버튼 클릭 → 로그인 체크 → 결제
  function handlePayClick() {
    if (!isReady || isLoading) return
    // TODO: 로그인 상태 확인 (Supabase session)
    // const session = await supabase.auth.getSession()
    // if (!session.data.session) { setShowLoginModal(true); return }
    setShowLoginModal(true) // 임시: 항상 로그인 모달 표시
  }

  // 로그인 완료 후 결제 진행
  async function proceedWithPayment() {
    setShowLoginModal(false)
    if (!isReady || !finalAmount) return
    setError(null)
    setIsLoading(true)

    try {
      const paymentId = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin

      sessionStorage.setItem('pending_payment', JSON.stringify({
        paymentId,
        expectedAmount: finalAmount,
        recipientId: profile.id,
        messageKey: selectedMessage,
      }))

      const channelKey = selectedPayMethod === 'KAKAOPAY'
        ? process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_KAKAOPAY!
        : process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_NAVERPAY!

      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey,
        paymentId,
        orderName: `${profile.name}님께 마음 전하기`,
        totalAmount: finalAmount,
        currency: 'KRW',
        payMethod: 'EASY_PAY',
        easyPay: { easyPayProvider: selectedPayMethod },
        redirectUrl: `${appUrl}/u/${profile.custom_id}/pay/result`,
        customData: { recipientId: profile.id, messageKey: selectedMessage },
      })

      if (response?.code) {
        setError(response.code === 'FAILURE_TYPE_PG'
          ? (response.message ?? '결제에 실패했어요')
          : '결제가 취소됐어요')
        sessionStorage.removeItem('pending_payment')
        return
      }

      if (response?.paymentId) {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: response.paymentId,
            expectedAmount: finalAmount,
            recipientId: profile.id,
            messageKey: selectedMessage,
          }),
        })
        if (verifyRes.ok) {
          sessionStorage.removeItem('pending_payment')
          window.location.href = `/u/${profile.custom_id}/pay/result?payment_id=${response.paymentId}`
        } else {
          setError('결제 검증에 실패했어요. 고객센터에 문의해 주세요.')
        }
      }
    } catch (err) {
      console.error(err)
      setError('오류가 발생했어요. 다시 시도해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

        {/* 상단 네비게이션 */}
        <div className="flex items-center px-5 pt-12 pb-4 gap-3">
          <Link href={backHref} className="text-gray-400 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <ProfileAvatar name={profile.name} photoUrl={profile.photo_url} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{profile.name}</p>
            <p className="text-gray-400 text-xs truncate">{profile.role}</p>
          </div>
        </div>

        <div className="flex-1 px-5 pb-36 space-y-6 mt-2">

          {/* 금액 — 1줄 3칸 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-3">얼마를 전할까요?</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleAmountSelect(10000)}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all ${
                  selectedAmount === 10000
                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                1만원
              </button>
              <button
                onClick={() => handleAmountSelect(50000)}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all ${
                  selectedAmount === 50000
                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                5만원
              </button>
              <div className={`flex-1 relative border-2 rounded-2xl bg-white overflow-hidden transition-all ${
                selectedAmount === null && customAmount ? 'border-orange-400' : 'border-gray-200'
              }`}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="직접"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="w-full h-full py-3.5 pl-3 pr-6 text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent font-bold"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">원</span>
              </div>
            </div>
          </div>

          {/* 메시지 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-3">메시지</h2>
            <div className="flex flex-wrap gap-2">
              {PRESET_MESSAGES.map((msg) => (
                <button
                  key={msg.key}
                  onClick={() => setSelectedMessage(msg.key as MessageKey)}
                  className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                    selectedMessage === msg.key
                      ? 'border-orange-400 bg-orange-50 text-orange-700'
                      : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  {msg.text}
                </button>
              ))}
            </div>
          </div>

          {/* 결제 수단 */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-3">결제 수단</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPayMethod('KAKAOPAY')}
                className={`flex-1 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all ${
                  selectedPayMethod === 'KAKAOPAY'
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                💛 카카오페이
              </button>
              <button
                onClick={() => setSelectedPayMethod('NAVERPAY')}
                className={`flex-1 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all ${
                  selectedPayMethod === 'NAVERPAY'
                    ? 'border-green-400 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                💚 네이버페이
              </button>
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* 하단 고정 버튼 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
          <button
            onClick={handlePayClick}
            disabled={!isReady || isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              isReady && !isLoading
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading
              ? '처리 중...'
              : finalAmount && isReady
                ? `${finalAmount.toLocaleString()}원 보내기`
                : '금액을 선택해주세요'}
          </button>
        </div>
      </div>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={proceedWithPayment}
        />
      )}
    </>
  )
}
