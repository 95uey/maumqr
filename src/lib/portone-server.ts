// 포트원 V2 서버사이드 유틸리티

export interface PortOnePayment {
  id: string
  status: 'READY' | 'PENDING' | 'VIRTUAL_ACCOUNT_ISSUED' | 'PAID' | 'FAILED' | 'PARTIAL_CANCELLED' | 'CANCELLED'
  amount: {
    total: number
    taxFree: number
    vat: number
    supply: number
    discount: number
    paid: number
    cancelled: number
    cancelledTaxFree: number
  }
  currency: string
  orderName: string
  customData?: Record<string, unknown>
  customer?: {
    phoneNumber?: string
  }
}

// 포트원 API로 결제 정보 조회
export async function getPaymentFromPortOne(paymentId: string): Promise<PortOnePayment> {
  const response = await fetch(
    `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`포트원 API 오류: ${response.status}`)
  }

  return response.json()
}

// 결제 금액 검증
export function verifyPaymentAmount(payment: PortOnePayment, expectedAmount: number): boolean {
  return payment.status === 'PAID' && payment.amount.total === expectedAmount
}

// 웹훅 시그니처 검증
export async function verifyWebhookSignature(
  payload: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string
): Promise<boolean> {
  const secret = process.env.PORTONE_WEBHOOK_SECRET
  if (!secret) return false

  const signedContent = `${webhookId}.${webhookTimestamp}.${payload}`
  const encoder = new TextEncoder()
  const keyData = Buffer.from(secret, 'base64')

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signedContent))
  const computedSignature = Buffer.from(signature).toString('base64')

  // 웹훅 헤더에 올 수 있는 여러 시그니처 중 하나라도 일치하면 유효
  const signatures = webhookSignature.split(' ')
  return signatures.some(sig => sig === `v1,${computedSignature}`)
}
