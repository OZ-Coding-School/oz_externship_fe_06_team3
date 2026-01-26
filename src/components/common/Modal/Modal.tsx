import { createContext, useContext, type ReactNode, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import cn from '@/lib/cn'

interface ModalContextValue {
  onClose?: () => void
}
//
const ModalContext = createContext<ModalContextValue>({})
//
export const useModalContext = () => useContext(ModalContext)

// 모달 스택 관리
let modalStack: string[] = []
let modalIdCounter = 0

const generateModalId = () => `modal-${++modalIdCounter}`

const addToStack = (id: string) => {
  modalStack = [...modalStack.filter(m => m !== id), id]
}

const removeFromStack = (id: string) => {
  modalStack = modalStack.filter(m => m !== id)
}

const getTopModalId = () => {
  return modalStack.length > 0 ? modalStack[modalStack.length - 1] : null
}

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
  toast?: ReactNode
  toastPosition?: 'top' | 'center' | 'top-far'
  useBackdropV2?: boolean
}

// 모달 컴포넌트 props 타입
export function Modal({
  isOpen,
  onClose,
  children,
  className,
  toast,
  toastPosition = 'top',
  useBackdropV2 = false,
}: ModalProps) {
  const modalRoot = useRef<HTMLElement | null>(null)
  const modalIdRef = useRef<string>(generateModalId())
  useEffect(() => {
    modalRoot.current = document.getElementById('modal-root')
  }, [])

  const [isTopModal, setIsTopModal] = useState(isOpen)

  // 모달 스택 관리
  useEffect(() => {
    if (isOpen) {
      addToStack(modalIdRef.current)
      // 스택에 추가한 후 즉시 top 모달인지 확인
      const checkTop = () => {
        setIsTopModal(getTopModalId() === modalIdRef.current)
      }
      // 즉시 확인
      checkTop()
      // 다음 프레임에서도 확인 (다른 모달과의 경쟁 상황 대비)
      requestAnimationFrame(checkTop)
    } else {
      removeFromStack(modalIdRef.current)
      setIsTopModal(false)
    }
  }, [isOpen])

  // 다른 모달의 상태 변경 감지를 위한 체크
  useEffect(() => {
    if (isOpen) {
      const checkTopModal = () => {
        setIsTopModal(getTopModalId() === modalIdRef.current)
      }
      // 짧은 간격으로 체크
      const interval = setInterval(checkTopModal, 100)
      return () => clearInterval(interval)
    }
  }, [isOpen])


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!modalRoot.current) return null

  // 맨 위 모달이 아니면 backdrop처럼 처리
  if (isOpen && !isTopModal) {
    return createPortal(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50"
        style={{ zIndex: 50 + modalStack.indexOf(modalIdRef.current) }}
      />,
      modalRoot.current
    )
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && isTopModal && (
        <>
          {/* Backdrop V1 - 기본 전체 화면 오버레이 */}
          {!useBackdropV2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50"
              style={{ zIndex: 50 + modalStack.length - 1 }}
              onClick={onClose}
            />
          )}
          {/* Backdrop V2 - 토스트 알림창 영역( 정 가운데 영역 396px × 128px, Radius:12px)을 제외한 오버레이 */}
          {useBackdropV2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50"
              style={{ 
                zIndex: 50 + modalStack.length - 1,
                pointerEvents: 'none',
                clipPath: `polygon(
                  0% 0%,
                  0% 100%,
                  calc(50% - 198px) 100%,
                  calc(50% - 198px) calc(50% - 64px),
                  calc(50% + 198px) calc(50% - 64px),
                  calc(50% + 198px) calc(50% + 64px),
                  calc(50% - 198px) calc(50% + 64px),
                  calc(50% - 198px) 100%,
                  100% 100%,
                  100% 0%
                )`,
              }}
            />
          )}
          {/* 토스트 알림창 (useBackdropV2가 true일 때 맨 앞에 표시, e.stopPropagation() 적용) */}
          {useBackdropV2 && toast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{ zIndex: 50 + modalStack.length + 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  'fixed left-1/2 transform -translate-x-1/2',
                  toastPosition === 'top'
                    ? 'top-1/2 -translate-y-[calc(50%+20px)]'
                    : toastPosition === 'top-far'
                    ? 'top-1/2 -translate-y-[calc(50%+270px)]'
                    : 'top-1/2 -translate-y-1/2'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {toast}
              </div>
            </motion.div>
          )}
          {/* Modal Content - 항상 표시, useBackdropV2가 true일 때는 뒤에 배치 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ 
              zIndex: useBackdropV2 ? 50 + modalStack.length - 1 : 50 + modalStack.length 
            }}
          >
            {/* 토스트 알림창 (일반 모달 내부) */}
            {!useBackdropV2 && toast && (
              <div
                className={cn(
                  'fixed left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none',
                  toastPosition === 'top'
                    ? 'top-1/2 -translate-y-[calc(50%+20px)]'
                    : toastPosition === 'top-far'
                    ? 'top-1/2 -translate-y-[calc(50%+270px)]'
                    : 'top-1/2 -translate-y-1/2'
                )}
              >
                {toast}
              </div>
            )}
            <div className="relative">
              {/* useBackdropV2가 true일 때 모달 본체 위에 backdrop overlay */}
              {useBackdropV2 && (
                <div
                  className="absolute inset-0 bg-black/50 rounded-lg"
                  style={{ zIndex: 1 }}
                />
              )}
              <div
                className={cn(
                  'bg-white rounded-lg shadow-xl w-auto max-h-[90vh] overflow-y-auto',
                  className
                )}
                style={{ position: 'relative', zIndex: useBackdropV2 ? 0 : 'auto' }}
              >
                <ModalContext.Provider value={{ onClose }}>
                  {children}
                </ModalContext.Provider>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    modalRoot.current
  )
}

