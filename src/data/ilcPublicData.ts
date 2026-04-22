/** 참고: 회원 커뮤니티 웹사이트.zip 내 공지·프로젝트 정적 데이터 */

export type PublicAnnouncement = {
  id: number
  title: string
  date: string
  author: string
  isPinned: boolean
  excerpt: string
  content: string
}

export const publicAnnouncements: PublicAnnouncement[] = [
  {
    id: 1,
    title: '2026년 상반기 프로젝트 킥오프 안내',
    date: '2026-04-05',
    author: '관리자',
    isPinned: true,
    excerpt: '2026년 상반기 주요 프로젝트 일정 및 참여 방법을 안내드립니다.',
    content: `
안녕하세요, ILC 회원 여러분.

2026년 상반기 프로젝트 킥오프 미팅을 아래와 같이 진행하고자 합니다.

## 일시 및 장소
- **일시**: 2026년 4월 20일 (토) 오후 2시
- **장소**: ILC 본관 대회의실
- **온라인**: Zoom 링크 별도 공지

## 안건
1. 상반기 프로젝트 소개 및 목표 공유
2. 팀 구성 및 역할 분담
3. 일정 및 마일스톤 설정
4. Q&A 세션

## 참여 방법
참여를 원하시는 회원분들은 4월 15일까지 회원 포털에서 신청해 주시기 바랍니다.

많은 관심과 참여 부탁드립니다.

감사합니다.
    `,
  },
  {
    id: 2,
    title: '4월 정기 회원 모임 공지',
    date: '2026-04-01',
    author: '운영팀',
    isPinned: true,
    excerpt: '4월 정기 회원 모임이 4월 15일 진행될 예정입니다.',
    content: `
ILC 회원 여러분께,

4월 정기 회원 모임을 아래와 같이 개최합니다.

## 모임 정보
- **일시**: 2026년 4월 15일 (화) 오후 7시
- **장소**: 강남구 테헤란로 123 카페 베이스먼트
- **참가비**: 무료 (간단한 다과 제공)

## 프로그램
- 7:00 - 7:30: 네트워킹 및 자유 대화
- 7:30 - 8:00: 3월 활동 리뷰 및 4월 계획
- 8:00 - 8:30: 신규 회원 소개
- 8:30 - 9:00: 자유 토론 및 마무리

편안한 분위기에서 서로 교류하는 시간이 되었으면 합니다.

많은 참여 바랍니다!
    `,
  },
  {
    id: 3,
    title: '신규 회원 환영합니다',
    date: '2026-03-28',
    author: '관리자',
    isPinned: false,
    excerpt: '3월에 가입하신 신규 회원분들을 환영합니다.',
    content: `
3월 한 달 동안 ILC에 새롭게 합류하신 회원분들을 진심으로 환영합니다!

## 신규 회원 명단
- 김민준님 (백엔드 개발)
- 이서연님 (프론트엔드 개발)
- 박지호님 (데이터 사이언스)
- 최유진님 (UI/UX 디자인)
- 정현우님 (DevOps)

앞으로 ILC에서 다양한 프로젝트와 활동을 통해 많은 경험과 성장의 기회가 있기를 바랍니다.

## 신규 회원 가이드
회원 포털에서 다음 자료들을 확인하실 수 있습니다:
- ILC 소개 및 조직 구조
- 진행 중인 프로젝트 목록
- 회원 커뮤니티 가이드라인
- 자주 묻는 질문 (FAQ)

궁금하신 점이 있으시면 언제든지 문의해 주세요!
    `,
  },
  {
    id: 4,
    title: '웹사이트 리뉴얼 완료',
    date: '2026-03-20',
    author: '기술팀',
    isPinned: false,
    excerpt: '더 나은 사용자 경험을 위해 웹사이트가 새롭게 단장했습니다.',
    content: `
안녕하세요, ILC 기술팀입니다.

회원분들께 더 나은 사용자 경험을 제공하기 위해 웹사이트를 전면 리뉴얼했습니다.

## 주요 변경 사항

### 디자인 개선
- 모던하고 직관적인 UI/UX
- 모바일 최적화
- 다크모드 지원 (곧 출시 예정)

### 기능 추가
- 향상된 프로젝트 관리 시스템
- 실시간 알림 기능
- 회원 프로필 커스터마이징
- 통합 검색 기능

### 성능 개선
- 페이지 로딩 속도 50% 향상
- 반응형 디자인 적용
- 접근성(Accessibility) 개선

## 피드백 부탁드립니다
새로운 웹사이트를 사용하시면서 개선이 필요한 부분이나 제안 사항이 있으시면 언제든지 알려주세요.

감사합니다.
    `,
  },
  {
    id: 5,
    title: '2월 프로젝트 성과 공유',
    date: '2026-03-10',
    author: '프로젝트팀',
    isPinned: false,
    excerpt: '2월 한 달간 진행된 프로젝트의 성과를 공유합니다.',
    content: `
2월 한 달간 수고하신 모든 팀원분들께 감사드립니다.

## 프로젝트별 성과

### AI 기반 데이터 분석 플랫폼
- MVP 버전 개발 완료
- 베타 테스트 진행 중
- 초기 사용자 피드백 수집 완료

### 모바일 커뮤니티 앱
- UI/UX 디자인 최종 승인
- iOS 앱 개발 60% 완료
- Android 앱 개발 55% 완료

### 오픈소스 디자인 시스템
- 컴포넌트 라이브러리 50종 완성
- 문서화 작업 진행 중
- GitHub 레포지토리 공개 준비 중

## 3월 계획
각 프로젝트 팀은 3월 중 다음 마일스톤 달성을 목표로 하고 있습니다.
상세 내용은 프로젝트 페이지에서 확인하실 수 있습니다.

계속해서 좋은 성과 만들어가겠습니다!
    `,
  },
]

