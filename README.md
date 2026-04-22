# ILC 회원 포털

ILC 회원권 및 이용권 구매자만 접근 가능한 회원 전용 웹사이트입니다.

## 기술 스택

### 프론트엔드
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **CSS3** - 스타일링

### 백엔드
- **Node.js** - 서버 런타임
- **Express** - 웹 프레임워크
- **TypeScript** - 타입 안정성
- **bcryptjs** - 비밀번호 해싱
- **JSON 파일** - 데이터 저장소 (현재)
  - 향후 SQLite, PostgreSQL 등으로 쉽게 마이그레이션 가능

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

#### 1. 프론트엔드 의존성 설치
```bash
npm install
```

#### 2. 백엔드 의존성 설치
```bash
npm run server:install
```

또는 직접:
```bash
cd server
npm install
```

#### 3. 개발 서버 실행

**터미널 1 - 백엔드 서버:**
```bash
npm run server:dev
```

**터미널 2 - 프론트엔드:**
```bash
npm run dev
```

#### 4. 접속

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:3000
- 헬스 체크: http://localhost:3000/health

## 프로젝트 구조

```
ilc-member-portal/
├── src/                          # 프론트엔드 소스
│   ├── components/
│   │   └── LandingPage.tsx      # 첫 화면 컴포넌트
│   ├── services/
│   │   └── authService.ts       # API 서비스
│   ├── types/
│   │   └── auth.ts              # 타입 정의
│   ├── utils/
│   │   └── validation.ts       # 유효성 검사
│   ├── App.tsx
│   └── main.tsx
├── server/                       # 백엔드 서버
│   ├── src/
│   │   ├── database/
│   │   │   └── db.ts           # 데이터베이스 설정
│   │   ├── models/
│   │   │   └── User.ts         # 사용자 모델
│   │   ├── routes/
│   │   │   └── auth.ts         # 인증 라우트
│   │   └── index.ts            # 서버 진입점
│   ├── data/
│   │   └── users.json           # 사용자 데이터 (자동 생성)
│   └── package.json
├── package.json
└── README.md
```

## 주요 기능

### 첫 화면 (Landing Page)

- **히어로 섹션**: 프로젝트 소개 및 로그인/회원가입 폼
- **프로젝트 소개**: ILC 프로젝트의 비전, 목표, 로드맵
- **주요 기능 소개**: 6가지 핵심 기능 카드
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

### 회원가입 기능

- ✅ 이메일/비밀번호 기반 회원가입
- ✅ 실시간 유효성 검사
- ✅ 비밀번호 해싱 (bcrypt)
- ✅ 이메일 중복 확인
- ✅ 데이터베이스 저장 (JSON 파일)

## API 엔드포인트

### 회원가입
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "홍길동",
  "email": "user@example.com",
  "password": "password123"
}
```

### 헬스 체크
```
GET /health
```

## 데이터베이스

현재는 JSON 파일 기반으로 데이터를 저장합니다. (`server/data/users.json`)

### SQLite로 마이그레이션

더 강력한 데이터베이스가 필요하면:

1. `better-sqlite3` 설치 (Windows에서는 Visual Studio Build Tools 필요)
2. `server/src/database/db.ts` 파일을 SQLite 버전으로 교체
3. `server/src/models/User.ts`의 쿼리 로직 수정

### PostgreSQL로 마이그레이션

프로덕션 환경에서는 PostgreSQL 사용을 권장합니다:

1. `pg` 패키지 설치
2. 데이터베이스 연결 설정
3. 스키마 및 마이그레이션 파일 생성

## 다음 단계

- [x] 인증 시스템 구현
- [x] 데이터베이스 연동
- [ ] 로그인 기능 구현
- [ ] JWT 토큰 인증
- [ ] 회원권 인증 연동
- [ ] 대시보드 페이지
- [ ] 커뮤니티 기능
- [ ] 알림 시스템

## 라이선스

Copyright © 2024 ILC. All rights reserved.
