export interface ExamDeploymentDetailResponse {
  exam_id: number
  exam_name: string
  duration_time: number
  elapsed_time: number
  cheating_count: number
  questions: Array<{
    question_id: number
    number: number
    type:
      | 'single_choice'
      | 'multiple_choice'
      | 'ox'
      | 'short_answer'
      | 'ordering'
      | 'fill_blank'
    question: string
    point: number
    prompt: string | null
    blank_count: number | null
    options: string[] | null
    answer_input: string | string[] | null
  }>
}

export interface ExamDeploymentDetailResult {
  examId: number
  examName: string
  durationTime: number
  elapsedTime: number
  cheatingCount: number
  questions: Array<{
    questionId: number
    number: number
    type:
      | 'single_choice'
      | 'multiple_choice'
      | 'ox'
      | 'short_answer'
      | 'ordering'
      | 'fill_blank'
    question: string
    point: number
    prompt: string | null
    blankCount: number | null
    options: string[] | null
    answerInput: string | string[] | null
  }>
}

export const mapExamDeploymentDetail = (
  response: ExamDeploymentDetailResponse
): ExamDeploymentDetailResult => {
  return {
    examId: response.exam_id,
    examName: response.exam_name,
    durationTime: response.duration_time,
    elapsedTime: response.elapsed_time,
    cheatingCount: response.cheating_count,
    questions: response.questions.map((question) => ({
      questionId: question.question_id,
      number: question.number,
      type: question.type,
      question: question.question,
      point: question.point,
      prompt: question.prompt,
      blankCount: question.blank_count,
      options: question.options,
      answerInput: question.answer_input,
    })),
  }
}
