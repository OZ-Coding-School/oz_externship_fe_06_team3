import { type InputHTMLAttributes } from "react";
import clsx from "clsx";

export type FieldState = "default" | "error" | "success";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
>;

export interface CommonInputProps extends NativeInputProps {
  value: string;
  onChange: (value: string) => void;

  type?: React.HTMLInputTypeAttribute;
  state?: FieldState;
  helperText?: React.ReactNode;

  locked?: boolean;

  width?: number | string;

  rightSlot?: React.ReactNode;
}

export function CommonInput({
  value,
  onChange,
  type = "text",
  state = "default",
  helperText,
  locked = false,
  width,
  rightSlot,
  ...inputProps
}: CommonInputProps) {
  const readOnly = locked || inputProps.readOnly;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (readOnly) return;
    onChange(e.currentTarget.value);
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={clsx(
          "flex items-center rounded-md border px-4 gap-2.5 h-12 transition-colors",
          state === "default" &&
            "border-gray-300 bg-white focus-within:border-violet-600",
          state === "error" &&
            "border-red-500 bg-white focus-within:border-red-600",
          state === "success" &&
            "border-green-500 bg-white focus-within:border-green-600",
          locked && "bg-gray-100 border-gray-200"
        )}
        // width는 자유롭게 (숫자 px)
        style={{
          width: typeof width === "number" ? `${width}px` : width,
        }}
      >
        <input
          {...inputProps}
          type={type}
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          className={clsx(
            "flex-1 bg-transparent outline-none placeholder-gray-400",
            locked ? "text-gray-400" : "text-black"
          )}
        />

        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
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

// 사용예시(이메일)
{/* <CommonInput
  type="email"
  width={348}
  value={email}
  onChange={setEmail}
  placeholder="example@gmail.com"
  state="default"
  helperText="* 이메일 형식으로 입력해주세요."
  rightSlot={<button className="text-sm text-violet-600">중복확인</button>}
/> */}
