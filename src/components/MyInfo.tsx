import { useState } from 'react'
import { Button } from './common'
import { ViewMyInfo } from './myinfo/ViewMyInfo'
import { EditMyInfo } from './myinfo/EditMyInfo'

export default function MyInfo() {
  const [isEdit, setIsEdit] = useState(false)
  return (
    <>
      <div className="flex w-[744px] items-center justify-between">
        <div className="text-3xl font-bold">내 정보</div>
        <Button size={'md'} onClick={() => setIsEdit(!isEdit)}>
          {!isEdit ? '수정하기' : '저장하기'}
        </Button>
      </div>
      {!isEdit ? <ViewMyInfo /> : <EditMyInfo />}
    </>
  )
}
