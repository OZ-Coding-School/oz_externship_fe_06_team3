export interface CheckCodeSuccessResponse {
  error_detail?: never
}

export interface CheckCodeResult {
  ok: boolean
}

export const mapCheckCodeResult = (_response: CheckCodeSuccessResponse): CheckCodeResult => {
  return { ok: true }
}
