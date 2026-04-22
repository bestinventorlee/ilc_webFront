# 이중 토큰 시스템 설명

## 개요

현재 시스템은 **이중 토큰 방식(Dual Token System)**을 사용합니다:
- **Access Token**: 짧은 만료 시간 (15분)
- **Refresh Token**: 긴 만료 시간 (15일)

## 토큰 동작 방식

### 1. 회원가입/로그인 시

```
사용자 인증 성공
    ↓
Access Token 생성 (15분 만료)
    ↓
Refresh Token 생성 (15일 만료, 랜덤 문자열)
    ↓
Refresh Token을 데이터베이스에 저장
    ↓
두 토큰 모두 클라이언트에 반환
```

### 2. API 요청 시

```
클라이언트가 API 요청
    ↓
Authorization 헤더에 Access Token 포함
    ↓
서버에서 Access Token 검증
    ↓
✅ 유효 → 요청 처리
❌ 만료 → 401 에러 반환
```

### 3. Access Token 만료 시 (15분 후)

```
Access Token 만료 감지
    ↓
클라이언트가 Refresh Token으로 새 Access Token 요청
    ↓
POST /api/auth/refresh
    ↓
서버에서 Refresh Token 검증
    ↓
✅ 유효 → 새 Access Token 발급
❌ 만료/무효 → 401 에러, 재로그인 필요
```

### 4. Refresh Token 만료 시 (7일 후)

```
Refresh Token 만료
    ↓
토큰 갱신 시도
    ↓
서버에서 Refresh Token 검증 실패
    ↓
401 에러 반환
    ↓
클라이언트: 토큰 삭제 및 로그인 페이지로 리다이렉트
```

## 보안 장점

### 1. **짧은 Access Token 만료 시간**
- Access Token이 탈취되어도 15분 후 자동 만료
- 민감한 작업에 대한 보안 강화

### 2. **Refresh Token 관리**
- Refresh Token은 데이터베이스에 저장
- 로그아웃 시 즉시 무효화 가능
- 토큰 탈취 시 즉시 차단 가능

### 3. **자동 토큰 갱신**
- 사용자는 로그인 상태를 유지하면서 자동으로 토큰 갱신
- 사용자 경험 향상

## 토큰 만료 시나리오

### 시나리오 1: Access Token 만료 (15분)

```
1. 사용자가 API 요청
2. Access Token 만료 감지
3. 자동으로 Refresh Token으로 새 Access Token 요청
4. 새 Access Token 받아서 원래 요청 재시도
5. ✅ 성공적으로 처리
```

### 시나리오 2: Refresh Token 만료 (15일 후)

```
1. 사용자가 API 요청
2. Access Token 만료 감지
3. Refresh Token으로 갱신 시도
4. Refresh Token도 만료됨
5. ❌ 401 에러
6. 클라이언트: 토큰 삭제 및 로그인 페이지로 이동
7. 사용자: 다시 로그인 필요
```

### 시나리오 3: 로그아웃

```
1. 사용자가 로그아웃 요청
2. Refresh Token을 서버에서 삭제
3. 클라이언트에서 토큰 삭제
4. ✅ 완전히 로그아웃됨
```

## 환경 변수 설정

`.env` 파일에서 설정 가능:

```env
# Access Token 만료 시간 (기본: 15분)
ACCESS_TOKEN_EXPIRES_IN=15m

# Refresh Token 만료 시간 (기본: 15일)
REFRESH_TOKEN_EXPIRES_IN=15d

# JWT 시크릿 키
JWT_SECRET=your-secret-key

# Refresh Token 시크릿 키 (선택사항)
REFRESH_TOKEN_SECRET=your-refresh-secret-key
```

## API 엔드포인트

### 토큰 갱신
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}

Response:
{
  "success": true,
  "message": "토큰이 갱신되었습니다.",
  "data": {
    "accessToken": "new-access-token"
  }
}
```

### 로그아웃
```
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}

Response:
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

## 프론트엔드 사용법

### 토큰 저장
```typescript
import { saveTokens } from './utils/token'

// 회원가입/로그인 후
saveTokens(accessToken, refreshToken)
```

### 토큰 갱신
```typescript
import { refreshAccessToken } from './utils/token'

// Access Token 만료 시 자동 갱신
const newToken = await refreshAccessToken()
if (newToken) {
  // 새 토큰으로 요청 재시도
}
```

### 로그아웃
```typescript
import { removeTokens, getRefreshToken } from './utils/token'
import { logout } from './services/authService'

const refreshToken = getRefreshToken()
if (refreshToken) {
  await logout(refreshToken)
}
removeTokens()
```

## 데이터베이스 구조

### Refresh Token 저장
```json
[
  {
    "token": "랜덤-64바이트-문자열",
    "userId": 1,
    "email": "user@example.com",
    "createdAt": "2024-11-16T10:00:00.000Z",
    "expiresAt": "2024-11-23T10:00:00.000Z"
  }
]
```

## 보안 권장사항

1. **프로덕션 환경**:
   - 강력한 JWT_SECRET 사용
   - HTTPS 필수
   - Refresh Token을 HttpOnly Cookie에 저장 고려

2. **토큰 저장**:
   - 현재: localStorage (개발용)
   - 프로덕션: HttpOnly Cookie 권장

3. **토큰 만료 시간**:
   - Access Token: 15분~1시간
   - Refresh Token: 15일~30일 (현재: 15일)

4. **토큰 무효화**:
   - 로그아웃 시 즉시 삭제
   - 의심스러운 활동 감지 시 즉시 무효화

