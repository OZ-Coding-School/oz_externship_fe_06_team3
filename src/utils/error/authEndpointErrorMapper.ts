// Auth API 에러 → 폼에 보여줄 메시지로 변환 (mapLoginError, mapSendSmsError 등)
import { AUTH_MESSAGES } from '@/constants/authMessages'
import { parseAxiosError, resolveMessage } from '@/utils/error/axiosErrorParser'
import type { MappedError } from '@/utils/error/types'

function toForm(message: string): MappedError {
  return { kind: 'form', message }
}
function toField(field: string, message: string): MappedError {
  return { kind: 'field', field, message }
}
function toTokenInvalid(message: string): MappedError {
  return { kind: 'tokenInvalid', message }
}

function getFallbackMessage(
  parsed: ReturnType<typeof parseAxiosError>,
  fallback: string
): string {
  if (parsed.networkError) return AUTH_MESSAGES.common.networkError
  if (parsed.status && parsed.status >= 500)
    return AUTH_MESSAGES.common.serverError
  return fallback
}

export function mapSendSmsError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const message = resolveMessage(
    parsed,
    {
      409: AUTH_MESSAGES.sms.sendErrorAlreadyRegistered,
      400: AUTH_MESSAGES.sms.sendErrorBadRequest,
    },
    getFallbackMessage(parsed, AUTH_MESSAGES.sms.sendErrorFallback)
  )
  return toForm(message)
}

export function mapVerifySmsError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const message = resolveMessage(
    parsed,
    {
      400: AUTH_MESSAGES.sms.verifyErrorMismatch,
      409: AUTH_MESSAGES.sms.sendErrorAlreadyRegistered,
    },
    getFallbackMessage(parsed, AUTH_MESSAGES.sms.verifyErrorFallback)
  )
  return toField('verificationCode', message)
}

export function mapFindMaskedEmailError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const message =
    parsed.status === 404
      ? AUTH_MESSAGES.findId.notFound
      : resolveMessage(
          parsed,
          { 400: AUTH_MESSAGES.findId.findFailed },
          getFallbackMessage(parsed, AUTH_MESSAGES.findId.findFailed)
        )
  return toForm(message)
}

export function mapSendEmailError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const message = resolveMessage(
    parsed,
    {
      409: AUTH_MESSAGES.email.sendErrorAlreadyRegistered,
      400: AUTH_MESSAGES.email.sendErrorBadRequest,
    },
    getFallbackMessage(parsed, AUTH_MESSAGES.email.sendErrorFallback)
  )
  return toForm(message)
}

export function mapVerifyEmailError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const message = resolveMessage(
    parsed,
    {
      400: AUTH_MESSAGES.email.verifyErrorMismatch,
      409: AUTH_MESSAGES.email.sendErrorAlreadyRegistered,
    },
    getFallbackMessage(parsed, AUTH_MESSAGES.email.verifyErrorFallback)
  )
  return toField('verificationCode', message)
}

export function mapResetPasswordError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const emailTokenError = parsed.fieldErrors.email_token
  const isTokenInvalid =
    parsed.status === 400 &&
    emailTokenError?.includes('이메일 인증을 다시 진행')

  if (isTokenInvalid) {
    return toTokenInvalid(
      emailTokenError ?? AUTH_MESSAGES.resetPassword.tokenInvalid
    )
  }
  const message = resolveMessage(
    parsed,
    { 400: AUTH_MESSAGES.resetPassword.failed },
    getFallbackMessage(parsed, AUTH_MESSAGES.resetPassword.failed)
  )
  return toForm(message)
}

export function mapChangePasswordError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const newPasswordError = parsed.fieldErrors?.new_password
  const oldPasswordError = parsed.fieldErrors?.old_password

  if (newPasswordError) {
    return toField('newPassword', newPasswordError)
  }
  if (oldPasswordError) {
    return toField('currentPassword', oldPasswordError)
  }

  if (parsed.status === 401) {
    return toForm(parsed.detail ?? AUTH_MESSAGES.changePassword.unauthorized)
  }

  const message = resolveMessage(
    parsed,
    { 400: AUTH_MESSAGES.changePassword.failed },
    getFallbackMessage(parsed, AUTH_MESSAGES.changePassword.failed)
  )
  return toForm(message)
}

export function mapCheckNicknameError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const message = resolveMessage(
    parsed,
    {
      409: AUTH_MESSAGES.nickname.duplicated,
      400: AUTH_MESSAGES.nickname.invalidFormat,
    },
    getFallbackMessage(parsed, AUTH_MESSAGES.nickname.checkFailed)
  )
  return toField('nickname', message)
}

export function mapSignupError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const message = resolveMessage(
    parsed,
    {
      409: AUTH_MESSAGES.form.signupDuplicate,
      400: AUTH_MESSAGES.form.signupBadRequest,
    },
    getFallbackMessage(parsed, AUTH_MESSAGES.form.signupFailed)
  )
  return toForm(message)
}

export function mapLoginError(err: unknown): MappedError {
  const parsed = parseAxiosError(err)
  const message = resolveMessage(
    parsed,
    {},
    getFallbackMessage(parsed, AUTH_MESSAGES.login.formError)
  )
  return toForm(message)
}