export type PublicProject = {
  id: number
  title: string
  description: string
  status: string
  startDate: string
  team: number
  tags: string[]
  detailOverview: string
}

export const publicProjects: PublicProject[] = [
  {
    id: 1,
    title: 'AI 기반 데이터 분석 플랫폼',
    description: '머신러닝을 활용한 비즈니스 인텔리전스 대시보드 구축',
    status: '진행중',
    startDate: '2026-03',
    team: 8,
    tags: ['AI', '데이터 분석', '웹 개발'],
    detailOverview:
      '기업 데이터를 효과적으로 분석·시각화하는 AI 기반 플랫폼입니다. 머신러닝 기반 예측과 직관적인 대시보드로 의사결정을 지원합니다.',
  },
  {
    id: 2,
    title: '모바일 커뮤니티 앱',
    description: '회원 간 소통과 정보 공유를 위한 크로스 플랫폼 모바일 앱',
    status: '진행중',
    startDate: '2026-02',
    team: 6,
    tags: ['모바일', 'React Native', '커뮤니티'],
    detailOverview:
      '회원 전용 커뮤니티 기능을 모바일에서 제공하는 크로스 플랫폼 앱입니다. 푸시 알림과 실시간 채팅을 지원합니다.',
  },
  {
    id: 3,
    title: '블록체인 기반 인증 시스템',
    description: '탈중앙화된 신원 인증 및 자격 증명 관리 시스템',
    status: '기획',
    startDate: '2026-05',
    team: 5,
    tags: ['블록체인', '보안', '웹3'],
    detailOverview:
      '자격 증명의 위·변조 방지를 목표로 한 블록체인 기반 인증 설계 단계입니다.',
  },
  {
    id: 4,
    title: '클라우드 인프라 자동화',
    description: 'DevOps 프로세스 개선을 위한 자동화 도구 개발',
    status: '완료',
    startDate: '2025-11',
    team: 4,
    tags: ['DevOps', '클라우드', '자동화'],
    detailOverview:
      '배포 파이프라인 자동화와 인프라 코드화(IaC)를 통해 운영 효율을 높였습니다.',
  },
  {
    id: 5,
    title: '교육용 VR 콘텐츠',
    description: '몰입형 학습 경험을 제공하는 가상현실 교육 플랫폼',
    status: '기획',
    startDate: '2026-06',
    team: 7,
    tags: ['VR', '교육', 'Unity'],
    detailOverview:
      '교육 시나리오 기반 VR 콘텐츠 제작 및 학습 분석 기능을 기획 중입니다.',
  },
  {
    id: 6,
    title: '오픈소스 디자인 시스템',
    description: '재사용 가능한 UI 컴포넌트 라이브러리 구축',
    status: '완료',
    startDate: '2025-09',
    team: 5,
    tags: ['디자인', '오픈소스', 'UI/UX'],
    detailOverview:
      'ILC 웹·앱 전반에서 사용하는 컴포넌트 라이브러리와 문서화를 완료했습니다.',
  },
]

export function getAnnouncementById(id: number) {
  return publicAnnouncements.find((a) => a.id === id)
}

export function getProjectById(id: number) {
  return publicProjects.find((p) => p.id === id)
}
