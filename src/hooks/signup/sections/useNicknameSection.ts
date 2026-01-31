import { useMemo } from 'react'
import type { FieldState } from '@/components/common/CommonInput'
import type { FlowMessage } from '@/utils/formMessage'
import type {
  NicknameSectionActions,
  NicknameSectionMessages,
  NicknameSectionUI,
  NicknameSectionValues,
} from './types'

const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]{2,10}$/

export type UseNicknameSectionArgs = {
  nickname: string
  nicknameChecked: boolean
  nicknameFlowMessage: FlowMessage
  nicknameFieldState: FieldState
  busy: boolean
  onCheckNickname: () => Promise<void>
}

export function useNicknameSection(args: UseNicknameSectionArgs) {
  const {
    nickname,
    nicknameChecked,
    nicknameFlowMessage,
    nicknameFieldState,
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
      nicknameFieldState,
    }),
    [nicknameChecked, nicknameFieldState, nickname, busy]
  )

  const messages: NicknameSectionMessages = useMemo(
    () => ({ flowMessage: nicknameFlowMessage }),
    [nicknameFlowMessage]
  )

  const actions: NicknameSectionActions = useMemo(
    () => ({ onCheckNickname }),
    [onCheckNickname]
  )

  return { values, ui, messages, actions }
}
