import { Modal } from '../Modal'
import { Button } from '../../Button'

interface WithdrawnMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onRestoreAccount?: () => void
}

export function WithdrawnMemberModal({
  isOpen,
  onClose,
  onRestoreAccount,
}: WithdrawnMemberModalProps) {
  const handleRestoreAccount = () => {
    onClose()
    onRestoreAccount?.()
  }
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="min-w-[396px] min-h-[278px]"
    >
      <Modal.Header>
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/icons/WithdrawnMember.svg" 
            alt="탈퇴회원 안내" 
            style={{ width: '35px', height: '35px' }}
          />
          <h2 
            className="font-bold"
            style={{ 
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#121212'
            }}
          >
            해당 계정은 탈퇴된 상태예요
          </h2>
          <p 
            className="text-center font-normal"
            style={{ 
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#4D4D4D',
              whiteSpace: 'pre-line'
            }}
          >
            {`2025년 6월 20일 이후, 계정 정보는 완전히 삭제돼요.
계정을 다시 사용하려면 아래 버튼을 눌러 복구를 진행해주세요.`}
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-6">
          <div className="pt-4">
            <Button 
              variant="primary" 
              size="xl" 
              className="w-full"
              onClick={handleRestoreAccount}
            >
              계정 다시 사용하기
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
