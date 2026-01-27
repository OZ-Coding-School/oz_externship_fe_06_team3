import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import '@/App.css'
import LandingPage from '@/pages/LandingPage'
import TestPage from '@/pages/TestPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import MyPage from '@/pages/MyPage'
import MyPageQuiz from '@/components/MyPageQuiz'
import QuizPage from '@/pages/QuizPage'
import MainLayout from '@/components/layout/MainLayout'
import { RequireAuth } from '@/components/auth/RequireAuth'
import MyInfo from './components/MyInfo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 헤더가 포함된 페이지 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/qna" element={<div>질의응답 페이지</div>} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 로그인이 필요한 페이지 */}
          <Route element={<RequireAuth />}>
            <Route path="/mypage" element={<MyPage />}>
              <Route path="quiz" element={<MyPageQuiz />} />
              <Route path="profile" element={<MyInfo />} />
              <Route path="password" element={<div>비밀번호 변경</div>} />
            </Route>
          </Route>
        </Route>

        {/* 헤더가 필요 없는 페이지 (레이아웃 밖으로 배치) */}
        <Route element={<RequireAuth />}>
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:deploymentId" element={<QuizPage />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  )
}
export default App
