import { BrowserRouter, Routes, Route } from 'react-router'
import '@/App.css'
import LandingPage from '@/pages/LandingPage'
import Header from '@/components/Heade'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/qna" element={<div>질의응답 페이지 (구현 예정)</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
