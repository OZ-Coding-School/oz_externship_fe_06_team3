import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'
import type { ExamSubmissionResult } from '@/mappers/examSubmissionResult'
import SingleChoice from './SingleChoice'
import MultipleChoice from './MultipleChoice'
import OX from './OX'
import FillBlank from './FillBlank'
import Ordering from './Ordering'
import ShortAnswer from './ShortAnswer'

type ResultQuestion = ExamSubmissionResult['questions'][0]
type QuizQuestion = ExamDeploymentDetailResult['questions'][0]

interface ResultQuestionItemProps {
  question: ResultQuestion
  index: number
}

function mapResultQuestionToQuizQuestion(
  question: ResultQuestion,
  index: number
): QuizQuestion {
  return {
    questionId: question.id,
    number: index + 1,
    type: question.type as QuizQuestion['type'],
    question: question.question,
    point: question.point,
    prompt: question.prompt,
    blankCount: question.blankCount,
    options: question.options,
    answerInput: null,
  }
}

/**
 * 결과 페이지용 문항 1개 렌더링. 타입에 따라 SingleChoice/MultipleChoice/... 표시.
 */
export default function ResultQuestionItem({ question, index }: ResultQuestionItemProps) {
  const mapped = mapResultQuestionToQuizQuestion(question, index)
  const submitted = question.submittedAnswer
  const noop = () => {}

  switch (question.type) {
    case 'single_choice':
      return (
        <SingleChoice
          question={mapped}
          answer={(submitted?.[0] ?? null) as string | null}
          onAnswerChange={noop}
          isResult
          correctAnswer={(question.answer?.[0] ?? null) as string | null}
          isCorrect={question.isCorrect}
          explanation={question.explanation}
        />
      )
    case 'multiple_choice':
      return (
        <MultipleChoice
          question={mapped}
          answer={(submitted ?? null) as string[] | null}
          onAnswerChange={noop}
          isResult
          correctAnswer={(question.answer ?? null) as string[] | null}
          isCorrect={question.isCorrect}
          explanation={question.explanation}
        />
      )
    case 'short_answer':
      return (
        <ShortAnswer
          question={mapped}
          answer={(submitted?.[0] ?? '') as string}
          onAnswerChange={noop}
          isResult
          isCorrect={question.isCorrect}
          explanation={question.explanation}
        />
      )
    case 'ox':
      return (
        <OX
          question={mapped}
          answer={(submitted?.[0] ?? null) as string | null}
          onAnswerChange={noop}
          isResult
          correctAnswer={(question.answer?.[0] ?? null) as string | null}
          isCorrect={question.isCorrect}
          explanation={question.explanation}
        />
      )
    case 'fill_blank':
      return (
        <FillBlank
          question={mapped}
          answer={(submitted ?? null) as string[] | null}
          onAnswerChange={noop}
          isResult
          correctAnswer={(question.answer ?? null) as string[] | null}
          isCorrect={question.isCorrect}
          explanation={question.explanation}
        />
      )
    case 'ordering':
      return (
        <Ordering
          question={mapped}
          answer={(submitted ?? null) as string[] | null}
          onAnswerChange={noop}
          isResult
          correctAnswer={(question.answer ?? null) as string[] | null}
          isCorrect={question.isCorrect}
          explanation={question.explanation}
        />
      )
    default:
      return null
  }
}
