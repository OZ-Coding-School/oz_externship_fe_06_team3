interface NotFoundProps {
  detail?: string
}

const NotFound = ({ detail = '아직 응시할 시험이 없어요.' }: NotFoundProps) => {
  return (
    <div className="flex h-[124px] w-[220px] flex-col items-center justify-center gap-5">
      <img src="/icons/not_found.svg" alt="not-found" className="h-[58px] w-[74px]" />
      <p className="text-mono-600 text-center text-[20px] leading-[140%] font-normal tracking-[-0.6px]">
        {detail}
      </p>
    </div>
  )
}

export default NotFound
