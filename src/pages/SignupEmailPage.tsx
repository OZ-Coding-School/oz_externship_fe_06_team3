import { FormProvider } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Button } from '@/components/common/Button'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { SignupFormData } from '@/schemas/auth'

import { useSignupEmailForm } from '@/hooks/useSignupEmailForm'

import { NicknameSection } from '@/components/signup/NicknameSection'
import { EmailSection } from '@/components/signup/EmailSection'
import { PhoneSection } from '@/components/signup/PhoneSection'
import { PasswordSection } from '@/components/signup/PasswordSection'
import { GenderField } from '@/components/signup/GenderField'

export default function SignupEmailPage() {
  const { methods, values, ui, messages, actions } = useSignupEmailForm()

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-gray-100 pt-20 pb-24">
        <div className="bg-white px-6 py-10">
          <div className="flex w-[480px] flex-col gap-9">
            {/* 상단 */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-[18px] leading-normal font-bold tracking-[-0.36px] text-[#000a30]">
                마법같이 빠르게 성장시켜줄
              </p>
              <img
                className="h-6 w-[180px] object-contain"
                alt="OZ. 오즈코딩스쿨"
                src="/LoginPage_img/ozcoding_logo.png"
              />
            </div>

            <h1 className="text-left text-[18px] leading-[25.2px] font-semibold tracking-[-0.54px] text-[#121212]">
              회원가입
            </h1>

            <form onSubmit={actions.onSubmit} className="flex flex-col gap-11">
              {/* 이름 */}
              <FieldBlock label="이름">
                <CommonInputField<SignupFormData>
                  name="name"
                  type="text"
                  placeholder="이름을 입력해주세요"
                  width="100%"
                  placeholderVariant="a"
                  helperVisibility="always"
                />
              </FieldBlock>

              {/* 닉네임, 중복확인 */}
              <NicknameSection
                nicknameFieldState={ui.nicknameFieldState}
                nicknameMsg={messages.nicknameMsg}
                nicknameChecked={ui.nicknameChecked}
                nickname={values.nickname}
                canCheckNickname={ui.canCheckNickname}
                busy={ui.busy}
                onCheckNickname={actions.onCheckNickname}
              />

              {/* 생년월일 */}
              <FieldBlock label="생년월일">
                <CommonInputField<SignupFormData>
                  name="birthdate"
                  type="text"
                  placeholder="8자리 입력해주세요 (ex.20000101)"
                  width="100%"
                  placeholderVariant="a"
                  helperVisibility="always"
                />
              </FieldBlock>

              {/* 성별 */}
              <FieldBlock label="성별">
                <GenderField />
              </FieldBlock>

              {/* 이메일 */}
              <EmailSection
                emailFieldState={ui.emailFieldState}
                emailCodeFieldState={ui.emailCodeFieldState}
                emailSendMsg={messages.emailSendMsg}
                emailVerifyMsg={messages.emailVerifyMsg}
                emailVerified={ui.emailVerified}
                emailCodeSent={ui.emailCodeSent}
                emailTimer={ui.emailTimer}
                emailSendLabel={ui.emailSendLabel}
                canSendEmail={ui.canSendEmail}
                canVerifyEmail={ui.canVerifyEmail}
                onSendEmailCode={actions.onSendEmailCode}
                onVerifyEmailCode={actions.onVerifyEmailCode}
              />

              {/* 휴대전화 */}
              <PhoneSection
                phone1={values.phone1}
                phoneDigitsState={ui.phoneDigitsState}
                smsCodeFieldState={ui.smsCodeFieldState}
                phoneSendMsg={messages.phoneSendMsg}
                phoneSendStatus={ui.phoneSendStatus}
                smsVerifyMsg={messages.smsVerifyMsg}
                smsVerified={ui.smsVerified}
                smsCodeSent={ui.smsCodeSent}
                smsTimer={ui.smsTimer}
                smsSendLabel={ui.smsSendLabel}
                canSendSms={ui.canSendSms}
                canVerifySms={ui.canVerifySms}
                formError={messages.formError}
                onSendSmsCode={actions.onSendSmsCode}
                onVerifySmsCode={actions.onVerifySmsCode}
              />

              {/* 비밀번호 */}
              <PasswordSection
                passwordFieldState={ui.passwordFieldState}
                passwordConfirmState={ui.passwordConfirmState}
                passwordConfirmMsg={messages.passwordConfirmMsg}
              />

              {/* 제출 */}
              <Button
                type="submit"
                size="xxl"
                variant={ui.canSubmit ? 'primary' : 'disabled'}
                disabled={!ui.canSubmit}
                className="whitespace-nowrap"
              >
                {ui.busy ? '처리 중...' : '가입하기'}
              </Button>
            </form>

            <p className="mt-6 text-center">
              <Link
                to="/signup"
                className="text-mono-600 text-[16px] leading-[22.4px] tracking-[-0.48px] underline hover:no-underline"
              >
                소셜/일반 선택으로 돌아가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

// UI 레이아웃 컴포넌트
function FieldBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-5">
      <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
        {label}
        <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
          *
        </span>
      </label>
      {children}
    </div>
  )
}
