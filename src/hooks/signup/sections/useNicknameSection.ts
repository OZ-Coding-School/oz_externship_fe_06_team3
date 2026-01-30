import { useMemo } from 'react'
import type { FieldState } from '@/components/common/CommonInput'
import type { Status } from '@/hooks/useVerificationFlow'
import type {
  NicknameSectionActions,
  NicknameSectionMessages,
  NicknameSectionUI,
  NicknameSectionValues,
} from './types'

const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]{2,10}$/

function statusToFieldState(s: Status): FieldState {
  return s === 'success' ? 'success' : s === 'error' ? 'error' : 'default'
}

export type UseNicknameSectionArgs = {
  nickname: string
  nicknameChecked: boolean
  nicknameStatus: Status
  nicknameMsg: string | null
  busy: boolean
  onCheckNickname: () => Promise<void>
}

export function useNicknameSection(args: UseNicknameSectionArgs) {
  const {
    nickname,
    nicknameChecked,
    nicknameStatus,
    nicknameMsg,
    busy,
    onCheckNickname,
  } = args

  const values: NicknameSectionValues = useMemo(
    () => ({ nickname }),
    [nickname]
  )

  const ui: NicknameSectionUI = useMemo(
    () => ({
      nicknameChecked,
      canCheckNickname:
        !busy && !nicknameChecked && NICKNAME_REGEX.test(nickname),
      nicknameFieldState: statusToFieldState(nicknameStatus),
    }),
    [nicknameChecked, nicknameStatus, nickname, busy]
  )

  const messages: NicknameSectionMessages = useMemo(
    () => ({ nicknameMsg }),
    [nicknameMsg]
  )

  const actions: NicknameSectionActions = useMemo(
    () => ({ onCheckNickname }),
    [onCheckNickname]
  )

  return { values, ui, messages, actions }
}
