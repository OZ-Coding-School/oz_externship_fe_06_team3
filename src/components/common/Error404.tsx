import { cloud404 } from '@/assets/icons'

const Error404 = () => {
  return (
    <div className="flex h-[124px] w-[220px] flex-col items-center justify-center gap-5">
      <img src={cloud404} alt="404" className="h-[58px] w-[74px]" />
      <p className="text-center text-[20px] font-normal leading-[140%] tracking-[-0.6px] text-[#9D9D9D]">
        페이지를 불러올 수 없어요
        <br />
        잠시 뒤 다시 시도해보세요
      </p>
    </div>
  )
}

export default Error404
