// 라벨+children 래퍼 컴포넌트
import type { ReactNode } from 'react'

export function SectionLabel({ label }: { label: string }) {
  return (
    <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
      {label}
      <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
        *
      </span>
    </label>
  )
}

export function SectionBlock({
  label,
  rightText,
  className,
  children,
}: {
  label: string
  rightText?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-5 ${className ?? ''}`}>
      <div className="inline-flex items-center gap-4">
        <SectionLabel label={label} />
        {rightText ?? null}
      </div>
      {children}
    </div>
  )
}
