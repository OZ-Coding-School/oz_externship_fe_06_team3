export interface ExamSubmissionResponse {
  submission_id: number
  score: number
  correct_answer_count: number
  redirect_url: string
}

export interface ExamSubmissionResult {
  submissionId: number
  score: number
  correctAnswerCount: number
  redirectUrl: string
}

export const mapExamSubmissionResult = (
  response: ExamSubmissionResponse
): ExamSubmissionResult => {
  return {
    submissionId: response.submission_id,
    score: response.score,
    correctAnswerCount: response.correct_answer_count,
    redirectUrl: response.redirect_url,
  }
}
