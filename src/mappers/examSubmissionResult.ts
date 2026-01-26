export interface ExamSubmissionResultResponse {
  id: number
  submitter_id: number
  deployment_id: number
  exam: {
    id: number
    title: string
    thumbnail_img_url: string
  }
  questions: Array<{
    id: number
    question: string
    prompt: string
    blank_count: number
    options: string[]
    type: string
    answer: string[]
    point: number
    explanation: string
    is_correct: boolean
    submitted_answer: string[]
  }>
  cheating_count: number
  total_score: number
  correct_answer_count: number
  elapsed_time: number
  started_at: string
  submitted_at: string
}

export interface ExamSubmissionResult {
  id: number
  submitterId: number
  deploymentId: number
  exam: {
    id: number
    title: string
    thumbnailImgUrl: string
  }
  questions: Array<{
    id: number
    question: string
    prompt: string
    blankCount: number
    options: string[]
    type: string
    answer: string[]
    point: number
    explanation: string
    isCorrect: boolean
    submittedAnswer: string[]
  }>
  cheatingCount: number
  totalScore: number
  correctAnswerCount: number
  elapsedTime: number
  startedAt: string
  submittedAt: string
}

export const mapExamSubmissionResult = (
  response: ExamSubmissionResultResponse
): ExamSubmissionResult => {
  return {
    id: response.id,
    submitterId: response.submitter_id,
    deploymentId: response.deployment_id,
    exam: {
      id: response.exam.id,
      title: response.exam.title,
      thumbnailImgUrl: response.exam.thumbnail_img_url,
    },
    questions: response.questions.map((question) => ({
      id: question.id,
      question: question.question,
      prompt: question.prompt,
      blankCount: question.blank_count,
      options: question.options,
      type: question.type,
      answer: question.answer,
      point: question.point,
      explanation: question.explanation,
      isCorrect: question.is_correct,
      submittedAnswer: question.submitted_answer,
    })),
    cheatingCount: response.cheating_count,
    totalScore: response.total_score,
    correctAnswerCount: response.correct_answer_count,
    elapsedTime: response.elapsed_time,
    startedAt: response.started_at,
    submittedAt: response.submitted_at,
  }
}
