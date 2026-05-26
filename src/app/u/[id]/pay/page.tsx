import PayClient from './pay-client'
import { MOCK_PROFILE } from '@/lib/mock-data'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProfile(customId: string) {
  void customId
  return MOCK_PROFILE
}

export default async function PayPage({ params }: PageProps) {
  const { id } = await params
  const profile = await getProfile(id)

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">페이지를 찾을 수 없어요</p>
      </div>
    )
  }

  return <PayClient profile={profile} backHref={`/u/${id}`} />
}
