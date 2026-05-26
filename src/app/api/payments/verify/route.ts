import { NextRequest, NextResponse } from 'next/server'
import { getPaymentFromPortOne, verifyPaymentAmount } from '@/lib/portone-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, expectedAmount, recipientId, messageKey } = body

    if (!paymentId || !expectedAmount || !recipientId) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }

    // 1. 포트원에서 결제 정보 조회
    const payment = await getPaymentFromPortOne(paymentId)

    // 2. 금액 검증
    if (!verifyPaymentAmount(payment, expectedAmount)) {
      return NextResponse.json(
        { error: `결제 검증 실패: 상태=${payment.status}, 금액=${payment.amount.total}` },
        { status: 400 }
      )
    }

    // 3. DB 저장
    // TODO: Supabase 연동 후 실제 저장
    // await supabase.from('payments').insert({
    //   portone_payment_id: paymentId,
    //   recipient_id: recipientId,
    //   amount: expectedAmount,
    //   platform_fee: Math.round(expectedAmount * 0.015),
    //   net_amount: expectedAmount,
    //   message_key: messageKey,
    //   status: 'payment_confirmed',
    //   paid_at: new Date().toISOString(),
    // })

    console.log('[결제 확인]', { paymentId, expectedAmount, recipientId, messageKey })

    return NextResponse.json({
      success: true,
      paymentId,
      amount: payment.amount.total,
      status: payment.status,
    })
  } catch (error) {
    console.error('[결제 검증 오류]', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
