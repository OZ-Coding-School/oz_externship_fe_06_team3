import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'

import { CommonInputField } from '@/components/common/CommonInputField'
import { PasswordField } from '@/components/common/PasswordField'
import { Button } from '@/components/common/Button'
import { useAuthStore } from '@/store/authStore'

import SocialLoginSection from '@/components/auth/SocialLoginSection'
import type { SocialProviderId } from '@/types/social'

import {
  loginSchema,
  type LoginFormData,
  PASSWORD_HELPER,
} from '@/schemas/auth'

type LocationState = { from?: string }

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const authLogin = useAuthStore((s) => s.login)

  const from = (location.state as LocationState | null)?.from ?? '/'

  const [formError, setFormError] = useState<string | null>(null)
  const [loginFailed, setLoginFailed] = useState(false)

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = methods

  const email = useWatch({ control, name: 'email' }) ?? ''
  const password = useWatch({ control, name: 'password' }) ?? ''

  const onSubmit = handleSubmit(async (data) => {
    setFormError(null)
    setLoginFailed(false)

    try {
      await authLogin(data)
      navigate(from, { replace: true })
    } catch {
      setLoginFailed(true)
      setFormError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  })

  const handleSocialLogin = (provider: SocialProviderId) => {
    console.log(`${provider} 로그인`)
  }

  useEffect(() => {
    if (!loginFailed && !formError) return
    setLoginFailed(false)
    setFormError(null)
  }, [email, password, loginFailed, formError])

  const emailState = loginFailed || errors.email ? 'error' : 'default'
  const passwordState = loginFailed || errors.password ? 'error' : 'default'

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
                <div className="truncate whitespace-nowrap text-black/20">
                  아직 회원이 아니신가요?
                </div>
              </div>

              <Button
                type="button"
                variant="link"
                size="auto"
                className="text-primary gap-2.5 text-[16px] leading-[22.4px] font-normal tracking-[-0.48px] whitespace-nowrap"
                onClick={() => console.log('회원가입 이동')}
              >
                회원가입 하기
              </Button>
            </div>
          </div>

          {/* 로그인 폼 */}
          <div className="flex w-full flex-col items-center gap-9">
            <div className="flex w-full flex-col items-start gap-10">
              {/* 소셜 로그인 */}
              <SocialLoginSection onLogin={handleSocialLogin} />

              {/* 일반 로그인 */}
              <form onSubmit={onSubmit} className="w-full">
                <div className="flex w-full flex-col items-start gap-3">
                  {/* 아이디 */}
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
                      helperTextByState={{ default: PASSWORD_HELPER }}
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
                      onClick={() => console.log('아이디 찾기')}
                    >
                      아이디 찾기
                    </Button>

                    <span className="text-mono-600 px-2 py-2 text-sm">|</span>

                    <Button
                      type="button"
                      variant="link"
                      size="auto"
                      className="py-2 whitespace-nowrap"
                      onClick={() => console.log('비밀번호 찾기')}
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
