# Externship Project Template

## 실행 방법

### 실백엔드 테스트

```bash
# .env에서 VITE_USE_MSW=false (기본값) 로 설정 후
npm run dev
```

→ `/api/v1/accounts/login/` 등 실제 서버로 API 호출

### 목 데이터 개발 (MSW)

```bash
# .env에서 VITE_USE_MSW=true 로 설정 후
npm run dev
```

→ MSW로 목업된 API 사용
