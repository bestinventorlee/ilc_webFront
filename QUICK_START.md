# 빠른 시작 가이드

## "Failed to fetch" 오류 해결

이 오류는 백엔드 서버가 실행되지 않아서 발생합니다.

## 해결 방법

### 1. 백엔드 서버 실행 (필수!)

**새 터미널 창을 열고:**

```bash
cd server
npm install
npm run dev
```

서버가 성공적으로 시작되면 다음과 같은 메시지가 표시됩니다:
```
🚀 서버가 http://localhost:3000 에서 실행 중입니다.
📊 데이터베이스: ./server/data/users.json
✅ 데이터베이스 파일 생성 완료
```

### 2. 프론트엔드 실행 (다른 터미널)

**또 다른 새 터미널 창을 열고:**

```bash
npm run dev
```

### 3. 접속

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:3000
- 헬스 체크: http://localhost:3000/health

## 중요 사항

⚠️ **두 개의 터미널이 필요합니다:**
1. 첫 번째 터미널: 백엔드 서버 (`cd server && npm run dev`)
2. 두 번째 터미널: 프론트엔드 (`npm run dev`)

## 문제 해결

### 서버가 시작되지 않는 경우

1. `server` 폴더에 `node_modules`가 있는지 확인
2. 없다면: `cd server && npm install` 실행
3. 포트 3000이 이미 사용 중인지 확인
4. 다른 포트를 사용하려면: `PORT=3001 npm run dev`

### 여전히 연결이 안 되는 경우

1. 브라우저 콘솔에서 정확한 에러 메시지 확인
2. `http://localhost:3000/health`를 브라우저에서 직접 열어보기
3. 서버 터미널에서 에러 메시지 확인

