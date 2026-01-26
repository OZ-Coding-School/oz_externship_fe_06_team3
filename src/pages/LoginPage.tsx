import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { CommonInputField } from '@/components/common/CommonInputField'
import { PasswordField } from '@/components/common/PasswordField'
import { useAuthStore } from '@/store/authStore'

// 가짜 아이디: test@example.com
// 가짜 비밀번호: Test123!

type LoginFormData = {
  email: string
  password: string
}

type LocationState = {
  from?: string
}

const DEFAULT_PASSWORD_HELPER =
  '* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const authLogin = useAuthStore((s) => s.login)

  const from = (location.state as LocationState | null)?.from ?? '/'

  const [loginResult, setLoginResult] = useState<'idle' | 'error'>('idle')

  const methods = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const {
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = methods

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

  const resetServerFeedbackIfNeeded = () => {
    if (loginResult !== 'idle') setLoginResult('idle')
    if (errors.root?.message) clearErrors('root')
  }

  const handleKakaoLogin = (): void => {
    console.log('카카오 로그인')
  }

  const handleNaverLogin = (): void => {
    console.log('네이버 로그인')
  }

  const onSubmit = handleSubmit(async (data) => {
    clearErrors('root')

    try {
      await authLogin(data)
      navigate(from, { replace: true })
    } catch {
      setLoginResult('error')

      setError('root', {
        type: 'server',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      })
    }
  })

  const emailFieldState = loginResult === 'error' ? 'error' : 'default'
  const passwordFieldState = loginResult === 'error' ? 'error' : 'default'

  return (
    <FormProvider {...methods}>
      <div className="flex h-[calc(100vh-96px)] items-center justify-center bg-white px-4 py-12">
        <div className="relative mb-50 flex w-[348px] flex-col items-center gap-16">
          {/* 로고, 회원가입 영역 */}
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

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2.5"
                onClick={() => console.log('회원가입 이동')}
              >
                <div className="text-primary text-[16px] leading-[22.4px] font-normal tracking-[-0.48px] whitespace-nowrap">
                  회원가입 하기
                </div>
              </button>
            </div>
          </div>

          {/* 소셜 로그인, 일반 로그인 영역 */}
          <div className="flex w-full flex-col items-center gap-9">
            <div className="flex w-full flex-col items-start gap-10">
              {/* 소셜 로그인 */}
              <div className="flex w-full flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={handleKakaoLogin}
                  className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded bg-[#fee500] px-2 py-2"
                >
                  <div className="inline-flex items-center gap-1">
                    <div className="flex w-5 flex-col items-center justify-center gap-2.5 px-[3px] py-1">
                      <img
                        className="h-3 w-[13px]"
                        alt="Kakao"
                        src="/LoginPage_img/kakao_logo.svg"
                      />
                    </div>
                    <p className="text-[16px] font-normal tracking-[-0.32px] whitespace-nowrap text-[#391C1A]">
                      카카오 간편 로그인 / 가입
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleNaverLogin}
                  className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded bg-[#03c75a] px-2 py-2"
                >
                  <div className="inline-flex items-center gap-1">
                    <div className="flex w-5 flex-col items-center justify-center gap-2.5 px-[3px] py-1">
                      <img
                        className="h-[13px] w-[13px]"
                        alt="Naver"
                        src="/LoginPage_img/naver_logo.svg"
                      />
                    </div>
                    <p className="text-[16px] font-normal tracking-[-0.32px] whitespace-nowrap text-white">
                      네이버 간편 로그인 / 가입
                    </p>
                  </div>
                </button>
              </div>

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
                    rules={{
                      required: '이메일을 입력해주세요.',
                      pattern: {
                        value: emailRegex,
                        message: '올바른 이메일 형식을 입력해주세요.',
                      },
                      onChange: resetServerFeedbackIfNeeded,
                    }}
                    helperVisibility="focus"
                    state={emailFieldState}
                  />

                  {/* 비밀번호 */}
                  <PasswordField<LoginFormData>
                    name="password"
                    placeholder="비밀번호를 입력해주세요."
                    width="100%"
                    placeholderVariant="a"
                    rules={{
                      required: '비밀번호를 입력해주세요.',
                      minLength: {
                        value: 6,
                        message: '비밀번호는 최소 6자 이상 입력해주세요.',
                      },
                      onChange: resetServerFeedbackIfNeeded,
                    }}
                    helperTextByState={{ default: DEFAULT_PASSWORD_HELPER }}
                    helperVisibility="focus"
                    showDefaultHelper
                    state={passwordFieldState}
                  />

                  {/* 로그인 실패 메세지 */}
                  {errors.root?.message && (
                    <p className="px-1 text-xs font-medium text-red-500">
                      {errors.root.message}
                    </p>
                  )}

                  {/* 아이디/비번 찾기 */}
                  <div className="inline-flex items-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2.5 py-2"
                      onClick={() => console.log('아이디 찾기')}
                    >
                      <div className="text-mono-600 text-sm whitespace-nowrap">
                        아이디 찾기
                      </div>
                    </button>

                    <div className="inline-flex items-center justify-center gap-2 px-2 py-2">
                      <div className="text-mono-600 text-sm whitespace-nowrap">
                        |
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2.5 py-2"
                      onClick={() => console.log('비밀번호 찾기')}
                    >
                      <div className="text-mono-600 text-sm whitespace-nowrap">
                        비밀번호 찾기
                      </div>
                    </button>
                  </div>

                  {/* 로그인 버튼 */}
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`flex h-[52px] w-full items-center justify-center gap-2.5 rounded px-2 py-2 ${
                      isValid && !isSubmitting
                        ? 'bg-primary hover:bg-primary-hover'
                        : 'bg-mono-200 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`whitespace-nowrap ${
                        isValid && !isSubmitting
                          ? 'text-white'
                          : 'text-mono-400'
                      }`}
                    >
                      {isSubmitting ? '로그인 중...' : '일반회원 로그인'}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default LoginPage
