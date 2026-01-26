import api from '@/api/api'
import {
  mapExamDeploymentsResult,
  type ExamDeploymentsResponse,
} from '@/mappers/examDeployments'
import {
  mapExamDeploymentDetail,
  type ExamDeploymentDetailResponse,
} from '@/mappers/examDeploymentDetail'
import {
  mapExamDeploymentStatus,
  type ExamDeploymentStatusResponse,
} from '@/mappers/examDeploymentStatus'
import { mapCheckCodeResult } from '@/mappers/checkCode'
import {
  mapExamSubmissionResult,
  type ExamSubmissionResponse,
} from '@/mappers/examSubmission'
import {
  mapExamSubmissionResult as mapExamSubmissionResultDetail,
  type ExamSubmissionResultResponse,
} from '@/mappers/examSubmissionResult'

export interface FetchExamDeploymentsParams {
  page?: number
  status?: 'all' | 'done' | 'pending'
}

/**
 * 쪽지시험 목록 조회
 * 사용 예:
 * const data = await fetchExamDeployments({ page: 1, status: 'all' })
 */
export const fetchExamDeployments = async (params: FetchExamDeploymentsParams = {}) => {
  const response = await api.get<ExamDeploymentsResponse>('/api/v1/exams/deployments', {
    params: {
      page: params.page ?? 1,
      status: params.status ?? 'all',
    },
  })
  return mapExamDeploymentsResult(response.data)
}

/**
 * 쪽지시험 상세/문항 조회
 * 사용 예:
 * const data = await fetchExamDeploymentDetail(101)
 */
export const fetchExamDeploymentDetail = async (deploymentId: number) => {
  const response = await api.get<ExamDeploymentDetailResponse>(
    `/api/v1/exams/deplayments/${deploymentId}`
  )
  return mapExamDeploymentDetail(response.data)
}

/**
 * 쪽지시험 상태 확인
 * 사용 예:
 * const data = await fetchExamDeploymentStatus(101)
 */
export const fetchExamDeploymentStatus = async (deploymentId: number) => {
  const response = await api.get<ExamDeploymentStatusResponse>(
    `/api/v1/exams/deplayments/${deploymentId}/status`
  )
  return mapExamDeploymentStatus(response.data)
}

/**
 * 쪽지시험 입장 코드 검증
 * 사용 예:
 * const data = await checkExamCode(101, '123456')
 */
export const checkExamCode = async (deploymentId: number, code: string) => {
  const response = await api.post(`/api/v1/exams/deployments/${deploymentId}/check-code`, {
    code,
  })
  return mapCheckCodeResult(response.data)
}

export interface ExamSubmissionAnswerPayload {
  question_id: number
  type: string
  submitted_answer: unknown
}

export interface ExamSubmissionPayload {
  deployment_id: number
  started_at: string
  cheating_count: number
  answers: ExamSubmissionAnswerPayload[]
}

/**
 * 쪽지시험 제출
 * 사용 예:
 * const data = await submitExam(payload)
 */
export const submitExam = async (payload: ExamSubmissionPayload) => {
  const response = await api.post<ExamSubmissionResponse>('/api/v1/exams/submissions', payload)
  return mapExamSubmissionResult(response.data)
}

/**
 * 쪽지시험 결과 조회
 * 사용 예:
 * const data = await fetchExamSubmissionResult(350)
 */
export const fetchExamSubmissionResult = async (submissionId: number) => {
  const response = await api.get<ExamSubmissionResultResponse>(
    `/api/v1/exams/submissions/${submissionId}`
  )
  return mapExamSubmissionResultDetail(response.data)
}
