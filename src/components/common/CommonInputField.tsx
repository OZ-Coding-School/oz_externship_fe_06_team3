import {
  useController,
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form'
import {
  CommonInput,
  type CommonInputProps,
  type FieldState,
} from './CommonInput'

type CommonInputFieldProps<T extends FieldValues> = Omit<
  CommonInputProps,
  'value' | 'onChange' | 'name'
> & {
  name: Path<T>
  rules?: RegisterOptions<T>
  state?: FieldState
  stateOverride?: FieldState
}

export function CommonInputField<T extends FieldValues>({
  name,
  rules,
  state = 'default',
  stateOverride,
  helperTextByState,
  ...props
}: CommonInputFieldProps<T>) {
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
      : state

  return (
    <CommonInput
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
