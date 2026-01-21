import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonBg = 'primary' | 'secondary'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bg?: ButtonBg
  children?: ReactNode
}

const BG_CLASS: Record<ButtonBg, string> = {
  primary: 'bg-[#6201E0] text-white hover:bg-[#4E01B3] active:bg-[#380186]',
  secondary:
    'bg-gray-200 text-gray-600  hover:bg-gray-300 active:bg-[#EFE6FC]  active:border-[#6201E0] active:text-[#6201E0]',
}

export function Button({
  bg = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex h-[48px] w-[112px] items-center justify-center rounded-[4px] border border-transparent transition-colors ${BG_CLASS[bg]} ${className} `}
    >
      {children}
    </button>
  )
}
