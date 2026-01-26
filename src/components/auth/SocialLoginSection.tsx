import { Button } from '@/components/common/Button'

export type SocialProviderId = 'kakao' | 'naver'

const SOCIAL_PROVIDERS = [
  {
    id: 'kakao' as const,
    variant: 'kakao' as const,
    logo: '/LoginPage_img/kakao_logo.svg',
    alt: 'Kakao',
    label: '카카오 간편 로그인 / 가입',
    textClass: 'text-[#391C1A]',
    logoClass: 'h-3 w-[13px]',
  },
  {
    id: 'naver' as const,
    variant: 'naver' as const,
    logo: '/LoginPage_img/naver_logo.svg',
    alt: 'Naver',
    label: '네이버 간편 로그인 / 가입',
    textClass: 'text-white',
    logoClass: 'h-[13px] w-[13px]',
  },
]

type Props = {
  onLogin: (provider: SocialProviderId) => void
}

export default function SocialLoginSection({ onLogin }: Props) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      {SOCIAL_PROVIDERS.map((p) => (
        <Button
          key={p.id}
          type="button"
          variant={p.variant}
          onClick={() => onLogin(p.id)}
          className="h-[52px] w-full gap-2.5 rounded px-2 py-2"
        >
          <div className="inline-flex items-center gap-1">
            <div className="flex w-5 flex-col items-center justify-center gap-2.5 px-[3px] py-1">
              <img className={p.logoClass} alt={p.alt} src={p.logo} />
            </div>
            <p
              className={`text-[16px] font-normal tracking-[-0.32px] whitespace-nowrap ${p.textClass}`}
            >
              {p.label}
            </p>
          </div>
        </Button>
      ))}
    </div>
  )
}
