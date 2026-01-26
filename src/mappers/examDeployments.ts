export interface ExamDeploymentsResponse {
  page: number
  has_next: boolean
  results: Array<{
    id: number
    submission_id: number | null
    exam: {
      id: number
      title: string
      thumbnail_img_url: string
      subject: {
        id: number
        title: string
        thumbnail_img_url: string | null
      }
    }
    question_count: number
    total_score: number
    exam_info: {
      status: 'done' | 'pending'
      score: number | null
      correct_answer_count: number | null
    }
    is_done: boolean
    duration_time: number
  }>
}

export interface ExamDeploymentsResult {
  page: number
  hasNext: boolean
  results: Array<{
    id: number
    submissionId: number | null
    exam: {
      id: number
      title: string
      thumbnailImgUrl: string
      subject: {
        id: number
        title: string
        thumbnailImgUrl: string | null
      }
    }
    questionCount: number
    totalScore: number
    examInfo: {
      status: 'done' | 'pending'
      score: number | null
      correctAnswerCount: number | null
    }
    isDone: boolean
    durationTime: number
  }>
}

export const mapExamDeploymentsResult = (
  response: ExamDeploymentsResponse
): ExamDeploymentsResult => {
  return {
    page: response.page,
    hasNext: response.has_next,
    results: response.results.map((item) => ({
      id: item.id,
      submissionId: item.submission_id,
      exam: {
        id: item.exam.id,
        title: item.exam.title,
        thumbnailImgUrl: item.exam.thumbnail_img_url,
        subject: {
          id: item.exam.subject.id,
          title: item.exam.subject.title,
          thumbnailImgUrl: item.exam.subject.thumbnail_img_url,
        },
      },
      questionCount: item.question_count,
      totalScore: item.total_score,
      examInfo: {
        status: item.exam_info.status,
        score: item.exam_info.score,
        correctAnswerCount: item.exam_info.correct_answer_count,
      },
      isDone: item.is_done,
      durationTime: item.duration_time,
    })),
  }
}
