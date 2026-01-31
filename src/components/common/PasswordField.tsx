import {
  useController,
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form'
import { PasswordInput } from './PasswordInput'
import type { FieldState } from './CommonInput'

type PasswordFieldProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof PasswordInput>,
  'value' | 'onChange' | 'name'
> & {
  name: Path<T>
  rules?: RegisterOptions<T>
  state?: FieldState
  autoState?: boolean
  stateOverride?: FieldState
}

export function PasswordField<T extends FieldValues>({
  name,
  rules,
  state = 'default',
  autoState = false,
  stateOverride,
  helperTextByState,
  ...props
}: PasswordFieldProps<T>) {
  const { control } = useFormContext<T>()

  const {
    field,
    fieldState: { error },
  } = useController<T>({ name, control, rules })

  const fieldValue = String(field.value ?? '')
  const isEmpty = fieldValue.trim().length === 0

  const resolvedState: FieldState = error
    ? 'error'
    : isEmpty
      ? 'default'
      : autoState
        ? 'success'
        : state

  return (
    <PasswordInput
      {...props}
      name={field.name}
      ref={field.ref}
      value={fieldValue}
      onChange={(v) => field.onChange(v)}
      onBlur={field.onBlur}
      state={stateOverride ?? resolvedState}
      helperTextByState={{
        ...helperTextByState,
        error: error?.message || helperTextByState?.error,
      }}
    />
  )
}
