import { Modal } from '../Modal'
import { Button } from '../../Button'

interface CheatingWarningModalProps {
  isOpen: boolean
  onClose: () => void
  warningLevel: 1 | 2 | 3
  onConfirm?: () => void
  onTerminate?: () => void // 3회 시 시험 종료 콜백
}

export function CheatingWarningModal({
  isOpen,
  onClose,
  warningLevel,
  onConfirm,
  onTerminate,
}: CheatingWarningModalProps) {
  const isThirdWarning = warningLevel === 3

  // 제목 텍스트 생성,횟수 부분만 색상 적용,목데이터는 1회, 2회, 3회 반환
  const renderTitle = () => {
    const countText = `${warningLevel}회`
    const countColor = isThirdWarning ? '#EC0037' : '#FFAE00'
    
    return (
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '600', // SemiBold
          color: '#121212',
          textAlign: 'center',
        }}
      >
        부정행위{' '}
        <span style={{ color: countColor }}>{countText}</span>
        {' '}감지
      </h2>
    )
  }

  // 부제목 텍스트 생성
  const renderSubtitle = () => {
    const message = isThirdWarning
      ? '세 번째 이탈이 감지됐어요.\n부정행위로 처리되어 시험이 종료됩니다.'
      : '다른 화면으로 이동했어요.\n부정행위로 간주되며, 누적 시 시험이 종료될 수 있어요.'

    return (
      <p
        style={{
          fontSize: '14px',
          fontWeight: 'normal', // Regular
          color: '#303030',
          textAlign: 'center',
          whiteSpace: 'pre-line',
        }}
      >
        {message}
      </p>
    )
  }

  const handleButtonClick = () => {
    if (isThirdWarning) {
      // 3회 시 시험 종료
      onTerminate?.()
      onClose()
    } else {
      // 1회, 2회 시 창 닫기
      onConfirm?.()
      onClose()
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="w-[396px] h-[341px]"
    >
      <Modal.Header>
        <div className="flex flex-col items-center gap-4">
          <img
            src={isThirdWarning ? '/icons/alertCircleRed.svg' : '/icons/alertCircleYellow.svg'}
            alt="경고"
            className="w-16 h-16"
          />
          {renderTitle()}
          {renderSubtitle()}
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col items-center">
          <div className="w-full" style={{ marginTop: '-20px' }}>
            <Button
              variant="primary"
              size="xl"
              className="w-full"
              onClick={handleButtonClick}
            >
              {isThirdWarning ? '시험종료' : '확인'}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
