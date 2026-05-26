import Link from 'next/link'
import { MOCK_PROFILE } from '@/lib/mock-data'
import ProfileAvatar from '@/components/profile-avatar'

interface PageProps {
  params: Promise<{ id: string }>
}

// TODO: Supabase 연동 후 실제 데이터로 교체
async function getProfile(customId: string) {
  // const supabase = createClient()
  // const { data } = await supabase
  //   .from('profiles')
  //   .select('*, send_events(message_key, created_at)')
  //   .eq('custom_id', customId)
  //   .single()
  // return data
  void customId
  return MOCK_PROFILE
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params
  const profile = await getProfile(id)

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">페이지를 찾을 수 없어요</h1>
          <p className="text-gray-500 text-sm">ID를 다시 확인해 주세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

      {/* 헤더: 그라디언트 배경 + 프로필 */}
      <div className="relative bg-gradient-to-b from-amber-400 to-orange-400 pt-12 pb-16 px-6 text-center">
        {/* 홈 버튼 (임시) */}
        <Link
          href="/"
          className="absolute top-4 left-4 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
        >
          ← 홈
        </Link>
        {/* 프로필 사진 */}
        <div className="flex justify-center mb-4">
          <ProfileAvatar name={profile.name} photoUrl={profile.photo_url} size="lg" />
        </div>

        {/* 이름 + 역할 */}
        <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
        <p className="text-amber-100 text-sm mb-2">{profile.role}</p>
        <p className="text-amber-200 text-xs">@{profile.custom_id}</p>
      </div>

      {/* 물결 구분선 */}
      <div className="relative -mt-6">
        <svg viewBox="0 0 375 24" className="w-full fill-gray-50" preserveAspectRatio="none">
          <path d="M0,24 C100,0 275,48 375,24 L375,24 L0,24 Z" />
        </svg>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-5 -mt-2 pb-32 space-y-5">

        {/* 자기소개 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
        </div>

        {/* 받은 응원 메시지 */}
        {profile.recent_messages.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-1">
              받은 응원
            </h2>
            <div className="space-y-2">
              {profile.recent_messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-start gap-3"
                >
                  <span className="text-lg mt-0.5">☀️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 text-sm">{msg.text}</p>
                    <p className="text-gray-400 text-xs mt-1">{msg.time_ago}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <Link
          href={`/u/${id}/pay`}
          className="block w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-center font-bold text-lg py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-transform"
        >
          마음 전하기
        </Link>
      </div>
    </div>
  )
}
