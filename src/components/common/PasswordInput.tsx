import { forwardRef, useMemo, useState } from 'react'
import {
  CommonInput,
  type CommonInputProps,
  type FieldState,
  type HelperVisibility,
} from './CommonInput'

const DEFAULT_HELPER = '* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합'
const ERROR_HELPER = '* 비밀번호가 올바르지 않습니다.'
const SUCCESS_HELPER = '* 비밀번호가 확인되었습니다.'

type PasswordInputProps = Omit<
  CommonInputProps,
  'type' | 'rightSlot' | 'helperText' | 'helperTextByState' | 'helperVisibility'
> & {
  state?: FieldState
  showDefaultHelper?: boolean
  helperTextByState?: Partial<Record<FieldState, React.ReactNode>>
  helperVisibility?: HelperVisibility

  showVisibilityToggle?: boolean
  showStatusIcon?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      state = 'default',
      locked = false,
      disabled,
      showDefaultHelper = false,
      helperTextByState,
      helperVisibility,
      showVisibilityToggle = true,
      showStatusIcon = false,
      autoComplete,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = useState(false)

    const mergedHelpers = useMemo(() => {
      return {
        default: showDefaultHelper ? DEFAULT_HELPER : null,
        error: ERROR_HELPER,
        success: SUCCESS_HELPER,
        ...helperTextByState,
      }
    }, [helperTextByState, showDefaultHelper])

    const resolvedVisibility: HelperVisibility =
      helperVisibility ?? (showDefaultHelper ? 'focus' : 'never')

    const canToggle = !disabled && !locked

    return (
      <CommonInput
        {...props}
        ref={ref}
        type={show ? 'text' : 'password'}
        autoComplete={autoComplete ?? 'current-password'}
        state={state}
        locked={locked}
        disabled={disabled}
        helperTextByState={mergedHelpers}
        helperVisibility={resolvedVisibility}
        rightSlot={
          <div className="flex items-center gap-2">
            {showStatusIcon && state === 'success' && (
              <img
                src="/icons/correct.svg"
                alt="검증 완료"
                className="h-4 w-4"
              />
            )}

            {showVisibilityToggle && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShow((p) => !p)}
                disabled={!canToggle}
                aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
                className="-mr-1 p-1 text-gray-400 transition-colors hover:text-gray-600 focus:text-violet-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <img
                  src={show ? '/icons/eyeOpen.svg' : '/icons/eyeClose.svg'}
                  alt=""
                  className="h-5 w-5"
                />
              </button>
            )}
          </div>
        }
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
