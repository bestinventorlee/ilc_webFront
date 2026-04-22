# 서버 실행 가이드

## 백엔드 서버 실행 방법

### 방법 1: 새 터미널 창에서 실행 (권장)

1. **새 PowerShell 또는 CMD 창을 엽니다**

2. **서버 디렉토리로 이동:**
```powershell
cd D:\cursor2\server
```

3. **의존성이 없다면 설치:**
```powershell
npm.cmd install
```

4. **서버 실행:**
```powershell
npm.cmd run dev
```

### 방법 2: 프로젝트 루트에서 실행

```powershell
cd D:\cursor2
npm.cmd run server:dev
```

## 서버가 정상 실행되면

다음과 같은 메시지가 표시됩니다:
```
🚀 서버가 http://localhost:3000 에서 실행 중입니다.
📊 데이터베이스: ./server/data/users.json
✅ 사용자 데이터베이스 파일 생성 완료
✅ Refresh Token 데이터베이스 파일 생성 완료
```

## 서버 확인

브라우저에서 다음 URL을 열어보세요:
- http://localhost:3000/health

다음과 같은 응답이 보이면 정상입니다:
```json
{
  "status": "ok",
  "message": "ILC 회원 포털 API 서버"
}
```

## 문제 해결

### 포트 3000이 이미 사용 중인 경우

다른 포트를 사용하려면:
```powershell
$env:PORT=3001; npm.cmd run dev
```

그리고 프론트엔드의 `.env` 파일에 추가:
```
VITE_API_URL=http://localhost:3001/api
```

### 서버가 시작되지 않는 경우

1. **의존성 확인:**
```powershell
cd D:\cursor2\server
npm.cmd install
```

2. **에러 메시지 확인:**
   - 서버 터미널에서 에러 메시지 확인
   - 빨간색 에러 메시지가 있는지 확인

3. **Node.js 버전 확인:**
```powershell
node --version
```
   - Node.js 18 이상이어야 합니다.

## 중요 사항

⚠️ **백엔드 서버는 별도의 터미널 창에서 실행해야 합니다!**

- 프론트엔드와 백엔드는 **동시에 실행**되어야 합니다
- 백엔드 서버가 실행되지 않으면 회원가입/로그인이 작동하지 않습니다

