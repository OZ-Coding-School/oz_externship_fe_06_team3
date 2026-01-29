import { FormProvider } from 'react-hook-form'

import { CommonInputField } from '@/components/common/CommonInputField'
import { PasswordField } from '@/components/common/PasswordField'
import { Button } from '@/components/common/Button'
import SocialLoginSection from '@/components/auth/SocialLoginSection'
import type { SocialProviderId } from '@/types/social'
import { type LoginFormData } from '@/schemas/auth'

import { useLoginPage } from '@/hooks/useLoginPage'

export default function LoginPage() {
  const {
    methods,
    onSubmit,
    formError,
    isSubmitting,
    isValid,
    emailState,
    passwordState,
    goSignup,
    goFindId,
    goFindPw,
  } = useLoginPage()

  const handleSocialLogin = (_provider: SocialProviderId) => {
    // TODO: 소셜 로그인 구현
  }

  return (
    <FormProvider {...methods}>
      <div className="flex h-[calc(100vh-96px)] items-center justify-center bg-white px-4 py-12">
        <div className="relative mb-50 flex w-[348px] flex-col items-center gap-16">
          {/* 로고, 회원가입 */}
          <div className="flex w-full flex-col items-center gap-[27px]">
            <div className="flex w-[191px] flex-col items-center gap-4">
              <img
                className="h-6 w-[180px] object-cover"
                alt="Renewal ozcoding"
                src="/LoginPage_img/ozcoding_logo.png"
              />
            </div>

            <div className="flex w-full items-start justify-center gap-3">
              <div className="inline-flex items-center justify-center gap-2.5">
                <div className="text-mono-600 truncate whitespace-nowrap">
                  아직 회원이 아니신가요?
                </div>
              </div>

              <Button
                type="button"
                variant="link"
                size="auto"
                className="text-primary gap-2.5 text-[16px] leading-[22.4px] font-normal tracking-[-0.48px] whitespace-nowrap"
                onClick={goSignup}
              >
                회원가입 하기
              </Button>
            </div>
          </div>

          {/* 로그인 폼 */}
          <div className="flex w-full flex-col items-center gap-9">
            <div className="flex w-full flex-col items-start gap-10">
              <SocialLoginSection onLogin={handleSocialLogin} />

              <form onSubmit={onSubmit} className="w-full">
                <div className="flex w-full flex-col items-start gap-3">
                  {/* 이메일 */}
                  <CommonInputField<LoginFormData>
                    name="email"
                    type="email"
                    placeholder="아이디 (example@gmail.com)"
                    width="100%"
                    placeholderVariant="a"
                    state={emailState}
                    helperVisibility="focus"
                    helperTextByState={{ default: null }}
                  />

                  {/* 비밀번호 */}
                  <div className="flex w-full flex-col gap-1.5">
                    <PasswordField<LoginFormData>
                      name="password"
                      placeholder="비밀번호를 입력해주세요."
                      width="100%"
                      placeholderVariant="a"
                      state={passwordState}
                      helperVisibility="focus"
                      showDefaultHelper={false}
                      helperTextByState={{
                        default: '* 6~15자의 영문/숫자/특수문자 조합',
                      }}
                    />

                    {formError && (
                      <p className="px-1 text-xs font-medium text-red-500">
                        {formError}
                      </p>
                    )}
                  </div>

                  {/* 링크 */}
                  <div className="inline-flex items-center">
                    <Button
                      type="button"
                      variant="link"
                      size="auto"
                      className="py-2 whitespace-nowrap"
                      onClick={goFindId}
                    >
                      아이디 찾기
                    </Button>

                    <span className="text-mono-600 px-2 py-2 text-sm">|</span>

                    <Button
                      type="button"
                      variant="link"
                      size="auto"
                      className="py-2 whitespace-nowrap"
                      onClick={goFindPw}
                    >
                      비밀번호 찾기
                    </Button>
                  </div>

                  {/* 제출 */}
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    variant={!isValid || isSubmitting ? 'disabled' : 'primary'}
                    className="h-[52px] w-full gap-2.5 rounded px-2 py-2"
                  >
                    <div className="whitespace-nowrap">
                      {isSubmitting ? '로그인 중...' : '일반회원 로그인'}
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
