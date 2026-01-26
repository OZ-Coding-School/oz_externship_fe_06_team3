import { useMutation, useQuery } from '@tanstack/react-query'
import {
  checkExamCode,
  fetchExamDeploymentDetail,
  fetchExamDeploymentStatus,
  fetchExamDeployments,
  fetchExamSubmissionResult,
  submitExam,
  type ExamSubmissionPayload,
  type FetchExamDeploymentsParams,
} from '@/api/quiz'

export const useExamDeploymentsQuery = (params: FetchExamDeploymentsParams, enabled = true) => {
  /**
   * 쪽지시험 목록 쿼리
   * 사용 예:
   * const { data } = useExamDeploymentsQuery({ page: 1, status: 'all' })
   */
  return useQuery({
    queryKey: ['examDeployments', params.page ?? 1, params.status ?? 'all'],
    queryFn: () => fetchExamDeployments(params),
    enabled,
  })
}

export const useExamDeploymentDetailQuery = (deploymentId: number, enabled = true) => {
  /**
   * 쪽지시험 상세/문항 쿼리
   * 사용 예:
   * const { data } = useExamDeploymentDetailQuery(101)
   */
  return useQuery({
    queryKey: ['examDeploymentDetail', deploymentId],
    queryFn: () => fetchExamDeploymentDetail(deploymentId),
    enabled,
  })
}

export const useExamDeploymentStatusQuery = (deploymentId: number, enabled = true) => {
  /**
   * 쪽지시험 상태 쿼리
   * 사용 예:
   * const { data } = useExamDeploymentStatusQuery(101)
   */
  return useQuery({
    queryKey: ['examDeploymentStatus', deploymentId],
    queryFn: () => fetchExamDeploymentStatus(deploymentId),
    enabled,
  })
}

export const useCheckExamCodeMutation = () => {
  /**
   * 쪽지시험 입장 코드 검증
   * 사용 예:
   * const mutation = useCheckExamCodeMutation()
   * mutation.mutate({ deploymentId: 101, code: '123456' })
   */
  return useMutation({
    mutationFn: ({ deploymentId, code }: { deploymentId: number; code: string }) =>
      checkExamCode(deploymentId, code),
  })
}

export const useExamSubmissionMutation = () => {
  /**
   * 쪽지시험 제출
   * 사용 예:
   * const mutation = useExamSubmissionMutation()
   * mutation.mutate(payload)
   */
  return useMutation({
    mutationFn: (payload: ExamSubmissionPayload) => submitExam(payload),
  })
}

export const useExamSubmissionResultQuery = (submissionId: number, enabled = true) => {
  /**
   * 쪽지시험 결과 쿼리
   * 사용 예:
   * const { data } = useExamSubmissionResultQuery(350)
   */
  return useQuery({
    queryKey: ['examSubmissionResult', submissionId],
    queryFn: () => fetchExamSubmissionResult(submissionId),
    enabled,
  })
}
