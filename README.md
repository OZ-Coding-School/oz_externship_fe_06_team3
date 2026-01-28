# Externship Project Template

## 로그인 / 회원가입 구현 요약 (담당자: 최진명)

### 로그인 (Login)

- `schemas/auth.ts`의 `loginSchema`(Zod) + `react-hook-form`을 사용해 입력값(이메일/비밀번호)을 즉시 검증합니다.
- 로그인 제출 시 `authApi.login({ email, password })` 호출 → 성공하면 `access_token`을 저장합니다.
- 이후 `authApi.me()`로 내 정보를 조회해 `user` 상태를 채우고, `isAuthenticated=true`로 로그인 상태를 확정합니다.
- 전역 인증 상태는 `useAuthStore`(Zustand persist)에 저장되어 새로고침 후에도 유지됩니다.

### 회원가입 (Signup)

- `schemas/auth.ts`의 `signupSchema`(Zod)로 이름/닉네임/생년월일/성별/이메일/휴대폰/비밀번호 유효성을 검증합니다.
- 페이지 로직은 `useSignupEmailForm` 훅에서 관리하며 `values / ui / messages / actions`로 화면에 필요한 값만 내려줍니다.
- 가입 전 필수 단계:
  1. 닉네임 중복 확인: `authApi.checkNickname`
  2. 이메일 인증: `useVerificationFlow`로 코드 전송(`sendEmailVerification`) → 코드 확인(`verifyEmail`) → `email_token` 저장
  3. 휴대폰 인증: `useVerificationFlow`로 코드 전송(`sendSmsVerification`) → 코드 확인(`verifySms`) → `sms_token` 저장
- 최종 가입 시 `authApi.signup` 호출(payload에 `email_token`, `sms_token` 포함).
- 가입 성공 후 `useAuthStore().login`을 호출해 자동 로그인 처리 후 메인 페이지로 이동합니다.
