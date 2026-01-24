import { BrowserRouter, Routes, Route } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@/App.css'
import LandingPage from '@/pages/LandingPage'
import TestPage from '@/pages/TestPage'
import LoginPage from '@/pages/LoginPage'
import MyPage from '@/pages/MyPage'
import MyPageQuiz from '@/components/MyPageQuiz'
import QuizPage from './pages/QuizPage'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 헤더가 포함된 레이아웃을 적용할 페이지들 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/qna" element={<div>질의응답 페이지</div>} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* 마이페이지와 그 하위 페이지 */}
          <Route path="/mypage" element={<MyPage />}>
            <Route path="quiz" element={<MyPageQuiz />} />
            <Route path="profile" element={<div>내 정보</div>} />
            <Route path="password" element={<div>비밀번호 변경</div>} />
          </Route>
        </Route>

        {/* 2. 헤더가 필요 없는 페이지 (레이아웃 밖으로 배치) */}
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  );
}

export default App