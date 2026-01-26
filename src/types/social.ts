export type SocialProviderId = 'kakao' | 'naver'

export type SocialProvider = {
  id: SocialProviderId
  label: string
  bgClass: string
  textClass: string
  logo: string
  logoAlt: string
}
