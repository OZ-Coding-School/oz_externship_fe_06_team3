import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { Modal } from '../Modal'
import { Button } from '../../Button'
import { CommonInputField } from '../../CommonInputField'
import { useCheckExamCodeMutation } from '@/hooks/useQuiz'
import { startQuizSchema, type StartQuizFormData } from '@/schemas/modalSchemas'

interface StartQuizModalProps {
  isOpen: boolean
  onClose: () => void
  deploymentId: number
  imageUrl: string
  subjectName: string
  quizName: string
  questionCount: number
  timeLimit: number
  onSuccess?: (data: StartQuizFormData) => void
}

export function StartQuizModal({
  isOpen,
  onClose,
  deploymentId,
  imageUrl,
  subjectName,
  quizName,
  questionCount,
  timeLimit,
  onSuccess,
}: StartQuizModalProps) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageError, setImageError] = useState(false)
  const checkCodeMutation = useCheckExamCodeMutation()

  const methods = useForm<StartQuizFormData>({
    resolver: zodResolver(startQuizSchema),
    defaultValues: {
      code: '',
    },
  })

  useEffect(() => {
    if (!isOpen) {
      methods.reset()
      setIsSubmitting(false)
      setImageError(false)
    }
  }, [isOpen, methods])

  const onSubmit = async (data: StartQuizFormData) => {
    setIsSubmitting(true)

    try {
      await checkCodeMutation.mutateAsync({
        deploymentId,
        code: data.code,
      })

      onSuccess?.(data)
      onClose()
      navigate(`/quiz/${deploymentId}`)
    } catch (error) {
      methods.setError('code', {
        type: 'manual',
        message: '*코드번호가 일치하지 않습니다.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="flex flex-col items-center gap-4">
          {!imageError && (
            <img
              src={imageUrl}
              alt={subjectName}
              className="w-16 h-16"
              onError={() => setImageError(true)}
            />
          )}
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-center text-[18px] font-semibold text-[#121212]">
              {quizName}
            </h2>
            <p className="text-center">
              <span className="text-[14px] font-normal text-[#303030]">
                총 {questionCount}문항
              </span>
              {' '}ㆍ{' '}
              <span className="text-[14px] font-normal text-[#6201E0]">
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
              <div className="min-w-[348px]">
                <CommonInputField<StartQuizFormData>
                  name="code"
                  placeholder="참가 코드를 입력해주세요"
                  helperVisibility="always"
                  state={methods.formState.errors.code ? "error" : "default"}
                  helperTextByState={{
                    error: (
                      <span className="text-[12px] font-normal text-[#EC0037]">
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
                disabled={isSubmitting}
              >
                {isSubmitting ? '검증 중...' : '시험시작'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
