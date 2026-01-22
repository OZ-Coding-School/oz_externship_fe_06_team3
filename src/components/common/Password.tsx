import { useMemo, useState } from "react";
import eyeOpen from "@/assets/icons/eyeOpen.svg";
import eyeClose from "@/assets/icons/eyeClose.svg";
import { CommonInput, type CommonInputProps, type FieldState } from "./CommonInput";

const DEFAULT_HELPER = "* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합";
const ERROR_HELPER = "* 비밀번호가 일치하지 않습니다.";
const SUCCESS_HELPER = "* 비밀번호가 일치합니다.";

type PasswordProps = Omit<CommonInputProps, "type" | "rightSlot" | "helperText"> & {
  state?: FieldState;
};

export function Password({
  state = "default",
  value,
  onChange,
  locked = false,
  width,
  ...inputProps
}: PasswordProps) {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const helperText = useMemo(() => {
    if (state === "error") return ERROR_HELPER;
    if (state === "success") return SUCCESS_HELPER;
    return isFocused ? DEFAULT_HELPER : null;
  }, [state, isFocused]);

  const rightSlot = (
    <button
      type="button"
      onClick={() => setShow((p) => !p)}
      disabled={inputProps.disabled || locked}
      className="flex items-center justify-center text-gray-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
    >
      <img
        src={show ? eyeOpen : eyeClose}
        alt=""
        className="w-5 h-5"
      />
    </button>
  );

  return (
    <CommonInput
      {...inputProps}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      state={state}
      helperText={helperText}
      rightSlot={rightSlot}
      locked={locked}
      width={width}
      onFocus={(e) => {
        setIsFocused(true);
        inputProps.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        inputProps.onBlur?.(e);
      }}
    />
  );
}
