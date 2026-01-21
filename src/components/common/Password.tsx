import { useState, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import eyeOpen from "@/assets/icons/eyeOpen.svg";
import eyeClose from "@/assets/icons/eyeClose.svg";

type FieldState = "default" | "error" | "success";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
>;

const WIDTH_CLASS = {
  sm: "w-[288px]",
  md: "w-[348px]",
  lg: "w-[533px]",
} as const;

type WidthVariant = keyof typeof WIDTH_CLASS;

interface PasswordProps extends NativeInputProps {
  value: string;
  onChange: (value: string) => void;

  state?: FieldState;
  width?: WidthVariant;
}

const DEFAULT_HELPER =
  "* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합";
const ERROR_HELPER = "* 비밀번호가 일치하지 않습니다.";
const SUCCESS_HELPER = "* 비밀번호가 일치합니다.";

export function Password({
  value,
  onChange,
  state = "default",
  width = "sm",
  disabled,
  ...inputProps
}: PasswordProps) {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const helperText: string | null =
    state === "error"
      ? ERROR_HELPER
      : state === "success"
      ? SUCCESS_HELPER
      : isFocused || touched
      ? DEFAULT_HELPER
      : null;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={clsx(
          "flex items-center rounded-md border bg-white px-4 gap-2.5 h-12 transition-colors",
          WIDTH_CLASS[width],
          state === "default" && "focus-within:border-black",
          {
            "border-gray-300": state === "default",
            "border-red-500 focus-within:border-red-600": state === "error",
            "border-green-500 focus-within:border-green-600": state === "success",
            "opacity-50 cursor-not-allowed": disabled,
          }
        )}
      >
        <input
          {...inputProps}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          disabled={disabled}
          onFocus={() => {
            setIsFocused(true);
            setTouched(true);
          }}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent outline-none placeholder-gray-500"
        />

        <button
          type="button"
          onClick={() => {
            setShow((p) => !p);
            setTouched(true);
          }}
          disabled={disabled}
          className="text-gray-500 hover:text-black"
        >
          {show ? <img src={eyeOpen} alt="eye-open" className="w-5 h-5" /> : <img src={eyeClose} alt="eye-close" className="w-5 h-5" />}
        </button>
      </div>

      {helperText && (
        <p
          className={clsx("text-xs", {
            "text-gray-500": state === "default",
            "text-red-500": state === "error",
            "text-green-600": state === "success",
          })}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
