/** 쪽지시험 목록 페이지 경로 */
export const QUIZ_LIST_PATH = '/mypage/quiz'

const QUIZ_VERIFIED_KEY_PREFIX = 'quiz_verified_'

/** 참가코드 검증 완료 여부를 sessionStorage에 저장할 때 사용하는 키 */
export function getQuizVerifiedKey(deploymentId: number): string {
  return `${QUIZ_VERIFIED_KEY_PREFIX}${deploymentId}`
}

/** 잘못된 접근 모달에서 목록으로 자동 이동까지의 시간(ms) */
export const INVALID_ACCESS_AUTO_REDIRECT_MS = 3000

/** 부정행위 감지 디바운스(ms) */
export const CHEATING_DEBOUNCE_MS = 800

/** 부정행위 경고 모달 단계 (1~3) */
export const CHEATING_WARNING_LEVEL_MIN = 1
export const CHEATING_WARNING_LEVEL_MAX = 3

/** 관리자 종료 모달 자동 이동 대기(ms) */
export const STATUS_END_AUTO_NAVIGATE_MS = 5000

/** API 응답 전 타이머 기본 남은 시간(초) */
export const INITIAL_REMAINING_SECONDS = 30 * 60

/** 타이머 간격(ms) */
export const QUIZ_TIMER_INTERVAL_MS = 1000

/** 분당 초 수 */
export const SECONDS_PER_MINUTE = 60

/** 제출 시 배열로 보내야 하는 문항 타입 */
export const ARRAY_ANSWER_TYPES = new Set<
  'multiple_choice' | 'fill_blank' | 'ordering'
>(['multiple_choice', 'fill_blank', 'ordering'])
