import { useState } from 'react'
import { Link } from 'react-router'
import main_banner from '@/assets/LandingPage_img/main_banner.png'
import main_exam from '@/assets/LandingPage_img/main_exam.png'
import main_qna from '@/assets/LandingPage_img/main_qna.png'
import main_community from '@/assets/LandingPage_img/main_community.png'

type TabType = 'exam' | 'qna' | 'community'

function LandingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('exam')

  const getImageByTab = (tab: TabType) => {
    switch (tab) {
      case 'exam':
        return main_exam
      case 'qna':
        return main_qna
      case 'community':
        return main_community
      default:
        return main_exam
    }
  }

  return (
    <div>
      <section className='flex flex-col items-center justify-center'>
        <div className='w-full bg-[#FAFAFB]'>
        <div className='flex flex-col items-center justify-center h-screen bg-[#FAFAFB] pt-20'>
          <div className='w-full max-w-[1200px] px-5'>
            <h1 className='text-5xl font-bold text-center leading-normal'>쪽지 시험으로 <br/>
            실력을 차곡차곡 쌓아보세요</h1>
            <div className='flex flex-row gap-2 px-2 py-2 my-10 bg-white rounded-full justify-center w-fit mx-auto'>
              <button 
                onClick={() => setActiveTab('exam')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'exam' 
                    ? 'bg-[#6201E0] text-white' 
                    : 'bg-white text-black'
                }`}
              >
                쪽지시험
              </button>
              <button 
                onClick={() => setActiveTab('qna')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'qna' 
                    ? 'bg-[#6201E0] text-white' 
                    : 'bg-white text-black'
                }`}
              >
                질의응답
              </button>
              <button 
                onClick={() => setActiveTab('community')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'community' 
                    ? 'bg-[#6201E0] text-white' 
                    : 'bg-white text-black'
                }`}
              >
                커뮤니티
              </button>
            </div>
            <div className='w-full'>
              <img src={getImageByTab(activeTab)} alt={`main_${activeTab}`} className='w-full h-auto' />
            </div>
          </div>
        </div>
        </div>
        <div className='py-40'>
        <Link to="/qna">
          <img src={main_banner} alt="main_banner" className="cursor-pointer" />
        </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
