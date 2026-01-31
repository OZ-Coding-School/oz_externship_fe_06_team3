// 입력+버튼+below 메시지 영역 공통 레이아웃 컴포넌트
import type { ReactNode } from 'react'

import cn from '@/lib/cn'

export type ActionRowProps = {
  left: ReactNode
  right: ReactNode
  below?: ReactNode
  className?: string
  rowClassName?: string
  belowClassName?: string
}

export function ActionRow({
  left,
  right,
  below,
  className,
  rowClassName,
  belowClassName,
}: ActionRowProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className={cn('flex min-w-0 items-start gap-3', rowClassName)}>
        <div className="min-w-0 flex-1">{left}</div>
        <div className="shrink-0">{right}</div>
      </div>
      {below != null ? (
        <div className={cn('px-1', belowClassName)}>{below}</div>
      ) : null}
    </div>
  )
}
