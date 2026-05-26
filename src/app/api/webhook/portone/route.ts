import { NextRequest, NextResponse } from 'next/server'
import { getPaymentFromPortOne, verifyWebhookSignature } from '@/lib/portone-server'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()

    // 웹훅 시그니처 검증
    const webhookId = request.headers.get('webhook-id') ?? ''
    const webhookTimestamp = request.headers.get('webhook-timestamp') ?? ''
    const webhookSignature = request.headers.get('webhook-signature') ?? ''

    const isValid = await verifyWebhookSignature(
      payload,
      webhookId,
      webhookTimestamp,
      webhookSignature
    )

    if (!isValid) {
      console.warn('[웹훅] 시그니처 검증 실패')
      return NextResponse.json({ error: '유효하지 않은 웹훅' }, { status: 401 })
    }

    const event = JSON.parse(payload)
    console.log('[웹훅 수신]', event.type)

    // Transaction.Paid: 결제 완료
    if (event.type === 'Transaction.Paid') {
      const { paymentId } = event.data

      // 포트원에서 최신 결제 정보 조회 (웹훅 데이터 신뢰하지 않고 재조회)
      const payment = await getPaymentFromPortOne(paymentId)

      if (payment.status === 'PAID') {
        // TODO: Supabase에서 payments 레코드 상태 업데이트
        // await supabase
        //   .from('payments')
        //   .update({ status: 'payment_confirmed', pg_settled_at: null })
        //   .eq('portone_payment_id', paymentId)

        console.log('[웹훅] 결제 확인 완료:', paymentId, payment.amount.total)
      }
    }

    // Transaction.Cancelled: 결제 취소
    if (event.type === 'Transaction.Cancelled') {
      const { paymentId } = event.data
      // TODO: 취소 처리
      console.log('[웹훅] 결제 취소:', paymentId)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[웹훅 오류]', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
