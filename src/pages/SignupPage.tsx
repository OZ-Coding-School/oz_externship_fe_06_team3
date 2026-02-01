import { Link } from 'react-router-dom'

import SocialLoginSection from '@/components/auth/SocialLoginSection'
import type { SocialProviderId } from '@/types/social'

export default function SignupPage() {
  const handleSocialSignup = (_provider: SocialProviderId) => {
    void _provider
  }

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center bg-white px-4 py-12">
      <div className="relative mb-[min(40vh)] flex w-[348px] flex-col items-center gap-16">
        {/* 로고, 로그인 */}
        <div className="flex w-full flex-col items-center gap-[27px]">
          <div className="flex w-[191px] flex-col items-center gap-4">
            <img
              className="h-6 w-[180px] object-cover"
              alt="OZ. 오즈코딩스쿨"
              src="/LoginPage_img/ozcoding_logo.png"
            />
          </div>

          <div className="flex w-full items-start justify-center gap-3">
            <div className="inline-flex items-center justify-center gap-2.5">
              <span className="text-mono-600 truncate whitespace-nowrap">
                현재 회원이신가요?{' '}
              </span>
              <Link
                to="/login"
                className="text-primary text-[16px] leading-[22.4px] font-normal tracking-[-0.48px] whitespace-nowrap hover:underline"
              >
                로그인하기
              </Link>
            </div>
          </div>
        </div>

        {/* 소셜회원 가입, 일반회원 가입 */}
        <div className="flex w-full flex-col items-center gap-9">
          <div className="flex w-full flex-col items-start gap-10">
            <SocialLoginSection onLogin={handleSocialSignup} mode="signup" />

            <div className="flex w-full justify-center">
              <Link
                to="/signup/email"
                className="text-mono-600 text-[16px] leading-[22.4px] font-normal tracking-[-0.48px] whitespace-nowrap underline"
              >
                일반회원 가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