/**
 * Modal Header Component
 */
interface ModalHeaderProps {
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}

Modal.Header = function ModalHeader({
  children,
  className,
  showCloseButton = true,
}: ModalHeaderProps) {
  const { onClose } = useModalContext()

  return (
    <div
      className={cn(
        'flex flex-col p-6 bg-white',
        className
      )}
    >
      {/* 닫기 버튼 - 첫 번째 줄 우측 상단 */}
      {showCloseButton && onClose && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="닫기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#9D9D9D"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {/* 내용 - 두 번째 줄 (이미지, 제목 등) */}
      <div className="flex-1 flex flex-col items-center text-center">{children}</div>
    </div>
  )
}

/**
 * Modal Body Component
 */
interface ModalBodyProps {
  children: ReactNode
  className?: string
}

Modal.Body = function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('p-6 bg-white', className)}>
      {children}
    </div>
  )
}

/**
 * Modal Footer Component
 */
interface ModalFooterProps {
  children: ReactNode
  className?: string
}

Modal.Footer = function ModalFooter({
  children,
  className,
}: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 p-6 border-t border-gray-200',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Modal Input Row Component
 * 라벨과 입력 필드를 함께 표시하는 행 컴포넌트
 */
interface ModalInputRowProps {
  label: string | ReactNode
  required?: boolean
  children: ReactNode
  className?: string
  labelClassName?: string
}

Modal.InputRow = function ModalInputRow({
  label,
  required = false,
  children,
  className,
  labelClassName,
}: ModalInputRowProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className={cn('label-common flex items-center gap-2', labelClassName)}>
        {typeof label === 'string' ? (
          <>
            {label}
            {required && <span className="text-red-500">*</span>}
          </>
        ) : (
          label
        )}
        {typeof label !== 'string' && required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

/**
 * Modal Toast Component
 * 모달 상단에 표시되는 토스트 메시지
 */
interface ModalToastProps {
  message: string
  isVisible: boolean
  type?: 'success' | 'error' | 'info'
  className?: string
}

Modal.Toast = function ModalToast({
  message,
  isVisible,
  type = 'success',
  className,
}: ModalToastProps) {
  const bgColorMap = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'mx-6 mt-6 p-4 rounded-lg border',
        bgColorMap[type],
        className
      )}
    >
      {message}
    </motion.div>
  )
}
