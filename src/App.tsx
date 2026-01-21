import { BrowserRouter, Routes, Route } from 'react-router'
import '@/App.css'
import LandingPage from '@/pages/LandingPage'
import TestPage from './pages/TestPage'
import Header from './components/common/Header'
import MyPage from './pages/MyPage'
import MyPageQuiz from './components/MyPageQuiz'


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/qna" element={<div>질의응답 페이지 (구현 예정)</div>} />
        <Route path="/test" element={<TestPage />} />

        {/* 마이페이지 및 하위컴포넌트 연결 */}
        <Route path="/mypage" element={<MyPage />}>
          <Route path="quiz" element={<MyPageQuiz />} />
          <Route path="profile" element={<div>내 정보</div>} />
          <Route path="password" element={<div>비밀번호 변경</div>} />
        </Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App
