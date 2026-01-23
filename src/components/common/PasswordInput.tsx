import { forwardRef, useMemo, useState } from "react";
import {
  CommonInput,
  type CommonInputProps,
  type FieldState,
  type HelperVisibility,
} from "./CommonInput";

const DEFAULT_HELPER = "* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합";
const ERROR_HELPER = "* 비밀번호가 올바르지 않습니다.";
const SUCCESS_HELPER = "* 비밀번호가 확인되었습니다.";

type PasswordInputProps = Omit<
  CommonInputProps,
  "type" | "rightSlot" | "helperText" | "helperTextByState" | "helperVisibility"
> & {
  state?: FieldState;
  showDefaultHelper?: boolean;
  helperTextByState?: Partial<Record<FieldState, React.ReactNode>>;
  helperVisibility?: HelperVisibility;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      state = "default",
      locked = false,
      disabled,
      showDefaultHelper = false,
      helperTextByState,
      helperVisibility,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = useState(false);

    const mergedHelpers = useMemo(() => {
      return {
        default: showDefaultHelper ? DEFAULT_HELPER : null,
        error: ERROR_HELPER,
        success: SUCCESS_HELPER,
        ...helperTextByState,
      };
    }, [helperTextByState, showDefaultHelper]);

    const resolvedVisibility: HelperVisibility =
      helperVisibility ?? (showDefaultHelper ? "focus" : "never");

    return (
      <CommonInput
        {...props}
        ref={ref}
        type={show ? "text" : "password"}
        autoComplete="current-password"
        state={state}
        locked={locked}
        disabled={disabled}
        helperTextByState={mergedHelpers}
        helperVisibility={resolvedVisibility}
        rightSlot={
          <div className="flex items-center gap-2">
            {state === "success" && (
              <img src="/icons/correct.svg" alt="검증 완료" className="w-4 h-4" />
            )}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShow((p) => !p)}
              disabled={!!disabled || locked}
              aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
              className="p-1 -mr-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:text-violet-600"
            >
              <img src={show ? "/icons/eyeOpen.svg" : "/icons/eyeClose.svg"} alt="" className="w-5 h-5" />
            </button>
          </div>
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
