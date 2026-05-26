import LandingSearch from '@/components/landing-search'
import SocialSignup from '@/components/social-signup'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col max-w-md mx-auto px-6">
      <div className="flex-1 flex flex-col justify-center py-16">

        {/* 로고 & 타이틀 */}
        <div className="text-center mb-12">
          <p className="text-5xl mb-3">☀️</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">마음QR</h1>
          <p className="text-gray-500 text-sm mt-2">
            좋은 서비스엔 마음을 전하세요
          </p>
        </div>

        {/* 고객용: ID 검색 */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-1">
            마음 전하기
          </p>
          <LandingSearch />
          <p className="text-center text-xs text-gray-400 mt-3">
            또는 카메라 앱으로 명찰의 QR을 스캔하세요
          </p>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">서비스 제공자이신가요?</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 근로자용: 소셜 가입 */}
        <SocialSignup />

      </div>

      <div className="pb-10 text-center">
        <p className="text-gray-400 text-xs">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-orange-500 font-medium">로그인</a>
        </p>
      </div>
    </div>
  )
}
