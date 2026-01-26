import { cva, type VariantProps } from 'class-variance-authority'

/**
 * 버튼 스타일 정의 (CVA)
 *
 * variant
 * - primary   : 보라색 버튼
 * - secondary : active 시 색상 변경
 * - disabled  : 비활성 전용 버튼
 * - kakao     : 카카오 로그인 버튼 (노란색)
 * - naver     : 네이버 로그인 버튼 (초록색)
 *
 * size: xxs, xs, sm, md, lg, xl, xxl
 * rounded: default, full
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center border transition-colors px-[20px] text-base',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white border-transparent hover:bg-primary-hover active:bg-primary-active',
        secondary:
          'bg-primary-100 border border-primary text-primary hover:bg-primary-200 active:bg-primary-300',
        disabled:
          'bg-gray-200 text-gray-400 border-transparent cursor-not-allowed pointer-events-none',
        kakao:
          'bg-[#fee500] text-[#391C1A] border-transparent hover:bg-[#fdd835] active:bg-[#fbc02d] transition-colors',
        naver:
          'bg-[#03c75a] text-white border-transparent hover:bg-[#02b350] active:bg-[#029f47] transition-colors',
      },
      size: {
        xxs: 'w-[78px] h-[42px]',
        xs: 'w-[92px] h-[64px]',
        sm: 'w-[112px] h-[48px]',
        md: 'w-[126px] h-[48px]',
        lg: 'w-[168px] h-[48px]',
        xl: 'w-[348px] h-[52px]',
        xxl: 'w-[480px] h-[52px]',
      },
      rounded: {
        default: 'rounded-[4px]',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      rounded: 'default',
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
