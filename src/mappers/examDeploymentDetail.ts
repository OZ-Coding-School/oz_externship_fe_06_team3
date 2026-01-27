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
    examId: response.exam_id,                             // 시험 배포 ID
    examName: response.exam_name,                         // 시험 이름
    durationTime: response.duration_time,                 // 시험 시간(분)
    elapsedTime: response.elapsed_time,                   // 경과 시간(분)
    cheatingCount: response.cheating_count,               // 부정행위 카운트
    questions: response.questions.map((question) => ({    // 문제 목록
      questionId: question.question_id,                     // 문제 ID
      number: question.number,                              // 문제 번호
      type: question.type,                                  // 문제 유형(문제 타입)
      question: question.question,                          // 문제 내용
      point: question.point,                                // 문제 점수
      prompt: question.prompt,                              // 문제 프롬프트(빈칸 채우기 문제 시 사용)
      blankCount: question.blank_count,                     // 빈칸 개수(빈칸 채우기 문제 시 사용)
      options: question.options,                            // 문제 선택지(단답형 문제 시 사용)
      answerInput: question.answer_input,                   // 문제 답변(단답형 문제 시 사용)
    })),
  }
}
