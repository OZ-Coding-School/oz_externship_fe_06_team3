import type { ButtonHTMLAttributes, ReactNode } from 'react'
/**
 * 기본 세팅값 2개
 * primary = 보라색 버튼
 * secondary = 회색버튼, active시 색 변경
 */
type ButtonBg = 'primary' | 'secondary'
/**
 * 버튼이 프롭스를 받을때 button태그가 받을 수 있는 모든 속성 적용
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bg?: ButtonBg
  children?: ReactNode
}
/*bg값 매핑 */
const BG_CLASS: Record<ButtonBg, string> = {
  primary: 'bg-[#6201E0] text-white hover:bg-[#4E01B3] active:bg-[#380186]',
  secondary:
    'bg-gray-200 text-gray-600  hover:bg-gray-300 active:bg-[#EFE6FC]  active:border-[#6201E0] active:text-[#6201E0]',
}
/**
 * 버튼 컴포넌트
 * 사용예시
 *
 * <Button bg="primary or secondary" className={~~~} onClick={~~~}>
 * 저장
 * </Button>
 */
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
