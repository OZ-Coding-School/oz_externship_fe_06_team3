import { cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import type { VariantProps } from 'class-variance-authority'
import cn from '@/lib/cn'

/**
 * 버튼 스타일 정의 (CVA)
 *
 * 기본 세팅값
 *
 * variant
 * - primary   : 보라색 버튼
 * - secondary : active 시 색상 변경
 * - disabled  : 비활성 전용 버튼
 *
 * size
 * 사이즈에 맞는걸로 사용해주세요
 */
export const buttonVariants = cva(
  /**
   * 공통 베이스 스타일
   */
  'inline-flex items-center justify-center border  transition-colors px-[20px] text-base',
  {
    variants: {
      /**
       * 버튼 색상 스타일
       */
      variant: {
        primary:
          'bg-[#6201E0] text-white border-transparent hover:bg-[#4E01B3] active:bg-[#380186]',
        secondary:
          'bg-[#EFE6FC] border border-[#6201E0] text-[#6201E0] hover:bg-[#e3cdff] active:bg-[#cdaaff]',
        disabled:
          'bg-gray-200 text-[#BDBDBD] border-transparent cursor-not-allowed pointer-events-none',
      },

      /**
       * 버튼 사이즈
       */
      size: {
        xs: 'w-[112px] h-[48px]',
        sm: 'w-[126px] h-[48px]',
        md: 'w-[168px] h-[48px]',
        lg: 'w-[348px] h-[52px]',
        xl: 'w-[480px] h-[52px]',
      },
      /**
       * 버튼 라운드 값
       */
      rounded: {
        default: 'rounded-[4px]',
        full: 'rounded-full',
      },
    },

    /**
     * 기본값 설정
     */
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'default',
    },
  }
)
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * 버튼 컴포넌트
 * 사용 예시
 * <Button
 *   variant="primary | ..."
 *   size="sm | md | ..."
 *   className={...}
 *   onClick={...}
 * >
 *   저장
 * </Button>
 *
 * disabled 스타일을 적용하려면
 * 반드시 variant="disabled"를 함께 사용해주세요.
 */
export function Button({
  variant,
  size,
  rounded,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant, size, rounded }), className)}
    />
  )
}
