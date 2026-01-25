import { Link } from 'react-router'
import { Modal } from '../Modal'
import cn from '@/lib/cn'

interface FindIdResultModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onFindPasswordClick?: () => void
}

export function FindIdResultModal({
  isOpen,
  onClose,
  email,
  onFindPasswordClick,
}: FindIdResultModalProps) {
  const handleFindPasswordClick = () => {
    onClose()
    onFindPasswordClick?.()
  }
  // 이메일 마스킹 처리: 뒤에 4글자는 보여지고 그 바로 앞에 4글자를 ****로 처리
  const maskEmail = (email: string) => {
    if (email.length <= 4) return email

    // 뒤에 4글자는 보여지고 그 바로 앞에 4글자를 ****로 처리
    const last4 = email.slice(-4) // 뒤 4글자
    const beforeLast4 = email.slice(0, -4) // 나머지 부분

    if (beforeLast4.length <= 4) {
      // 앞 부분이 4글자 이하면 모두 ****로 처리
      return `${'*'.repeat(beforeLast4.length)}${last4}`
    }

    // 앞 부분에서 뒤 4글자를 제외한 나머지 + **** + 뒤 4글자
    const frontPart = beforeLast4.slice(0, -4)
    return `${frontPart}****${last4}`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/icons/FindId.svg" 
            alt="아이디 찾기" 
            style={{ width: '35px', height: '35px' }}
          />
          <h2 className="title-l-b">아이디 찾기</h2>
          <p className="text-[14px] text-[#121212] font-normal text-center">
            입력하신 정보와 일치하는 아이디입니다.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col items-center gap-6">
          {/* 이메일 박스 */}
          <div
            className={cn(
              'w-full min-w-[348px] max-w-[348px] rounded-[4px] border',
              'bg-[#ececec] border-[#bdbdbd]'
            )}
            style={{
              paddingTop: '40px',
              paddingRight: '16px',
              paddingBottom: '40px',
              paddingLeft: '16px',
              borderWidth: '1px',
            }}
          >
            <p
              className="text-center"
              style={{
                fontSize: '18px',
                fontWeight: 600, // SemiBold
                color: '#121212',
              }}
            >
              {maskEmail(email)}
            </p>
          </div>

          {/* 버튼들 - 한 줄에 나란히 */}
          <div className="flex gap-3 w-full max-w-[348px]">
            <Link to="/" className="flex-1">
              <button
                className={cn(
                  'w-full max-w-[168px] h-[48px] rounded-[4px] border',
                  'bg-white border-[#6201E0] text-[#6201E0]',
                  'hover:bg-gray-50 transition-colors'
                )}
                style={{
                  fontSize: '16px',
                  fontWeight: 600, // SemiBold
                }}
              >
                로그인
              </button>
            </Link>
            <button
              onClick={handleFindPasswordClick}
              className={cn(
                'w-full max-w-[168px] h-[48px] rounded-[4px] border border-transparent',
                'bg-[#6201E0] text-[#FAFAFA]',
                'hover:bg-[#4E01B3] transition-colors'
              )}
              style={{
                fontSize: '16px',
                fontWeight: 600, // SemiBold
              }}
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
