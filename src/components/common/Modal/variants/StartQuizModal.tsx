import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { Modal } from '../Modal'
import { Button } from '../../Button'
import { CommonInputField } from '../../CommonInputField'
import { startQuizSchema, type StartQuizFormData } from '@/schemas/modalSchemas'

// 시험 시작 모달 props 타입
interface StartQuizModalProps {
  isOpen: boolean
  onClose: () => void
  subjectName?: string
  questionCount?: number
  timeLimit?: number // 분 단위
  onSuccess?: (data: StartQuizFormData) => void
}

// 목업 데이터 - 나중에 API로 받을 데이터 구조
// 참가 코드는 과목별로 Base62 인코딩된 값으로 받아올 예정
const mockQuizData = {
  subjectName: 'React',              // 과목명
  quizName: 'React 심화',            // 쪽지시험 이름
  questionCount: 20,                 // 문항수
  timeLimit: 30,                     // 제한시간 (분)
  verificationCode: 'Base62',        // 참가 코드 (Base62 인코딩된 값, 나중에 API로 받아올 예정)
}

// 시험 시작 모달 컴포넌트
export function StartQuizModal({
  isOpen,
  onClose,
  subjectName = mockQuizData.subjectName,
  questionCount = mockQuizData.questionCount,
  timeLimit = mockQuizData.timeLimit,
  onSuccess,
}: StartQuizModalProps) {
  const navigate = useNavigate()
  const methods = useForm<StartQuizFormData>({
    resolver: zodResolver(startQuizSchema),
    defaultValues: {
      code: '',
    },
  })

  // 목업: 쪽지시험 이름 생성 (과목명 + 기초/심화/응용)
  // subjectName에 이미 레벨이 포함되어 있는지 확인
  const quizLevels = ['기초', '심화', '응용']
  const hasLevel = quizLevels.some((level) => subjectName.includes(level))
  
  // 레벨이 이미 포함되어 있으면 그대로 사용, 없으면 목업 데이터 사용
  const displayQuizName = hasLevel
    ? subjectName
    : mockQuizData.quizName

  // 과목명을 기반으로 이미지 경로 생성 (대소문자 구분 없이)
  // 실제 파일명 목록 (대소문자 포함)
  const courseImageFiles = [
    'check.svg',
    'css.svg',
    'DB.svg',
    'django.svg',
    'fastapi.svg',
    'flask.svg',
    'github.svg',
    'html.svg',
    'JavaScript.svg',
    'nodejs.svg',
    'python.svg',
    'React.svg',
    'ReactNative.svg',
    'typescript.svg',
  ]

  // 과목명과 대소문자 구분 없이 매칭되는 파일 찾기
  const findCourseImage = (subjectName: string): string => {
    const normalizedSubject = subjectName.toLowerCase().replace(/\s+/g, '')
    const matchedFile = courseImageFiles.find((file) => {
      const fileName = file.replace('.svg', '').toLowerCase()
      return fileName === normalizedSubject || 
             fileName.includes(normalizedSubject) || 
             normalizedSubject.includes(fileName)
    })
    
    if (matchedFile) {
      return `/icons/Course/${matchedFile}`
    }
    
    // 매칭되지 않으면 과목명 그대로 시도
    return `/icons/Course/${subjectName}.svg`
  }

  const courseImagePath = findCourseImage(subjectName)

  // 참가 코드 검증 함수
  const validateVerificationCode = (code: string): boolean => {
    // 목업: Base62 참가 코드와 비교
    // 나중에 API로 받아올 때는 과목별로 다른 Base62 값을 받아올 예정
    return code === mockQuizData.verificationCode
  }

  const onSubmit = (data: StartQuizFormData) => {
    // 참가 코드 검증
    if (!validateVerificationCode(data.code)) {
      // 에러 메시지 설정
      methods.setError('code', {
        type: 'manual',
        message: '*코드번호가 일치하지 않습니다.',
      })
      return
    }

    // 참가 코드가 유효한 경우
    onSuccess?.(data)
    onClose()
    // 쪽지시험 페이지로 이동
    navigate('/quiz')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="flex flex-col items-center gap-4">
          <img 
            src={courseImagePath} 
            alt={subjectName}
            className="w-16 h-16"
            onError={(e) => {
              // 이미지가 없을 경우 기본 이미지 또는 숨김 처리
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="flex flex-col items-center gap-2">
            <h2 
              className="text-center"
              style={{
                fontSize: '18px',
                fontWeight: '600', // SemiBold
                color: '#121212',
              }}
            >
              {displayQuizName}
            </h2>
            <p className="text-center">
              <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#303030' }}>
                총 {questionCount}문항
              </span>
              {' '}ㆍ{' '}
              <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6201E0' }}>
                제한시간 {timeLimit}분
              </span>
            </p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <Modal.InputRow label="참가 코드입력">
              <div style={{ minWidth: '348px' }}>
                <CommonInputField<StartQuizFormData>
                  name="code"
                  placeholder="참가 코드를 입력해주세요"
                  helperVisibility="always"
                  state={methods.formState.errors.code ? "error" : "default"}
                  helperTextByState={{
                    error: (
                      <span style={{ color: '#EC0037', fontSize: '12px', fontWeight: 'normal' }}>
                        {methods.formState.errors.code?.message}
                      </span>
                    ),
                  }}
                />
              </div>
            </Modal.InputRow>

            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="xl" 
                className="w-full"
                style={{ minWidth: '348px' }}
              >
                시험시작
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
