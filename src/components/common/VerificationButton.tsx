import { type ReactNode } from 'react'
import cn from '@/lib/cn'

interface VerificationButtonProps {
  onClick: () => void
  disabled: boolean
  isLoading?: boolean
  children: ReactNode
  className?: string
}

export function VerificationButton({
  onClick,
  disabled,
  isLoading = false,
  children,
  className,
}: VerificationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'w-[112px] h-[48px] rounded-[4px] border text-black text-base',
        'hover:bg-gray-200 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center justify-center',
        className
      )}
      style={{
        backgroundColor: '#ececec',
        borderColor: '#bdbdbd',
        borderWidth: '1px',
      }}
    >
      {isLoading ? (
        <span className="text-sm">전송 중...</span>
      ) : (
        children
      )}
    </button>
  )
}
