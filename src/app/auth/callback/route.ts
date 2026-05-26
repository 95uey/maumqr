import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // next: 로그인 후 돌아갈 URL (결제 페이지 또는 /onboarding)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 신규 가입자 확인 — profiles 테이블에 row가 없으면 onboarding으로
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!profile && !next.startsWith('/u/')) {
          // 프로필 없는 신규 가입자 → 온보딩
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 오류 발생 시 에러 페이지로
  return NextResponse.redirect(`${origin}/auth/error`)
}
