import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { arrowDownBlack, arrowDownGray, checkPurple } from '@/assets/icons'

/**
 * 드롭다운 옵션 항목
 * - label: 리스트에 표시되는 텍스트
 * - value: 선택을 위한 고유 값
 */
type DropdownOption = {
  label: string
  value: string
}

/**
 * 드롭다운 컴포넌트 props
 */
type DropdownProps = {
  /** 렌더링할 옵션 목록 */
  options: DropdownOption[]
  /** 현재 선택된 옵션 값 */
  value?: string
  /** 선택 전 표시할 안내 문구 */
  placeholder?: string
  /** 비활성화 여부 */
  disabled?: boolean
  /** 값이 선택될 때 호출 */
  onChange?: (value: string) => void
}

/**
 * 드롭다운 컴포넌트
 *
 * 사용 예시:
 * ```tsx
 * const [value, setValue] = useState<string | undefined>()
 *
 * <Dropdown
 *   options={[
 *     { label: '옵션 1', value: 'option-1' },
 *     { label: '옵션 2', value: 'option-2' },
 *   ]}
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
function Dropdown({
  options,
  value,
  placeholder = '해당되는 항목을 선택해 주세요.',
  disabled = false,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  )

  let textColor = '#BDBDBD'
  if (disabled) textColor = '#BDBDBD'
  if (!disabled && (selectedOption || isOpen)) textColor = '#000000'

  let iconSrc = arrowDownGray
  if (!disabled && (selectedOption || isOpen)) {
    iconSrc = arrowDownBlack
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleToggle = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  const handleSelect = (nextValue: string) => {
    if (disabled) return
    onChange?.(nextValue)
    setIsOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[288px] text-[14px]"
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          'flex h-[48px] w-full items-center justify-between px-[16px] py-[10px]',
          'border-mono-400 rounded-[4px] border bg-white',
          disabled ? 'bg-mono-200 cursor-not-allowed' : 'cursor-pointer'
        )}
        style={
          disabled
            ? { backgroundColor: '#ECECEC', borderColor: '#BDBDBD' }
            : undefined
        }
      >
        <span className="block truncate" style={{ color: textColor }}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="inline-flex items-center">
          <img
            src={iconSrc}
            alt=""
            className={clsx(
              'h-[8px] w-[14px] transition-transform duration-200 ease-out',
              isOpen ? 'rotate-180' : 'rotate-0'
            )}
          />
        </span>
      </button>

      <div
        className={clsx(
          'dropdown-scrollbar absolute top-[calc(100%+4px)] left-0 z-10 flex w-full flex-col gap-[5px] overflow-x-hidden overflow-y-auto',
          'border-mono-400 rounded-[4px] border bg-white py-[5px]',
          'origin-top transition-all duration-200 ease-out',
          isOpen
            ? 'max-h-[240px] scale-100 opacity-100'
            : 'pointer-events-none max-h-0 scale-95 opacity-0'
        )}
      >
        {options.map((option) => {
          const isSelected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={clsx(
                'mx-auto flex h-[48px] w-[calc(100%-10px)] items-center justify-between px-[11px] py-[10px]',
                'gap-[16px] text-left',
                'hover:bg-primary-100 rounded-[4px]',
                isSelected ? 'text-primary font-semibold' : 'text-black'
              )}
            >
              <span className="flex-1 truncate">{option.label}</span>
              {isSelected && (
                <img src={checkPurple} alt="" className="h-[11px] w-[13px]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Dropdown
