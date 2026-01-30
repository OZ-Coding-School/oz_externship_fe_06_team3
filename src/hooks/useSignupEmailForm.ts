import { useCallback, useMemo } from 'react'
import { useSignupFormLogic } from '@/hooks/signup/useSignupFormLogic'
import {
  useNicknameSection,
  useEmailSection,
  useSmsSection,
  usePasswordSection,
  useSubmitSection,
} from '@/hooks/signup/sections'

export function useSignupEmailForm() {
  const logic = useSignupFormLogic()
  const v = logic.watchValues

  const trigger = useCallback(
    (name: string) =>
      logic.trigger(name as Parameters<typeof logic.trigger>[0]),
    [logic]
  )

  const nicknameSection = useNicknameSection({
    nickname: v.nickname,
    nicknameChecked: logic.nicknameChecked,
    nicknameStatus: logic.nicknameStatus,
    nicknameMsg: logic.nicknameMsg,
    busy: logic.busy,
    onCheckNickname: logic.onCheckNickname,
  })

  const emailSection = useEmailSection({
    emailFlow: logic.emailFlow,
    email: v.email,
    emailCode: v.emailCode,
  })

  const smsSection = useSmsSection({
    smsFlow: logic.smsFlow,
    phone1: v.phone1,
    phone2: v.phone2,
    phone3: v.phone3,
    smsCode: v.smsCode,
    phoneNumber: v.phoneNumber,
  })

  const passwordSection = usePasswordSection({
    password: v.password,
    passwordConfirm: v.passwordConfirm,
    trigger,
  })

  const submitSection = useSubmitSection({
    formValid: logic.formState.isValid,
    busy: logic.busy,
    nicknameChecked: nicknameSection.ui.nicknameChecked,
    emailVerified: emailSection.ui.emailVerified,
    smsVerified: smsSection.ui.smsVerified,
    passwordFieldState: passwordSection.ui.passwordFieldState,
    passwordConfirmState: passwordSection.ui.passwordConfirmState,
    onSubmit: logic.onSubmit,
  })

  // 섹션 훅 반환 객체가 매 렌더 새로 만들어진다면 useMemo 효과가 줄어듦 → 필요 시 각 섹션 훅 내부에서 반환값 useMemo로 안정화
  return useMemo(
    () => ({
      methods: logic.methods,
      values: {
        name: v.name,
        birthdate: v.birthdate,
        ...nicknameSection.values,
        ...emailSection.values,
        ...smsSection.values,
        ...passwordSection.values,
      },
      ui: {
        busy: logic.busy,
        ...nicknameSection.ui,
        ...emailSection.ui,
        ...smsSection.ui,
        ...passwordSection.ui,
        ...submitSection.ui,
      },
      messages: {
        ...nicknameSection.messages,
        ...emailSection.messages,
        ...smsSection.messages,
        ...passwordSection.messages,
        formError: logic.formError,
      },
      actions: {
        ...nicknameSection.actions,
        ...emailSection.actions,
        ...smsSection.actions,
        ...submitSection.actions,
      },
    }),
    [logic, v, nicknameSection, emailSection, smsSection, passwordSection, submitSection]
  )
}
