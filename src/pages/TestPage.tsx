import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Dropdown, Error404, Loading, NotFound } from '@/components/common'
import { CommonInputField } from '@/components/common/CommonInputField'
import { PasswordField } from '@/components/common/PasswordField'
import correctIcon from '@/assets/icons/correct.svg'

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
  { label: '옵션 3', value: 'option-3' },
  { label: '옵션 4', value: 'option-4' },
  { label: '옵션 5', value: 'option-5' },
  { label: '옵션 6', value: 'option-6' },
]

type TestFormData = {
  email: string
  username: string
}

type PasswordTestFormData = {
  password: string
}

function TestPage() {
  const [value, setValue] = useState<string | undefined>()
  const [showNotFound, setShowNotFound] = useState(false)

  const formMethods = useForm<TestFormData>({
    defaultValues: {
      email: '',
      username: '',
    },
    mode: 'onChange',
  })

  const passwordFormMethods = useForm<PasswordTestFormData>({
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  })

  const [passwordTestState, setPasswordTestState] = useState<'default' | 'error' | 'success'>('default')

  // 가짜 로그인용 비밀번호
  const correctPassword = 'Test123!'

  const [fieldStates, setFieldStates] = useState<{
    email: 'default' | 'error' | 'success'
    username: 'default' | 'error' | 'success'
  }>({
    email: 'default',
    username: 'default',
  })

  const watchedValues = formMethods.watch()
  
  useEffect(() => {
    setFieldStates((prev) => {
      const newStates = { ...prev }
      
      if (!watchedValues.email?.trim()) {
        newStates.email = 'default'
      }
      if (!watchedValues.username?.trim()) {
        newStates.username = 'default'
      }
      
      return newStates
    })
  }, [watchedValues.email, watchedValues.username])

  const handleValidate = async () => {
    const errors = formMethods.formState.errors

    setFieldStates({
      email: errors.email ? 'error' : formMethods.watch('email')?.trim() ? 'success' : 'default',
      username: errors.username ? 'error' : formMethods.watch('username')?.trim() ? 'success' : 'default',
    })
  }

  const onSubmit = (data: TestFormData) => {
    alert(`제출 완료!\n이메일: ${data.email}\n사용자명: ${data.username}`)
  }

  const handlePasswordValidate = async () => {
    await passwordFormMethods.trigger()
    const errors = passwordFormMethods.formState.errors
    const passwordValue = passwordFormMethods.watch('password')

    if (errors.password) {
      setPasswordTestState('error')
    } else if (passwordValue === correctPassword) {
      setPasswordTestState('success')
    } else if (passwordValue?.trim()) {
      setPasswordTestState('error')
    } else {
      setPasswordTestState('default')
    }
  }

  const passwordWatchedValue = passwordFormMethods.watch('password')
  
  useEffect(() => {
    if (!passwordWatchedValue?.trim()) {
      setPasswordTestState('default')
    }
  }, [passwordWatchedValue])

  if (showNotFound) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black">404/NotFound/Loading</h1>
          <button
            type="button"
            onClick={() => setShowNotFound(false)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            돌아가기
          </button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">Error404</p>
            <Error404 />
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">NotFound</p>
            <NotFound />
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">Loading</p>
            <Loading />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#FAFAFB] p-10">
      <h1 className="text-2xl font-semibold text-black">컴포넌트 테스트</h1>
      <button
        type="button"
        onClick={() => setShowNotFound(true)}
        className="w-fit rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
      >
        404/NotFound/Loading 테스트
      </button>
      {/* Dropdown 테스트 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-black">Dropdown 테스트</h2>
        <Dropdown options={options} value={value} onChange={setValue} />
        <Dropdown options={options} disabled />
      </div>

      {/* Password 테스트 */}
      <div className="mt-8 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-black">Password 테스트</h2>
        <FormProvider {...passwordFormMethods}>
          <form className="flex flex-col gap-4">
            <PasswordField<PasswordTestFormData>
              name="password"
              placeholder="비밀번호를 입력해주세요"
              width={288}
              state={passwordTestState}
              rules={{
                required: '비밀번호를 입력해주세요',
                minLength: {
                  value: 6,
                  message: '비밀번호는 최소 6자 이상이어야 합니다',
                },
                maxLength: {
                  value: 15,
                  message: '비밀번호는 최대 15자까지 입력 가능합니다',
                },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                  message: '영문, 숫자, 특수문자를 포함해야 합니다',
                },
              }}
              showDefaultHelper
            />
            <button
              type="button"
              onClick={handlePasswordValidate}
              className="w-[288px] rounded-md bg-[#6201E0] px-4 py-2 text-white hover:bg-[#5210be] transition-colors"
            >
              검증하기
            </button>
            <p className="text-xs text-gray-500">
              테스트용 비밀번호: <span className="font-mono font-semibold">{correctPassword}</span>
            </p>
          </form>
        </FormProvider>
      </div>

      {/* react-hook-form 테스트 */}
      <div className="mt-8 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-black">
          react-hook-form 테스트
        </h2>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <CommonInputField<TestFormData>
                name="email"
                placeholder="이메일을 입력해주세요"
                width={288}
                state={fieldStates.email}
                rightSlot={
                  fieldStates.email === 'success' ? (
                    <img src={correctIcon} alt="검증 완료" className="w-4 h-4" />
                  ) : undefined
                }
                rules={{
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '올바른 이메일 형식이 아닙니다',
                  },
                }}
                helperTextByState={{
                  default: '* 이메일 형식으로 입력해주세요',
                }}
                helperVisibility="focus"
              />

              <CommonInputField<TestFormData>
                name="username"
                placeholder="사용자명을 입력해주세요"
                width={288}
                state={fieldStates.username}
                rightSlot={
                  fieldStates.username === 'success' ? (
                    <img src={correctIcon} alt="검증 완료" className="w-4 h-4" />
                  ) : undefined
                }
                rules={{
                  required: '사용자명을 입력해주세요',
                  minLength: {
                    value: 2,
                    message: '사용자명은 최소 2자 이상이어야 합니다',
                  },
                  maxLength: {
                    value: 20,
                    message: '사용자명은 최대 20자까지 입력 가능합니다',
                  },
                }}
                helperTextByState={{
                  default: '* 2~20자의 사용자명을 입력해주세요',
                }}
                helperVisibility="focus"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleValidate}
                className="rounded-md bg-[#6201E0] px-6 py-2 text-white hover:bg-[#5210be] transition-colors"
              >
                검증하기
              </button>
              <button
                type="submit"
                className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition-colors"
              >
                제출하기
              </button>
              <button
                type="button"
                onClick={() => {
                  formMethods.reset()
                  setFieldStates({
                    email: 'default',
                    username: 'default',
                  })
                }}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                초기화
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export function StyleTestPage() {
  return (
    <div className="p-10 space-y-12 bg-gray-50 min-h-screen">
      {/* Title Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Title Styles</h2>
        <div className="space-y-2">
          <p className="title-xl">Title XL - 32px Bold</p>
          <p className="title-l">Title L - 20px Semibold</p>
          <p className="title-m-a">Title M A - 18px Bold (로그인 페이지용)</p>
          <p className="title-m-b">Title M B - 18px Semibold (마이/쪽지/비번 페이지용)</p>
        </div>
      </section>

      {/* Placeholder Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Placeholder Styles</h2>
        <div className="space-y-4 max-w-sm">
          <input
            className="placeholder-a border p-2 w-full"
            placeholder="로그인 페이지용 placeholder (14px)"
          />
          <input
            className="placeholder-b border p-2 w-full"
            placeholder="마이/쪽지/비번변경 페이지용 placeholder (16px)"
          />
        </div>
      </section>

      {/* Layout Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">flex-center</h2>
        <div className="h-32 bg-white border flex-center">
          <span className="title-m-b"> h-32 bg-white border flex-center</span>
        </div>
      </section>
    </div>
  );
}

export default TestPage
