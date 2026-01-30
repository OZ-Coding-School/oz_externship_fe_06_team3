import type { ButtonHTMLAttributes } from 'react'

import cn from '@/lib/cn'

import { buttonVariants, type ButtonVariantProps } from './buttonVariants'

export type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps

/**
 * 버튼 컴포넌트
 *
 * 사용 예: <Button variant="primary" size="sm">저장</Button>
 * disabled 스타일은 variant="disabled"와 함께 사용.
 */
export function Button({
  variant,
  size,
  rounded,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || variant === 'disabled')

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, rounded }), className)}
    >
      {children}
    </button>
  )
}
