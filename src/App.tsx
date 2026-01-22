import { BrowserRouter, Routes, Route, useLocation } from 'react-router'
import '@/App.css'
import LandingPage from '@/pages/LandingPage'
import TestPage from '@/pages/TestPage'
import { Header } from '@/components/common'
import MyPage from '@/pages/MyPage'
import MyPageQuiz from '@/components/MyPageQuiz'
import QuizPage from './pages/QuizPage'

function AppContent() {
  const location = useLocation();
  // 퀴즈 페이지일 때는 공통 Header를 숨깁니다.
  const showHeader = location.pathname !== '/quiz';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/qna" element={<div>질의응답 페이지 (구현 예정)</div>} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/quiz" element={<QuizPage />} />

        {/* 마이페이지 및 하위컴포넌트 연결 */}
        <Route path="/mypage" element={<MyPage />}>
          <Route path="quiz" element={<MyPageQuiz />} />
          <Route path="profile" element={<div>내 정보</div>} />
          <Route path="password" element={<div>비밀번호 변경</div>} />
        </Route>
      </Routes>
    </>
  )
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App