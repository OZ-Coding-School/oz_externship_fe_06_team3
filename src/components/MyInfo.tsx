import { useEffect, useState } from 'react'
import { Button, Loading } from './common'
import { ViewMyInfo } from './myinfo/ViewMyInfo'
import { EditMyInfo } from './myinfo/EditMyInfo'
import type { User } from '@/types/auth'
import { me } from '@/api/auth'
import { getMyCourses } from '@/api/info'
import { updateMyInfo } from '@/api/auth'
import { useMyInfoStore } from '@/store/myInfoStore'

export default function MyInfo() {
  const [isEdit, setIsEdit] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData] = await Promise.all([me(), getMyCourses()])
        setUser(userData)
      } catch (e) {
        console.error('내 정보 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async () => {
    if (!user) return
    const { nickname, phone, nicknameStatus, phoneStatus, error } =
      useMyInfoStore.getState()
    // 닉네임 중복검사 통과 또는 전화번호 인증 완료 시만 저장
    const canPatch = nicknameStatus === 'success' || phoneStatus === 'success'
    if (!canPatch) {
      if (error) {
        alert(error)
        return
      }
      setIsEdit(false)
      return
    }
    try {
      const updated = await updateMyInfo({
        nickname: nicknameStatus === 'success' ? nickname : user.nickname,
        phone_number: phoneStatus === 'success' ? phone : user.phone_number,
      })
      setUser(updated)
      setIsEdit(false)
    } catch (e) {
      console.error('내 정보 저장 실패', e)
    }
  }

  const handleEdit = () => {
    // 번호 인증 관련 zustand 상태 초기화
    useMyInfoStore.getState().reset()
    setIsEdit(true)
  }

  // 저장 버튼 활성화 조건 계산 관련 미사용 변수 삭제

  if (loading)
    return (
      <div className="flex-center h-[600px]">
        <Loading />
      </div>
    )
  if (!user) return <div>정보를 불러올 수 없습니다.</div>

  return (
    <>
      <div className="flex w-[744px] items-center justify-between">
        <div className="title-xl">내 정보</div>
        <Button
          size="md"
          onClick={() => (isEdit ? handleSave() : handleEdit())}
        >
          {isEdit ? '저장하기' : '수정하기'}
        </Button>
      </div>

      {isEdit ? (
        <EditMyInfo user={user} />
      ) : (
        <>
          <ViewMyInfo />
        </>
      )}
    </>
  )
}
