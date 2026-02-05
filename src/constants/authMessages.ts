// 로그인/회원가입/아이디찾기 등 화면에 보이는 문구 모음 (에러, 안내, 버튼 라벨)
export const AUTH_MESSAGES = {
  common: {
    // 네트워크 오류
    networkError: '* 네트워크 연결을 확인해주세요.',
    // 500대 서버 오류
    serverError: '* 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    // 제출 버튼 처리 중
    submitBusy: '처리 중...',
    // 가입하기 버튼
    submitLabel: '가입하기',
  },
  // 폼 검증 실패 안내 (회원가입)
  form: {
    birthdateFormat: '* 8자리로 입력해주세요. (예: 20000101)',
    requireNicknameCheck: '* 닉네임 중복확인을 진행해주세요.',
    requireEmailVerify: '* 이메일 인증을 완료해주세요.',
    requireSmsVerify: '* 휴대폰 인증을 완료해주세요.',
    signupDuplicate: '* 이미 가입된 정보이거나 중복된 회원가입 내역입니다.',
    signupBadRequest: '* 입력값을 다시 확인해주세요.',
    signupFailed: '* 회원가입에 실패했습니다. 입력값을 다시 확인해주세요.',
  },
  email: {
    identityInvalid: '* 올바른 이메일 형식을 입력해주세요.',
    sendSuccess: '* 인증코드를 전송했습니다.',
    sendResent: '* 인증코드를 재전송했습니다.',
    sendErrorAlreadyRegistered: '* 이미 가입된 이메일입니다.',
    sendErrorBadRequest: '* 이메일 형식을 확인해주세요.',
    sendErrorFallback: '* 이메일 인증 코드 전송에 실패했습니다.',
    codeRequired: '* 인증코드를 입력해주세요.',
    expired: '* 인증 시간이 만료되었습니다. 인증코드를 다시 요청해주세요.',
    verifySuccess: '* 이메일 인증이 완료되었습니다.',
    verifyErrorMismatch: '* 인증코드가 일치하지 않습니다.',
    verifyErrorAlreadyRegistered: '* 이미 가입된 이메일입니다.',
    verifyErrorFallback: '* 이메일 인증에 실패했습니다.',
  },
  sms: {
    identityInvalid: '* 휴대전화 번호를 올바르게 입력해주세요.',
    phoneDigitError: '* 4자리 입력',
    sendSuccess: '* 인증번호를 전송했습니다.',
    sendResent: '* 인증번호를 재전송했습니다.',
    sendErrorAlreadyRegistered: '* 이미 가입에 사용된 휴대전화 번호입니다.',
    sendErrorBadRequest: '* 휴대전화 번호 형식을 확인해주세요.',
    sendErrorFallback: '* 휴대폰 인증번호 전송에 실패했습니다.',
    codeRequired: '* 인증번호를 입력해주세요.',
    expired: '* 인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.',
    verifySuccess: '* 휴대폰 인증이 완료되었습니다.',
    verifyErrorMismatch: '* 인증코드가 일치하지 않습니다.',
    verifyErrorAlreadyRegistered: '* 이미 가입에 사용된 휴대전화 번호입니다.',
    verifyErrorFallback: '* 휴대폰 인증에 실패했습니다.',
  },
  nickname: {
    available: '* 사용 가능한 닉네임입니다.',
    duplicated: '* 이미 사용 중인 닉네임입니다.',
    invalidFormat: '* 닉네임 형식을 확인해주세요.',
    checkFailed: '* 닉네임 중복 확인에 실패했습니다.',
  },
  password: {
    required: '* 비밀번호를 먼저 입력해주세요.',
    invalidFormat: '* 비밀번호 형식이 올바르지 않습니다.',
    match: '* 비밀번호가 일치합니다.',
    mismatch: '* 비밀번호가 일치하지 않습니다.',
    available: '* 사용 가능한 비밀번호입니다.',
    formatHint: '6~15자의 영문 대소문자, 숫자, 특수문자 포함',
  },
  buttons: {
    resend: '재전송',
    emailSend: '인증코드 전송',
    smsSend: '인증번호 받기',
    // 아이디 찾기
    findId: {
      sendCode: '인증번호전송',
      verifyCode: '인증번호확인',
      submit: '아이디 찾기',
    },
    /** 비밀번호 찾기 */
    findPassword: {
      sendCode: '인증코드전송',
      verifyCode: '인증코드확인',
      submit: '비밀번호 찾기',
    },
  },
  /** 로그인 페이지 */
  login: {
    formError: '* 아이디 또는 비밀번호가 올바르지 않습니다.',
    submitLabel: '일반회원 로그인',
    submitBusy: '로그인 중...',
  },
  // 비밀번호 찾기
  findPassword: {
    defaultGuide: '이메일로 비밀번호 재설정 링크를 보내드려요.',
    defaultGuideAfterSend:
      '입력하신 이메일로 인증코드를 전송했어요. 인증코드를 입력해 인증을 완료해 주세요.',
    sendSuccess: '* 인증코드를 전송했습니다.',
    verifySuccess: '* 인증이 완료되었습니다.',
    expired: '* 인증 시간이 만료되었습니다. 인증코드를 다시 요청해주세요.',
    verifyRequired: '* 이메일 인증을 완료해주세요.',
  },
  // 비밀번호 재설정
  resetPassword: {
    submitLabel: '확인',
    noTokenMessage: '인증 정보가 없습니다. 비밀번호 찾기부터 진행해주세요.',
    toastSuccess: '비밀번호 변경 완료!',
    toastRedirectMessage: '잠시 후 로그인 페이지로 이동합니다.',
    failed: '* 비밀번호 재설정에 실패했습니다. 다시 시도해주세요.',
    tokenInvalid: '* 이메일 인증을 다시 진행해주세요.',
  },
  // 비밀번호 변경 (내 정보)
  changePassword: {
    success: '비밀번호 변경 성공.',
    failed: '* 비밀번호 변경에 실패했습니다. 다시 시도해주세요.',
    unauthorized: '* 로그인 정보가 필요합니다.',
  },
  // 아이디 찾기
  findId: {
    defaultGuide: '이름과 휴대전화를 입력하고 인증번호를 요청해주세요.',
    defaultGuideAfterSend:
      '입력하신 휴대전화로 인증번호를 전송했어요. 인증번호를 입력해 인증을 완료해 주세요.',
    sendSuccess: '인증번호를 전송했습니다.',
    verifySuccess: '* 인증이 완료되었습니다.',
    notFound:
      '* 입력한 이름과 휴대폰 번호로 등록된\n이메일이 존재하지 않습니다.',
    findFailed: '* 아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.',
    verifyRequired: '* 인증번호를 먼저 확인해주세요.',
    expired: '* 인증 시간이 만료되었습니다. 다시 전송해주세요.',
  },
} as const
