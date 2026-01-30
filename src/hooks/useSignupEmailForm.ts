import { useCallback, useRef } from 'react'
import type { SignupFormData } from '@/schemas/auth'
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
  const logicRef = useRef(logic)
  logicRef.current = logic
  const v = logic.watchValues

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

  const triggerForForm = useCallback(
    (name: keyof SignupFormData) => logicRef.current.trigger(name),
    []
  )

  const passwordSection = usePasswordSection({
    password: v.password,
    passwordConfirm: v.passwordConfirm,
    trigger: triggerForForm,
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

  return {
    methods: logic.methods,
    common: {
      busy: logic.busy,
      formError: logic.formError,
      name: v.name,
      birthdate: v.birthdate,
    },
    sections: {
      nickname: {
        values: nicknameSection.values,
        ui: nicknameSection.ui,
        messages: nicknameSection.messages,
        actions: nicknameSection.actions,
      },
      email: {
        values: emailSection.values,
        ui: emailSection.ui,
        messages: emailSection.messages,
        actions: emailSection.actions,
      },
      sms: {
        values: smsSection.values,
        ui: smsSection.ui,
        messages: smsSection.messages,
        actions: smsSection.actions,
      },
      password: {
        values: passwordSection.values,
        ui: passwordSection.ui,
        messages: passwordSection.messages,
      },
      submit: {
        ui: submitSection.ui,
        actions: submitSection.actions,
      },
    },
  }
}
