import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { CommonInputField } from '@/components/common/CommonInputField'
import { PasswordField } from '@/components/common/PasswordField'

type LoginFormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null)

  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const { watch, handleSubmit } = methods
  const email = watch('email')
  const password = watch('password')

  // 유효성 검사
  const isEmailValid = email.includes('@')
  const isPasswordValid = password.length > 0

  const isFormValid = isEmailValid && isPasswordValid

  // 2️⃣ 일반 로그인
  const handleLogin = handleSubmit(async (data): Promise<void> => {
    setLoginAttempted(true)
    // TODO: 로그인 API 연동
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await loginAPI(data)
      // setLoginSuccess(true)
      
      // 임시로 실패 처리 (API 연동 후 제거)
      setLoginSuccess(false)
      console.log('일반 로그인', data)
    } catch (error) {
      setLoginSuccess(false)
    }
  })

  // 3️⃣ 소셜 로그인
  const handleKakaoLogin = (): void => {
    // TODO: 카카오 OAuth 이동
    console.log('카카오 로그인')
  }

  const handleNaverLogin = (): void => {
    // TODO: 네이버 OAuth 이동
    console.log('네이버 로그인')
  }

  return (
    <FormProvider {...methods}>
      <div className="flex h-[calc(100vh-96px)] bg-white items-center justify-center py-12 px-4">
        <div className="relative flex w-[348px] flex-col items-center gap-16 mb-50">
          {/* 로고 및 회원가입 유도 영역 */}
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
              >
                <div className="whitespace-nowrap text-[16px] font-normal leading-[22.4px] tracking-[-0.48px] text-primary">
                  회원가입 하기
                </div>
              </button>
            </div>
          </div>

          {/* 소셜 로그인 및 일반 로그인 폼 영역 */}
          <div className="flex w-full flex-col items-center gap-9">
            <div className="flex w-full flex-col items-start gap-10">
              {/* 소셜 로그인 */}
              <div className="flex w-full flex-col items-start gap-3">
                {/* Kakao */}
                <button
                  type="button"
                  onClick={handleKakaoLogin}
                  className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded bg-[#fee500] px-2 py-2"
                >
                  <div className="inline-flex items-center gap-1">
                    <div className="flex w-5 flex-col items-center justify-center gap-2.5 px-[3px] py-1">
                      <img
                        className="h-3 w-[13px]"
                        alt="Vector"
                        src="/LoginPage_img/kakao_logo.svg"
                      />
                    </div>
                    <p className="whitespace-nowrap text-[16px] font-normal tracking-[-0.32px] text-[#391C1A]">
                      카카오 간편 로그인 / 가입
                    </p>
                  </div>
                </button>

                {/* Naver */}
                <button
                  type="button"
                  onClick={handleNaverLogin}
                  className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded bg-[#03c75a] px-2 py-2"
                >
                  <div className="inline-flex items-center gap-1">
                    <div className="flex w-5 flex-col items-center justify-center gap-2.5 px-[3px] py-1">
                      <img
                        className="h-[13px] w-[13px]"
                        alt="Vector"
                        src="/LoginPage_img/naver_logo.svg"
                      />
                    </div>
                    <p className="whitespace-nowrap text-[16px] font-normal tracking-[-0.32px] text-white">
                      네이버 간편 로그인 / 가입
                    </p>
                  </div>
                </button>
              </div>

              {/* 일반 로그인 폼 영역 */}
              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex w-full flex-col items-start gap-3">
                  {/* 아이디 */}
                  <div className="flex w-full items-start gap-5">
                    <CommonInputField<LoginFormData>
                      name="email"
                      type="email"
                      placeholder="아이디 (example@gmail.com)"
                      width="100%"
                      inputClassName="placeholder-a tracking-[-0.42px]"
                      rules={{
                        required: '이메일을 입력해주세요.',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: '올바른 이메일 형식을 입력해주세요.',
                        },
                      }}
                      state={isEmailValid ? 'success' : email ? 'error' : 'default'}
                      helperVisibility="focus"
                    />
                  </div>

                  {/* 비밀번호 + 링크 */}
                  <div className="flex w-full flex-col items-start gap-2">
                    <div className="flex w-full items-start gap-5">
                      <PasswordField<LoginFormData>
                        name="password"
                        placeholder="비밀번호를 입력해주세요."
                        width="100%"
                        inputClassName="placeholder-a tracking-[-0.42px]"
                        rules={{
                          required: '비밀번호를 입력해주세요.',
                        }}
                        state={
                          loginAttempted
                            ? loginSuccess
                              ? 'success'
                              : 'error'
                            : 'default'
                        }
                        helperTextByState={{
                          default: '* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합',
                          success: '* 비밀번호가 일치합니다.',
                          error: '* 비밀번호가 일치하지 않습니다.',
                        }}
                        helperVisibility={loginAttempted ? 'always' : 'focus'}
                        showDefaultHelper={false}
                      />
                    </div>

                    <div className="inline-flex items-center">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2.5 py-2"
                      >
                        <div className="whitespace-nowrap text-sm text-mono-600">
                          아이디 찾기
                        </div>
                      </button>

                      <div className="inline-flex items-center justify-center gap-2 px-2 py-2">
                        <div className="whitespace-nowrap text-sm text-mono-600">|</div>
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2.5 py-2"
                      >
                        <div className="whitespace-nowrap text-sm text-mono-600">
                          비밀번호 찾기
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 로그인 버튼 */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={!isFormValid}
                  className={`flex h-[52px] w-full items-center justify-center gap-2.5 rounded px-2 py-2 ${
                    isFormValid
                      ? 'bg-gray-900 hover:bg-gray-800'
                      : 'bg-mono-200 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`whitespace-nowrap ${
                      isFormValid ? 'text-white' : 'text-mono-400'
                    }`}
                  >
                    일반회원 로그인
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default LoginPage
