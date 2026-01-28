import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type InputHTMLAttributes,
} from 'react'
import clsx from 'clsx'

export type FieldState = 'default' | 'error' | 'success'
export type HelperVisibility = 'always' | 'focus' | 'never'

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'className'
>

export interface CommonInputProps extends NativeInputProps {
  value: string
  onChange: (value: string) => void
  state?: FieldState
  locked?: boolean
  width?: number | string
  rightSlot?: React.ReactNode
  placeholderVariant?: 'a' | 'b'

  helperText?: React.ReactNode
  helperTextByState?: Partial<Record<FieldState, React.ReactNode>>
  helperVisibility?: HelperVisibility
  persistHelperOnBlurWhenFilled?: boolean
}

export const CommonInput = forwardRef<HTMLInputElement, CommonInputProps>(
  (
    {
      value,
      onChange,
      state = 'default',
      locked = false,
      width,
      rightSlot,
      placeholderVariant = 'a',
      helperText,
      helperTextByState,
      helperVisibility = 'never',
      persistHelperOnBlurWhenFilled = true,
      id,
      disabled,
      readOnly,
      ...inputProps
    },
    ref
  ) => {
    const autoId = useId()
    const inputId = id ?? `input-${autoId}`

    const [isFocused, setIsFocused] = useState(false)

    const isReadOnly = locked || !!readOnly
    const isDisabled = !!disabled

    const hasValue = String(value ?? '').trim().length > 0

    const resolvedHelper = useMemo(() => {
      return helperTextByState?.[state] ?? helperText ?? null
    }, [helperTextByState, helperText, state])

    const helperId = useMemo(() => {
      return resolvedHelper ? `${inputId}-helper` : undefined
    }, [inputId, resolvedHelper])

    const shouldShowHelper = useMemo(() => {
      if (!resolvedHelper) return false
      if (helperVisibility === 'never') return false

      if (state === 'error' || state === 'success') return true

      if (helperVisibility === 'always') return true
      if (isFocused) return true
      if (persistHelperOnBlurWhenFilled && hasValue) return true

      return false
    }, [
      resolvedHelper,
      helperVisibility,
      state,
      isFocused,
      persistHelperOnBlurWhenFilled,
      hasValue,
    ])

    const widthStyle =
      typeof width === 'number'
        ? `${width}px`
        : typeof width === 'string'
          ? width
          : undefined

    return (
      <div
        className="flex w-full min-w-0 flex-col gap-1.5"
        style={{
          width: widthStyle,
          minWidth: 0,
        }}
      >
        <div
          className={clsx(
            'flex h-12 min-w-0 items-center gap-2.5 rounded-lg border px-4 transition-colors duration-200',
            'focus-within:ring-1 focus-within:ring-inset',
            state === 'default' &&
              'border-gray-300 bg-white focus-within:border-violet-600 focus-within:ring-violet-600',
            state === 'error' &&
              'border-red-500 bg-white focus-within:border-red-600 focus-within:ring-red-600',
            state === 'success' &&
              'border-green-500 bg-white focus-within:border-green-600 focus-within:ring-green-600',
            locked && 'border-gray-200 bg-gray-100',
            isDisabled && 'cursor-not-allowed opacity-60'
          )}
        >
          <input
            {...inputProps}
            id={inputId}
            ref={ref}
            value={value}
            readOnly={isReadOnly}
            disabled={isDisabled}
            onChange={(e) => {
              if (isDisabled || isReadOnly) return
              onChange(e.currentTarget.value)
            }}
            onFocus={(e) => {
              setIsFocused(true)
              inputProps.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              inputProps.onBlur?.(e)
            }}
            aria-invalid={state === 'error' ? true : undefined}
            aria-describedby={shouldShowHelper ? helperId : undefined}
            className={clsx(
              'w-full min-w-0 flex-1 bg-transparent text-sm outline-none sm:text-base',
              'overflow-hidden text-ellipsis whitespace-nowrap',
              locked ? 'text-gray-400' : 'text-black',
              placeholderVariant === 'a' ? 'placeholder-a' : 'placeholder-b'
            )}
          />

          {rightSlot && (
            <div className="flex shrink-0 items-center">{rightSlot}</div>
          )}
        </div>

        {shouldShowHelper && (
          <p
            id={helperId}
            className={clsx(
              'px-1 text-xs font-medium',
              state === 'error'
                ? 'text-red-500'
                : state === 'success'
                  ? 'text-green-600'
                  : 'text-gray-400'
            )}
          >
            {resolvedHelper}
          </p>
        )}
      </div>
    )
  }
)

CommonInput.displayName = 'CommonInput'
