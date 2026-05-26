import PayResultClient from './result-client'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string>>
}

export default async function PayResultPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const query = await searchParams

  // 포트원 리다이렉트 시 paymentId, code, message 전달됨
  const paymentId = query.payment_id ?? query.paymentId ?? null
  const errorCode = query.code ?? null
  const errorMessage = query.message ?? null

  return (
    <PayResultClient
      profileId={id}
      paymentId={paymentId}
      errorCode={errorCode}
      errorMessage={errorMessage}
    />
  )
}
