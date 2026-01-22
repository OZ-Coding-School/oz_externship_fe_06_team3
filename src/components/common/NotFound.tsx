import { notFound } from '@/assets/icons'

interface NotFoundProps {
  detail?: string
}

const NotFound = ({ detail = '아직 응시할 시험이 없어요.' }: NotFoundProps) => {
  return (
    <div className="flex h-[124px] w-[220px] flex-col items-center justify-center gap-5">
      <img src={notFound} alt="not-found" className="h-[58px] w-[74px]" />
      <p className="text-center text-[20px] font-normal leading-[140%] tracking-[-0.6px] text-[#9D9D9D]">
        {detail}
      </p>
    </div>
  )
}

export default NotFound
