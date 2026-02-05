import { unmapGender } from '@/utils/gender'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { WithdrawalReasonModal } from '../common'
import { withdraw, getMyCourses } from '@/api/info'
import { useCoursesStore } from '@/store/coursesStore'
import { WITHDRAW_REASON_MAP } from '@/constants/withdrawReason'
import type { WithdrawalReasonFormData } from '@/schemas/modalSchemas'

export function ViewMyInfo() {
  const { accessToken, user: currentUser, setAuth } = useAuthStore()
  // 프로필 상태
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
    setCourses,
    setLoading: setCoursesLoading,
    setError: setCoursesError,
  } = useCoursesStore()
  useEffect(() => {
    const fetchAndUpdateUser = async () => {
      setProfileLoading(true)
      setProfileError(null)
      try {
        const res = await import('@/api/auth')
        if (!accessToken) throw new Error('토큰 없음')
        const info = await res.me(accessToken)
        setAuth({ accessToken: accessToken as string, user: info })
      } catch (err: any) {
        setProfileError('내 정보 조회에 실패했습니다.')
      } finally {
        setProfileLoading(false)
      }
    }
    if (!currentUser) {
      fetchAndUpdateUser()
    }
  }, [accessToken, currentUser, setAuth])

  // 수강 과정 별도 로딩/에러 관리 (zustand)
  useEffect(() => {
    const fetchCoursesData = async () => {
      setCoursesLoading(true)
      setCoursesError(null)
      try {
        const data = await getMyCourses()
        setCourses(data)
      } catch (err) {
        setCoursesError('')
      } finally {
        setCoursesLoading(false)
      }
    }
    fetchCoursesData()
  }, [setCourses, setCoursesLoading, setCoursesError])

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  /* ================= 회원 탈퇴 ================= */

  const handleWithdraw = async (
    data: WithdrawalReasonFormData
  ): Promise<void> => {
    try {
      const reason = WITHDRAW_REASON_MAP[data.reason]

      const reasonDetail =
        data.reason === 'other'
          ? data.otherReason?.trim()
          : data.feedback?.trim()

      await withdraw({
        reason,
        reason_detail: reasonDetail || '선택 안함',
      })

      alert('회원 탈퇴가 완료되었습니다.')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      {/* ================= 프로필 / 개인 정보 ================= */}
      <div className="info-border mt-[20px] w-[747px]">
        {profileLoading ? (
          <p className="text-mono-400">내 정보 불러오는 중...</p>
        ) : profileError ? (
          <p className="text-red-500">{profileError}</p>
        ) : currentUser ? (
          <>
            <InfoSection title="프로필">
              <div className="flex justify-center">
                <img
                  src={
                    currentUser.profile_img_url
                      ? currentUser.profile_img_url
                      : '/프로필 사진.svg'
                  }
                  alt="프로필 사진"
                  className="mb-[52px] h-[184px] rounded-full"
                />
              </div>

              <div className="mb-[90px] flex flex-col gap-[20px]">
                <InfoRow label="닉네임" value={currentUser.nickname} />
                <InfoRow label="이메일" value={currentUser.email} />
              </div>
            </InfoSection>

            <InfoSection title="개인 정보">
              <div className="flex flex-col gap-[20px]">
                <InfoRow label="이름" value={currentUser.name} />
                <InfoRow label="휴대전화" value={currentUser.phone_number} />
                <InfoRow
                  label="성별"
                  value={
                    unmapGender(currentUser.gender) === 'male' ? '남자' : '여자'
                  }
                />
                <InfoRow label="생년월일" value={currentUser.birthday} />
              </div>
            </InfoSection>
          </>
        ) : null}
      </div>
      {/* ================= 수강중 / 수강완료 과정 ================= */}
      <div className="info-border mt-[20px] w-[747px]">
        <p className="text-primary title-l-b">수강중인 과정</p>
        <hr className="border-mono-400 mt-[16px] mb-[40px]" />
        {coursesLoading ? (
          <p className="text-mono-400">수강 과정 불러오는 중...</p>
        ) : coursesError ? (
          <p className="text-red-500">{coursesError}</p>
        ) : courses.length === 0 ? (
          <p className="text-mono-400">현재 수강 중인 과정이 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-[24px]">
            {courses.map((item) => (
              <div
                key={`${item.course.id}-${item.cohort.id}`}
                className="flex justify-between"
              >
                <div className="flex flex-col justify-center">
                  <p className="text-mono-400 placeholder-a mb-[10px]">
                    {item.course.tag} • {item.cohort.status}
                  </p>
                  <p className="text-mono-900">
                    {item.course.name} &lt; {item.cohort.number}기 &gt;
                  </p>
                </div>

                {item.course.thumbnail_img_url ? (
                  <img
                    src={item.course.thumbnail_img_url}
                    alt="과정 썸네일"
                    className="h-[102px] w-[152px] rounded-[8px] object-cover"
                  />
                ) : (
                  <div className="bg-mono-200 h-[102px] w-[152px] rounded-[8px]" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ================= 회원 탈퇴 ================= */}
      <div className="my-[48px] flex h-[147px] items-center justify-between">
        <div className="flex w-[365px] flex-col">
          <p className="text-mono-600 text-[20px]">회원탈퇴 안내</p>
          <p className="text-mono-400 placeholder-a mt-[20px] text-[13px] leading-[18px]">
            탈퇴 처리 시, 수강 기간 / 포인트 / 쿠폰은 소멸되며 환불되지
            않습니다. 필요한 경우, 반드시 탈퇴 전에 문의 바랍니다.
          </p>
        </div>

        <button
          className="flex-center border-mono-250 bg-mono-200 h-[48px] w-[142px] rounded-[4px] border"
          onClick={() => setIsWithdrawModalOpen(true)}
        >
          회원 탈퇴하기
        </button>
      </div>

      {/* ================= 회원 탈퇴 사유 모달 ================= */}
      <WithdrawalReasonModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={handleWithdraw}
      />
    </>
  )
}

function InfoSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <p className="text-primary title-l-b">{title}</p>
      <hr className="border-mono-400 mt-[16px] mb-[40px]" />
      {children}
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center">
      <p className="infoText w-[120px] shrink-0">{label}</p>
      <p className="text-mono-900">{value}</p>
    </div>
  )
}
