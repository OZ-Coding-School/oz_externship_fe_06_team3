import { useState } from 'react'
import { Button, CommonInput } from '../common'
import type { FieldState } from '../common/CommonInput'

export function EditMyInfo() {
  const [nickname, setNickname] = useState('오즈오즈')
  const [nicknameState, setNicknameState] = useState<FieldState>('default')

  return (
    <>
      <div className="infoborder mt-[20px] h-[1194px] w-[747px]">
        <p className="text-primary title-l">프로필 수정</p>
        <hr className="border-mono-400 mt-[16px]" />
        <div className="flex justify-center">
          <img
            src="../public/프로필 사진.svg"
            alt="프로필 사진"
            className="m-[52px] h-[184px] rounded-full"
          />
        </div>
        <p>닉네임</p>
        <div className="mt-[15px] flex gap-[12px]">
          <CommonInput
            value={nickname}
            placeholder={nickname}
            width={532}
            onChange={setNickname}
            state={nicknameState}
            helperText="*한글 8자, 영문 및 숫자 16자까지 혼용할 수 있어요."
            helperVisibility="always"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const isDuplicated = false
              setNicknameState(isDuplicated ? 'error' : 'success')
            }}
          >
            중복확인
          </Button>
        </div>
        <div className="mt-[40px] flex flex-col gap-[12px]">
          <p>이메일(아이디)</p>
          <CommonInput
            value={''}
            width={656}
            disabled
            placeholderVariant="b"
            placeholder={'ozschool1234@gmail.com'}
            onChange={() => {}}
          />
        </div>
        <p className="text-primary title-l mt-[80px]">개인 정보 수정</p>
        <hr className="border-mono-400 mt-[16px]" />
        <div className="mt-[40px] flex flex-col gap-[12px]">
          <p>이름</p>
          <CommonInput
            value={''}
            width={656}
            disabled
            placeholderVariant="b"
            placeholder={'김오즈'}
            onChange={() => {}}
          />
        </div>
        <p className="my-[15px]">휴대전화</p>
        <div className="flex gap-[12px]">
          <CommonInput
            value={'010-1234-1234'}
            placeholder={'010-1234-1234'}
            width={532}
            onChange={() => {}}
          />
          <Button variant="secondary" size="sm" onClick={() => {}}>
            변경
          </Button>
        </div>
        <p className="my-[15px]">성별</p>
        <div className="flex gap-[20px]">
          <Button variant={'secondary'} size={'xxs'} disabled rounded="full">
            남
          </Button>
          <Button variant={'disabled'} size={'xxs'} disabled rounded="full">
            여
          </Button>
        </div>
        <div className="mt-[15px] flex flex-col gap-[12px]">
          <p>생년월일</p>
          <CommonInput
            value={''}
            width={656}
            disabled
            placeholderVariant="b"
            placeholder={'2000.12.25'}
            onChange={() => {}}
          />
        </div>
      </div>
    </>
  )
}
