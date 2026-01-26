export interface ExamDeploymentStatusResponse {
  exam_status: string
  force_submit: boolean
}

export interface ExamDeploymentStatus {
  examStatus: string
  forceSubmit: boolean
}

export const mapExamDeploymentStatus = (
  response: ExamDeploymentStatusResponse
): ExamDeploymentStatus => {
  return {
    examStatus: response.exam_status,
    forceSubmit: response.force_submit,
  }
}
