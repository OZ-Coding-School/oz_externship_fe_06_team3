// 타이틀과 서브타이틀 내용 정의
const title = "쪽지시험 응시 결과"
const subtitle = "고생 많으셨어요😊 틀린 문제는 해설을 보며 꼭 복습해보세요. 앞으로의 성장을 기대하겠습니다!"

// 스타일 정의
const titleStyle = "text-[32px] font-bold text-[#121212]"
const subtitleStyle = "text-[16px] font-normal text-[#4D4D4D]"

const QuizResultTop = () => {
  return (
    <div className="flex-center bg-[#EFE6FC] w-full h-[118px]">
        <div className="flex flex-col items-start justify-center gap-2 w-[1180px]">
            <h1 className={titleStyle}>{title}</h1>
            <p className={subtitleStyle}>{subtitle}</p>
        </div>
    </div>
  )
}

export default QuizResultTop