import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../Modal'
import { Button } from '../../Button'
import {
  registerStudentSchema,
  type RegisterStudentFormData,
} from '@/schemas/modalSchemas'
import clsx from 'clsx'

interface RegisterStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: RegisterStudentFormData) => void
}

// Mock 데이터 , 나중에 API에서 가져올 데이터 구조
type CourseData = {
  id: string
  name: string
  batches: number[] 
}
// 과정 목록
const mockCourses: CourseData[] = [
  {
    id: 'frontend-bootcamp',
    name: '개발 초격차 프론트엔드 부트캠프',
    batches: Array.from({ length: 12 }, (_, i) => i + 1), // 1~12기
  },
  {
    id: 'backend-bootcamp',
    name: '웹 개발 초격차 백엔드 부트캠프',
    batches: Array.from({ length: 12 }, (_, i) => i + 1), // 1~12기
  },
  {
    id: 'bd-bootcamp',
    name: 'IT 스타트업 실무형 사업 개발자(BD) 부트캠프',
    batches: Array.from({ length: 11 }, (_, i) => i + 1), // 1~11기
  },
  {
    id: 'product-designer',
    name: '스타트업 맞춤형 프로덕트 디자이너',
    batches: Array.from({ length: 3 }, (_, i) => i + 1), // 1~3기
  },
  {
    id: 'fullstack-bootcamp',
    name: 'IT스타트업 실무형 풀스택 웹 개발 부트캠프 (React + Node.js)',
    batches: Array.from({ length: 2 }, (_, i) => i + 1), // 1~2기
  },
]

const courseOptions = mockCourses.map((course) => ({
  label: course.name,
  value: course.id,
}))

type ModalDropdownOption = {
  label: string
  value: string
}

type ModalDropdownProps = {
  options: ModalDropdownOption[]
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

function ModalDropdown({
  options,
  value,
  placeholder = '해당되는 항목을 선택해 주세요.',
  disabled = false,
  onChange,
}: ModalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dropdownListRef = useRef<HTMLDivElement | null>(null)
  const modalRootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    modalRootRef.current = document.getElementById('modal-root')
  }, [])

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  )

  let textColor = '#BDBDBD'
  if (disabled) textColor = '#BDBDBD'
  else if (selectedOption) textColor = '#000000'
  else if (isOpen) textColor = '#000000'

  let iconSrc = '/icons/arrow_down_gray.svg'
  if (!disabled && (selectedOption || isOpen)) {
    iconSrc = '/icons/arrow_down_black.svg'
  }
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        !containerRef.current?.contains(target) &&
        !dropdownListRef.current?.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  const handleToggle = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  const handleSelect = (nextValue: string, event: React.MouseEvent) => {
    if (disabled) return
    event.stopPropagation()
    onChange?.(nextValue)
    setIsOpen(false)
  }

  const itemCount = options.length
  const maxVisibleItems = 4
  const visibleItems = Math.min(itemCount, maxVisibleItems)
  const calculatedHeight =
    visibleItems > 0
      ? visibleItems * 48 + (visibleItems - 1) * 5 + 10 // 항목 높이 + gap + padding
      : 0

  const dropdownListStyle =
    isOpen && containerRef.current
      ? {
          top: `${containerRef.current.getBoundingClientRect().bottom + 4}px`,
          left: `${containerRef.current.getBoundingClientRect().left}px`,
          width: `${containerRef.current.getBoundingClientRect().width}px`,
          height: `${calculatedHeight}px`,
        }
      : undefined

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full text-[14px]"
        style={{ minWidth: '348px' }}
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
            {selectedOption ? selectedOption.label : placeholder}
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
      </div>
      {/* 드롭다운 리스트를 모달 외부에 포털로 렌더링 */}
      {isOpen &&
        modalRootRef.current &&
        createPortal(
          <div
            ref={dropdownListRef}
            className={clsx(
              'dropdown-scrollbar fixed z-[60] flex flex-col gap-[5px] overflow-x-hidden overflow-y-auto',
              'border-mono-400 rounded-[4px] border bg-white py-[5px]',
              'origin-top transition-all duration-200 ease-out',
              'scale-100 opacity-100'
            )}
            style={dropdownListStyle}
          >
            {options.map((option) => {
              const isSelected = String(option.value) === String(value) && value !== undefined && value !== ''
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => handleSelect(option.value, e)}
                  className={clsx(
                    'mx-auto flex h-[48px] w-[calc(100%-10px)] items-center justify-between px-[11px] py-[10px]',
                    'gap-[16px] text-left font-normal rounded-[4px]',
                    isSelected
                      ? 'bg-white'
                      : 'bg-white hover:bg-[#EFE6FC]'
                  )}
                  style={{
                    color: isSelected ? '#6201E0' : '#4D4D4D',
                  }}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {isSelected && (
                    <svg
                      width="13"
                      height="11"
                      viewBox="0 0 13 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5.5L4.5 9L12 1"
                        stroke="#6201E0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>,
          modalRootRef.current
        )}
    </>
  )
}

export function RegisterStudentModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterStudentModalProps) {
  const methods = useForm<RegisterStudentFormData>({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: {
      course: '',
      batch: '',
    },
  })

  const courseValue = methods.watch('course')
  const batchValue = methods.watch('batch')

  // 선택된 과정에 해당하는 기수 옵션 필터링
  const selectedCourse = mockCourses.find((course) => course.id === courseValue)
  const batchOptions = selectedCourse
    ? selectedCourse.batches.map((batch) => ({
        label: `${batch}기`,
        value: `${batch}`,
      }))
    : []

  // 과정이 변경되면 기수 선택 초기화
  useEffect(() => {
    if (courseValue && batchValue) {
      const selectedCourseData = mockCourses.find(
        (course) => course.id === courseValue
      )
      if (
        selectedCourseData &&
        !selectedCourseData.batches.includes(Number(batchValue))
      ) {
        methods.setValue('batch', '')
      }
    } else if (!courseValue) {
      methods.setValue('batch', '')
    }
  }, [courseValue, batchValue, methods])

  const onSubmit = (data: RegisterStudentFormData) => {
    onSuccess?.(data)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/icons/RegisterStudent.svg" 
            alt="내 과정 선택하기" 
            style={{ width: '35px', height: '25px' }}
          />
          <h2 className="title-l-b">내 과정 선택하기</h2>
          <p 
            className="text-center"
            style={{ 
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#4D4D4D'
            }}
          >
            해당하는 과정과 기수를 선택해 주세요.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <Modal.InputRow label="">
              <ModalDropdown
                options={courseOptions}
                value={courseValue}
                onChange={(value) => methods.setValue('course', value)}
                placeholder="과정을 선택해주세요"
              />
              {methods.formState.errors.course && (
                <p className="text-sm text-red-500 mt-1">
                  {methods.formState.errors.course.message}
                </p>
              )}
            </Modal.InputRow>

            <Modal.InputRow label="">
              <ModalDropdown
                options={batchOptions}
                value={batchValue}
                onChange={(value) => methods.setValue('batch', value)}
                placeholder="기수를 선택해주세요"
                disabled={!courseValue}
              />
              {methods.formState.errors.batch && (
                <p className="text-sm text-red-500 mt-1">
                  {methods.formState.errors.batch.message}
                </p>
              )}
            </Modal.InputRow>

            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="xl" 
                className="w-full"
                style={{ minWidth: '348px' }}
              >
                등록하기
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
