// 로그인/회원가입 문구 관리를 위한 플로우 메시지 타입 정의
import type { FieldValues, Path, FieldErrors } from 'react-hook-form'
import type { FieldState } from '@/components/common/CommonInput'

export type FlowMessageScope = 'send' | 'verify' | 'expired' | null

/** 플로우 메시지(전송/검증 결과), scope로 표시 위치 결정. */
export type FlowMessage = {
  type: 'idle' | 'success' | 'error'
  message: string | null
  scope: FlowMessageScope
}

export const IDLE_FLOW_MESSAGE: FlowMessage = {
  type: 'idle',
  message: null,
  scope: null,
}

export function getFieldErrorMessage<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: Path<T>
): string | undefined {
  const err = errors[name]
  return err && 'message' in err && typeof err.message === 'string'
    ? err.message
    : undefined
}

/** RHF error + flow 상태 기반으로 FieldState 한 곳에서 계산. */
export function deriveFieldState(params: {
  hasError: boolean
  isVerified: boolean
  isSuccess?: boolean
}): FieldState {
  const { hasError, isVerified, isSuccess } = params
  if (isVerified || isSuccess) return 'success'
  if (hasError) return 'error'
  return 'default'
}
