import { useParams, Link, useNavigate } from "react-router";
import { Calendar, ArrowLeft, Pin } from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "2026년 상반기 프로젝트 킥오프 안내",
    date: "2026-04-05",
    author: "관리자",
    isPinned: true,
    excerpt: "2026년 상반기 주요 프로젝트 일정 및 참여 방법을 안내드립니다.",
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
    title: "4월 정기 회원 모임 공지",
    date: "2026-04-01",
    author: "운영팀",
    isPinned: true,
    excerpt: "4월 정기 회원 모임이 4월 15일 진행될 예정입니다.",
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
    title: "신규 회원 환영합니다",
    date: "2026-03-28",
    author: "관리자",
    isPinned: false,
    excerpt: "3월에 가입하신 신규 회원분들을 환영합니다.",
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
    title: "웹사이트 리뉴얼 완료",
    date: "2026-03-20",
    author: "기술팀",
    isPinned: false,
    excerpt: "더 나은 사용자 경험을 위해 웹사이트가 새롭게 단장했습니다.",
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
    title: "2월 프로젝트 성과 공유",
    date: "2026-03-10",
    author: "프로젝트팀",
    isPinned: false,
    excerpt: "2월 한 달간 진행된 프로젝트의 성과를 공유합니다.",
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
];

export default function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const announcement = announcements.find((a) => a.id === Number(id));

  if (!announcement) {
    return (
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link
            to="/announcements"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            공지사항을 찾을 수 없습니다
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <button
          onClick={() => navigate("/announcements")}
          className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </button>

        <article>
          {announcement.isPinned && (
            <div className="flex items-center text-sm font-medium text-neutral-900 mb-4">
              <Pin className="w-4 h-4 mr-2" />
              고정된 공지
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            {announcement.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-neutral-600 mb-8 pb-8 border-b border-neutral-200">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {announcement.date}
            </div>
            <div>작성자: {announcement.author}</div>
          </div>

          <div className="prose prose-neutral max-w-none">
            {announcement.content.split("\n").map((line, index) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-neutral-900 mt-8 mb-4">
                    {line.replace("## ", "")}
                  </h2>
                );
              } else if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl font-bold text-neutral-900 mt-6 mb-3">
                    {line.replace("### ", "")}
                  </h3>
                );
              } else if (line.startsWith("- ")) {
                return (
                  <li key={index} className="text-neutral-700 ml-6">
                    {line.replace("- ", "")}
                  </li>
                );
              } else if (line.trim() === "") {
                return <br key={index} />;
              } else if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={index} className="text-neutral-700 mb-4">
                    <strong>{line.replace(/\*\*/g, "")}</strong>
                  </p>
                );
              } else {
                return (
                  <p key={index} className="text-neutral-700 mb-4">
                    {line}
                  </p>
                );
              }
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link
              to="/announcements"
              className="inline-flex items-center justify-center px-6 py-3 border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
