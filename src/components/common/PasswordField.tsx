import {
  useController,
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { PasswordInput } from "./PasswordInput";
import type { FieldState } from "./CommonInput";

type PasswordFieldProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof PasswordInput>,
  "value" | "onChange" | "name"
> & {
  name: Path<T>;
  rules?: RegisterOptions<T>;
  state?: FieldState;
};

export function PasswordField<T extends FieldValues>({
  name,
  rules,
  state = "default",
  helperTextByState,
  ...props
}: PasswordFieldProps<T>) {
  const { control } = useFormContext<T>();

  const {
    field,
    fieldState: { error },
  } = useController<T>({ name, control, rules });

  const fieldValue = String(field.value ?? "");
  const isEmpty = fieldValue.trim().length === 0;
  const resolvedState: FieldState = isEmpty ? "default" : state;

  return (
    <PasswordInput
      {...props}
      name={field.name}
      ref={field.ref}
      value={fieldValue}
      onChange={(v) => field.onChange(v)}
      onBlur={field.onBlur}
      state={resolvedState}
      helperTextByState={{
        ...helperTextByState,
        error: error?.message || helperTextByState?.error,
      }}
    />
  );
}
