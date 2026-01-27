function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <p className="infoText">{label}</p>
      <p>{value}</p>
    </div>
  )
}
export function ViewMyInfo() {
  return (
    <>
      <div className="infoborder mt-[20px] h-[844px] w-[747px]">
        <p className="text-primary title-l">프로필</p>
        <hr className="border-mono-400 mt-[16px]" />
        <div className="flex justify-center">
          <img
            src="../public/프로필 사진.svg"
            alt="프로필 사진"
            className="m-[52px] h-[184px] rounded-full"
          />
        </div>
        <div className="flex h-[66px] flex-col justify-between gap-[20px]">
          <InfoRow label="닉네임" value="닉네임" />
          <InfoRow label="이메일" value="이메일" />
        </div>
        <p className="text-primary title-l mt-[90px]">개인 정보</p>
        <hr className="border-mono-400 mt-[16px] mb-[28px]" />
        <div className="flex h-[172px] flex-col justify-between gap-[20px]">
          <InfoRow label="이름" value="김오즈" />
          <InfoRow label="휴대전화" value="010-1234-1234" />
          <InfoRow label="성별" value="남자" />
          <InfoRow label="생년월일" value="2000.12.25" />
        </div>
      </div>
      <div className="infoborder mt-[20px] w-[747px]">
        <p className="text-primary title-l">수강중인 과정</p>
        <hr className="border-mono-400 mt-[16px] mb-[40px]" />
        <div className="flex justify-between">
          <div className="flex flex-col justify-center">
            <p className="text-mono-400 placeholder-a mb-[10px]">
              익스턴십 개발 <span>캠프</span> • <span>오즈코딩</span>
            </p>
            <p>
              {
                'IT스타트업 실무형 풀스택 웹 개발 부트캠프 (React + Node.js) < 1기 >'
              }
            </p>
          </div>
          <img src="" alt="" className="h-[102px] w-[152px]" />
        </div>
      </div>
      <div className="my-[48px] flex h-[147px] items-center justify-between">
        <div className="flex w-[365px] flex-col">
          <p className="text-mono-600 text-[20px]">회원탈퇴 안내</p>
          <p className="text-mono-400 placeholder-a mt-[20px] text-[13px]">
            탈퇴 처리 시, 수강 기간 / 포인트 / 쿠폰은 소멸되며 환불되지
            않습니다.필요한 경우, 반드시 탈퇴 전에 문의 바랍니다.
          </p>
        </div>
        <button className="flex-center border-mono-250 bg-mono-200 h-[48px] w-[142px] rounded-[4px] border">
          회원 탈퇴하기
        </button>
      </div>
    </>
  )
}
