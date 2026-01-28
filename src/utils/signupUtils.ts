import axios from 'axios'
import { z } from 'zod'

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,15}$/

export const emailZ = z.string().trim().email()

export function formatBirthday(yyyymmdd: string) {
  const raw = yyyymmdd.replace(/\D/g, '')
  if (raw.length !== 8) return null
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
}

export function mapGender(g: 'male' | 'female'): 'M' | 'F' {
  return g === 'male' ? 'M' : 'F'
}

type ErrorResponseData =
  | {
      error_detail?: string | Record<string, string | string[]>
    }
  | undefined

export function pickMessageFromAxios(
  err: unknown,
  byStatus: Record<number, string>,
  fallback: string
) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    if (status && byStatus[status]) return byStatus[status]

    const data = err.response?.data as ErrorResponseData
    const ed = data?.error_detail
    if (typeof ed === 'string') return ed
    if (ed && typeof ed === 'object') {
      const first = Object.values(ed)[0]
      if (typeof first === 'string') return first
      if (Array.isArray(first) && typeof first[0] === 'string')
        return first[0]
    }
  }
  return fallback
}
