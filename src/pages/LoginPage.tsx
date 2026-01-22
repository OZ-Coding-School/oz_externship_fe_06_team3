import { useState } from 'react'
import kakao_logo from '../assets/LoginPage_img/kakao_logo.svg'
import naver_logo from '../assets/LoginPage_img/naver_logo.svg'
import ozcoding_logo from '../assets/LoginPage_img/ozcoding_logo.png'
import { CommonInput } from '@/components/common/CommonInput'
import { Password } from '@/components/common/Password'

const LoginPage = () => {
  // 1️⃣ 입력 필드 상태
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // 유효성 검사
  const isEmailValid = email.includes('@')
  const isPasswordValid = password.length >= 6 && password.length <= 15

  const isFormValid = isEmailValid && isPasswordValid

  // 2️⃣ 일반 로그인
  const handleLogin = (): void => {
    if (!isFormValid) return

    // TODO: 로그인 API 연동
    console.log('일반 로그인')
  }

  // 3️⃣ 소셜 로그인
  const handleKakaoLogin = (): void => {
    // TODO: 카카오 OAuth 이동
    console.log('카카오 로그인')
  }

  const handleNaverLogin = (): void => {
    // TODO: 네이버 OAuth 이동
    console.log('네이버 로그인')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
      <div className="flex w-[360px] flex-col">
        {/* 타이틀 */}
        <img src={ozcoding_logo} alt="ozcoding_logo" className="w-48 mx-auto" />

        {/* 5️⃣ 회원가입 유도 */}
        <p className="text-sm text-center mt-4">
          아직 회원이 아니신가요?{' '}
          <span className="cursor-pointer font-medium text-purple-600">
            회원가입 하기
          </span>
        </p>

        {/* 3️⃣ 소셜 로그인 */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleKakaoLogin}
            className="rounded bg-[#FEE500] py-3 text-black flex items-center justify-center gap-2"
          >
            <img src={kakao_logo} alt="kakao" className="w-4 h-4"/>
            카카오 간편 로그인 / 가입
          </button>

          <button
            onClick={handleNaverLogin}
            className="rounded bg-[#03C75A] py-3 text-white flex items-center justify-center gap-2"
          >
            <img src={naver_logo} alt="naver" className="w-4 h-4" />
            네이버 간편 로그인 / 가입
          </button>
        </div>

        {/* 이메일 */}
        <div className="mt-8 flex flex-col gap-3">
          <CommonInput
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={setEmail}
            width="100%"
          />

          {/* 비밀번호 */}
          <Password
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={setPassword}
            width="100%"
          />
        </div>

        {/* 계정 찾기 */}
        <div className="text-sm text-gray-600 mt-2">
          <span className="cursor-pointer hover:underline">아이디 찾기</span>
          <span className="mx-1">|</span>
          <span className="cursor-pointer hover:underline">비밀번호 찾기</span>
        </div>

        {/* 일반 로그인 버튼 */}
        <button
          onClick={handleLogin}
          disabled={!isFormValid}
          className={`mt-8 rounded py-3 text-white transition ${
            isFormValid
              ? 'bg-gray-800 hover:bg-gray-900'
              : 'cursor-not-allowed bg-gray-300'
          }`}
        >
          일반회원 로그인
        </button>
      </div>
    </div>
  )
}

export default LoginPage
