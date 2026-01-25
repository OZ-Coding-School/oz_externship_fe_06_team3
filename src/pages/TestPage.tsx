import { useState } from 'react'
import {
  FindIdModal,
  FindIdResultModal,
  FindPasswordModal,
  ResetPasswordModal,
  WithdrawnMemberModal,
  RestoreAccountModal,
  RegisterStudentModal,
  WithdrawalReasonModal,
  StartQuizModal,
  CheatingWarningModal,
  Button,
} from '@/components/common'

function TestPage() {
  // 각 모달의 열림 상태 관리
  const [findIdOpen, setFindIdOpen] = useState(false)
  const [findIdResultOpen, setFindIdResultOpen] = useState(false)
  const [foundEmail, setFoundEmail] = useState<string>('')
  const [findPasswordOpen, setFindPasswordOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [withdrawnMemberOpen, setWithdrawnMemberOpen] = useState(false)
  const [restoreAccountOpen, setRestoreAccountOpen] = useState(false)
  const [registerStudentOpen, setRegisterStudentOpen] = useState(false)
  const [withdrawalReasonOpen, setWithdrawalReasonOpen] = useState(false)
  const [startQuizOpen, setStartQuizOpen] = useState(false)
  const [cheatingWarning1Open, setCheatingWarning1Open] = useState(false)
  const [cheatingWarning2Open, setCheatingWarning2Open] = useState(false)
  const [cheatingWarning3Open, setCheatingWarning3Open] = useState(false)

  return (
    <div className="p-8 space-y-4">
      <h1 className="title-xl mb-8">모달 테스트 페이지</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* 1. 아이디 찾기 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setFindIdOpen(true)}
        >
          아이디 찾기
        </Button>

        {/* 2. 아이디 확인 결과 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setFindIdResultOpen(true)}
        >
          아이디 확인 결과
        </Button>

        {/* 3. 비밀번호 찾기 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setFindPasswordOpen(true)}
        >
          비밀번호 찾기
        </Button>

        {/* 4. 비밀번호 재설정 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setResetPasswordOpen(true)}
        >
          비밀번호 재설정
        </Button>

        {/* 5. 탈퇴회원 안내 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setWithdrawnMemberOpen(true)}
        >
          탈퇴회원 안내
        </Button>

        {/* 6. 계정 다시 사용하기 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setRestoreAccountOpen(true)}
        >
          계정 다시 사용하기
        </Button>

        {/* 7. 수강생 등록 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setRegisterStudentOpen(true)}
        >
          수강생 등록
        </Button>

        {/* 8. 회원 탈퇴 사유 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setWithdrawalReasonOpen(true)}
        >
          회원 탈퇴 사유
        </Button>

        {/* 9. 쪽지시험 시작 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setStartQuizOpen(true)}
        >
          쪽지시험 시작
        </Button>

        {/* 10. 부정행위 1차 경고 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setCheatingWarning1Open(true)}
        >
          부정행위 1차 경고
        </Button>

        {/* 11. 부정행위 2차 경고 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setCheatingWarning2Open(true)}
        >
          부정행위 2차 경고
        </Button>

        {/* 12. 부정행위 3차 경고 */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => setCheatingWarning3Open(true)}
        >
          부정행위 3차 경고
        </Button>
      </div>

      {/* 모달들 */}
      <FindIdModal
        isOpen={findIdOpen}
        onClose={() => setFindIdOpen(false)}
        onFindIdSuccess={(email) => {
          setFoundEmail(email)
          setFindIdOpen(false)
          setFindIdResultOpen(true)
        }}
      />

      <FindIdResultModal
        isOpen={findIdResultOpen}
        onClose={() => setFindIdResultOpen(false)}
        email={foundEmail || 'test@example.com'}
        onFindPasswordClick={() => {
          setFindIdResultOpen(false)
          setFindPasswordOpen(true)
        }}
      />

      <FindPasswordModal
        isOpen={findPasswordOpen}
        onClose={() => setFindPasswordOpen(false)}
        onSuccess={(data) => {
          console.log('비밀번호 찾기 성공:', data)
          setFindPasswordOpen(false)
          setResetPasswordOpen(true)
        }}
      />

      <ResetPasswordModal
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        onSuccess={(data) => {
          console.log('비밀번호 재설정 성공:', data)
        }}
      />

      <WithdrawnMemberModal
        isOpen={withdrawnMemberOpen}
        onClose={() => setWithdrawnMemberOpen(false)}
        onRestoreAccount={() => {
          setWithdrawnMemberOpen(false)
          setRestoreAccountOpen(true)
        }}
      />

      <RestoreAccountModal
        isOpen={restoreAccountOpen}
        onClose={() => setRestoreAccountOpen(false)}
        onSuccess={(data) => {
          console.log('계정 복구 성공:', data)
        }}
      />

      <RegisterStudentModal
        isOpen={registerStudentOpen}
        onClose={() => setRegisterStudentOpen(false)}
        onSuccess={(data) => {
          console.log('수강생 등록 성공:', data)
          setRegisterStudentOpen(false)
        }}
      />

      <WithdrawalReasonModal
        isOpen={withdrawalReasonOpen}
        onClose={() => setWithdrawalReasonOpen(false)}
        onSuccess={(data) => {
          console.log('탈퇴 사유 제출:', data)
          setWithdrawalReasonOpen(false)
        }}
      />

      <StartQuizModal
        isOpen={startQuizOpen}
        onClose={() => setStartQuizOpen(false)}
        onSuccess={(data) => {
          console.log('쪽지시험 시작:', data)
          setStartQuizOpen(false)
        }}
      />

      <CheatingWarningModal
        isOpen={cheatingWarning1Open}
        onClose={() => setCheatingWarning1Open(false)}
        warningLevel={1}
        onConfirm={() => {
          console.log('1차 경고 확인')
        }}
      />

      <CheatingWarningModal
        isOpen={cheatingWarning2Open}
        onClose={() => setCheatingWarning2Open(false)}
        warningLevel={2}
        onConfirm={() => {
          console.log('2차 경고 확인')
        }}
      />

      <CheatingWarningModal
        isOpen={cheatingWarning3Open}
        onClose={() => setCheatingWarning3Open(false)}
        warningLevel={3}
        onConfirm={() => {
          console.log('3차 경고 확인')
        }}
      />
    </div>
  )
}

export default TestPage
