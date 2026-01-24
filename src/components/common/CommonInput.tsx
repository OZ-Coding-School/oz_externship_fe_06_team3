import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type InputHTMLAttributes,
} from "react";
import clsx from "clsx";

export type FieldState = "default" | "error" | "success";
export type HelperVisibility = "always" | "focus" | "never";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "className"
>;

export interface CommonInputProps extends NativeInputProps {
  value: string;
  onChange: (value: string) => void;
  state?: FieldState;
  locked?: boolean;
  width?: number | string;
  rightSlot?: React.ReactNode;
  inputClassName?: string;

  helperText?: React.ReactNode;
  helperTextByState?: Partial<Record<FieldState, React.ReactNode>>;
  helperVisibility?: HelperVisibility;
  persistHelperOnBlurWhenFilled?: boolean;
}

export const CommonInput = forwardRef<HTMLInputElement, CommonInputProps>(
  (
    {
      value,
      onChange,
      state = "default",
      locked = false,
      width,
      rightSlot,
      inputClassName,
      helperText,
      helperTextByState,
      helperVisibility = "never",
      persistHelperOnBlurWhenFilled = true,
      id,
      disabled,
      readOnly,
      ...inputProps
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `input-${autoId}`;

    const [isFocused, setIsFocused] = useState(false);

    const isReadOnly = locked || !!readOnly;
    const isDisabled = !!disabled;

    const hasValue = String(value ?? "").trim().length > 0;

    const resolvedHelper = useMemo(() => {
      return helperTextByState?.[state] ?? helperText ?? null;
    }, [helperTextByState, helperText, state]);

    const helperId = useMemo(() => {
      return resolvedHelper ? `${inputId}-helper` : undefined;
    }, [inputId, resolvedHelper]);

    const shouldShowHelper = useMemo(() => {
      if (!resolvedHelper) return false;
      if (helperVisibility === "never") return false;

      if (state === "error" || state === "success") return true;

      if (helperVisibility === "always") return true;
      if (isFocused) return true;
      if (persistHelperOnBlurWhenFilled && hasValue) return true;

      return false;
    }, [
      resolvedHelper,
      helperVisibility,
      state,
      isFocused,
      persistHelperOnBlurWhenFilled,
      hasValue,
    ]);

    return (
      <div
        className="flex flex-col gap-1.5"
        style={{ width: typeof width === "number" ? `${width}px` : width }}
      >
        <div
          className={clsx(
            "flex items-center rounded-lg border px-4 gap-2.5 h-12 transition-colors duration-200",
            state === "default" &&
              "border-gray-300 bg-white focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600",
            state === "error" &&
              "border-red-500 bg-white focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600",
            state === "success" &&
              "border-green-500 bg-white focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600",
            locked && "bg-gray-100 border-gray-200",
            isDisabled && "opacity-60 cursor-not-allowed"
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
              if (isDisabled || isReadOnly) return;
              onChange(e.currentTarget.value);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              inputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              inputProps.onBlur?.(e);
            }}
            aria-invalid={state === "error" ? true : undefined}
            aria-describedby={shouldShowHelper ? helperId : undefined}
            className={clsx(
              "flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400",
              locked ? "text-gray-500" : "text-black",
              inputClassName
            )}
          />

          {rightSlot && (
            <div className="shrink-0 flex items-center">{rightSlot}</div>
          )}
        </div>

        {shouldShowHelper && (
          <p
            id={helperId}
            className={clsx(
              "text-xs font-medium px-1",
              state === "error"
                ? "text-red-500"
                : state === "success"
                ? "text-green-600"
                : "text-gray-400"
            )}
          >
            {resolvedHelper}
          </p>
        )}
      </div>
    );
  }
);

CommonInput.displayName = "CommonInput";
