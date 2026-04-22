import { useParams, Link, useNavigate } from "react-router";
import { Calendar, Users, ArrowLeft, Github, ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "AI 기반 데이터 분석 플랫폼",
    description: "머신러닝을 활용한 비즈니스 인텔리전스 대시보드 구축",
    status: "진행중",
    startDate: "2026-03",
    endDate: "2026-09 (예상)",
    team: 8,
    tags: ["AI", "데이터 분석", "웹 개발"],
    leader: "김태현",
    overview: `
이 프로젝트는 기업들이 데이터를 보다 효과적으로 분석하고 인사이트를 도출할 수 있도록 돕는 AI 기반 플랫폼을 구축하는 것을 목표로 합니다.

머신러닝 알고리즘을 활용하여 자동화된 데이터 분석과 예측 기능을 제공하며, 직관적인 대시보드를 통해 비즈니스 의사결정을 지원합니다.
    `,
    objectives: [
      "다양한 데이터 소스 통합 및 자동화된 데이터 파이프라인 구축",
      "머신러닝 기반 예측 모델 개발 및 배포",
      "인터랙티브한 데이터 시각화 대시보드 제공",
      "실시간 알림 및 리포팅 시스템 구현",
    ],
    techStack: [
      "Python, TensorFlow, scikit-learn",
      "React, TypeScript, D3.js",
      "PostgreSQL, Redis",
      "Docker, Kubernetes",
      "AWS (S3, EC2, Lambda)",
    ],
    milestones: [
      { phase: "1단계: 기획 및 설계", period: "2026-03", status: "완료" },
      { phase: "2단계: MVP 개발", period: "2026-04 ~ 2026-05", status: "진행중" },
      { phase: "3단계: 베타 테스트", period: "2026-06 ~ 2026-07", status: "예정" },
      { phase: "4단계: 정식 출시", period: "2026-08 ~ 2026-09", status: "예정" },
    ],
    teamMembers: [
      { name: "김태현", role: "프로젝트 리더 / 백엔드 개발" },
      { name: "이지은", role: "ML 엔지니어" },
      { name: "박준서", role: "프론트엔드 개발" },
      { name: "최민지", role: "데이터 엔지니어" },
      { name: "정승호", role: "백엔드 개발" },
      { name: "강예린", role: "UI/UX 디자이너" },
      { name: "윤도현", role: "DevOps 엔지니어" },
      { name: "서하은", role: "QA 엔지니어" },
    ],
    links: {
      github: "https://github.com/ilc/ai-analytics-platform",
      demo: "https://demo.ilc-analytics.com",
    },
  },
  {
    id: 2,
    title: "모바일 커뮤니티 앱",
    description: "회원 간 소통과 정보 공유를 위한 크로스 플랫폼 모바일 앱",
    status: "진행중",
    startDate: "2026-02",
    endDate: "2026-07 (예상)",
    team: 6,
    tags: ["모바일", "React Native", "커뮤니티"],
    leader: "박서진",
    overview: `
ILC 회원들이 언제 어디서나 소통하고 정보를 공유할 수 있는 모바일 커뮤니티 앱을 개발합니다.

실시간 채팅, 게시판, 이벤트 알림 등의 기능을 제공하며, iOS와 Android 양쪽 플랫폼을 모두 지원합니다.
    `,
    objectives: [
      "크로스 플랫폼 모바일 앱 개발 (iOS, Android)",
      "실시간 채팅 및 푸시 알림 기능",
      "회원 프로필 및 활동 내역 관리",
      "이벤트 캘린더 및 일정 공유",
    ],
    techStack: [
      "React Native, TypeScript",
      "Node.js, Express",
      "MongoDB",
      "Firebase (인증, 푸시)",
      "Socket.io",
    ],
    milestones: [
      { phase: "1단계: 기획 및 디자인", period: "2026-02", status: "완료" },
      { phase: "2단계: 핵심 기능 개발", period: "2026-03 ~ 2026-04", status: "진행중" },
      { phase: "3단계: 알파 테스트", period: "2026-05", status: "예정" },
      { phase: "4단계: 스토어 출시", period: "2026-06 ~ 2026-07", status: "예정" },
    ],
    teamMembers: [
      { name: "박서진", role: "프로젝트 리더 / 모바일 개발" },
      { name: "김나연", role: "모바일 개발" },
      { name: "이동현", role: "백엔드 개발" },
      { name: "정수빈", role: "UI/UX 디자이너" },
      { name: "조민우", role: "QA 엔지니어" },
      { name: "한지원", role: "백엔드 개발" },
    ],
    links: {
      github: "https://github.com/ilc/mobile-community-app",
    },
  },
  {
    id: 3,
    title: "블록체인 기반 인증 시스템",
    description: "탈중앙화된 신원 인증 및 자격 증명 관리 시스템",
    status: "기획",
    startDate: "2026-05",
    endDate: "2026-12 (예상)",
    team: 5,
    tags: ["블록체인", "보안", "웹3"],
    leader: "최지훈",
    overview: `
블록체인 기술을 활용하여 안전하고 투명한 신원 인증 시스템을 구축합니다.

사용자가 자신의 신원 정보와 자격 증명을 직접 관리하고, 필요한 경우에만 선택적으로 공유할 수 있는 탈중앙화 시스템을 제공합니다.
    `,
    objectives: [
      "블록체인 기반 신원 인증 시스템 개발",
      "자격 증명 발급 및 검증 프로세스 구현",
      "사용자 중심의 프라이버시 보호",
      "기존 시스템과의 통합 가능한 API 제공",
    ],
    techStack: [
      "Ethereum, Solidity",
      "Web3.js, ethers.js",
      "IPFS",
      "React, TypeScript",
      "Node.js",
    ],
    milestones: [
      { phase: "1단계: 리서치 및 기획", period: "2026-05 ~ 2026-06", status: "예정" },
      { phase: "2단계: 스마트 컨트랙트 개발", period: "2026-07 ~ 2026-08", status: "예정" },
      { phase: "3단계: 프론트엔드 개발", period: "2026-09 ~ 2026-10", status: "예정" },
      { phase: "4단계: 테스트넷 배포", period: "2026-11 ~ 2026-12", status: "예정" },
    ],
    teamMembers: [
      { name: "최지훈", role: "프로젝트 리더 / 블록체인 개발" },
      { name: "강민서", role: "스마트 컨트랙트 개발" },
      { name: "임재훈", role: "백엔드 개발" },
      { name: "송유진", role: "프론트엔드 개발" },
      { name: "백승현", role: "보안 엔지니어" },
    ],
    links: {},
  },
  {
    id: 4,
    title: "클라우드 인프라 자동화",
    description: "DevOps 프로세스 개선을 위한 자동화 도구 개발",
    status: "완료",
    startDate: "2025-11",
    endDate: "2026-02",
    team: 4,
    tags: ["DevOps", "클라우드", "자동화"],
    leader: "정현우",
    overview: `
클라우드 인프라 관리와 배포 프로세스를 자동화하여 개발 효율성을 높이는 도구를 개발했습니다.

CI/CD 파이프라인 자동 구성, 인프라 모니터링, 자동 스케일링 등의 기능을 제공하여 DevOps 업무를 간소화합니다.
    `,
    objectives: [
      "CI/CD 파이프라인 자동 구성 도구",
      "인프라 as 코드(IaC) 템플릿 생성기",
      "실시간 모니터링 및 알림 시스템",
      "자동 백업 및 복구 기능",
    ],
    techStack: [
      "Terraform, Ansible",
      "Jenkins, GitLab CI",
      "Prometheus, Grafana",
      "Python, Bash",
      "AWS, GCP",
    ],
    milestones: [
      { phase: "1단계: 요구사항 분석", period: "2025-11", status: "완료" },
      { phase: "2단계: 핵심 기능 개발", period: "2025-12", status: "완료" },
      { phase: "3단계: 테스트 및 최적화", period: "2026-01", status: "완료" },
      { phase: "4단계: 문서화 및 배포", period: "2026-02", status: "완료" },
    ],
    teamMembers: [
      { name: "정현우", role: "프로젝트 리더 / DevOps" },
      { name: "오성민", role: "DevOps 엔지니어" },
      { name: "신예은", role: "백엔드 개발" },
      { name: "홍준혁", role: "시스템 엔지니어" },
    ],
    links: {
      github: "https://github.com/ilc/cloud-automation-tools",
      docs: "https://docs.ilc-devops.com",
    },
  },
  {
    id: 5,
    title: "교육용 VR 콘텐츠",
    description: "몰입형 학습 경험을 제공하는 가상현실 교육 플랫폼",
    status: "기획",
    startDate: "2026-06",
    endDate: "2027-01 (예상)",
    team: 7,
    tags: ["VR", "교육", "Unity"],
    leader: "윤서아",
    overview: `
가상현실 기술을 활용하여 학습자에게 몰입감 있는 교육 경험을 제공하는 플랫폼을 개발합니다.

다양한 교육 분야(과학, 역사, 의학 등)에서 활용 가능한 VR 콘텐츠를 제작하고, 인터랙티브한 학습 환경을 구현합니다.
    `,
    objectives: [
      "교육용 VR 콘텐츠 제작 프레임워크 개발",
      "다양한 학습 시나리오 및 시뮬레이션 구현",
      "학습 진도 추적 및 분석 시스템",
      "VR 헤드셋 및 컨트롤러 최적화",
    ],
    techStack: [
      "Unity, C#",
      "Oculus SDK, OpenXR",
      "Blender (3D 모델링)",
      "Node.js, MongoDB",
      "WebXR",
    ],
    milestones: [
      { phase: "1단계: 기획 및 프로토타입", period: "2026-06 ~ 2026-07", status: "예정" },
      { phase: "2단계: 콘텐츠 제작", period: "2026-08 ~ 2026-10", status: "예정" },
      { phase: "3단계: 플랫폼 개발", period: "2026-11 ~ 2026-12", status: "예정" },
      { phase: "4단계: 파일럿 테스트", period: "2027-01", status: "예정" },
    ],
    teamMembers: [
      { name: "윤서아", role: "프로젝트 리더 / VR 개발" },
      { name: "장현준", role: "Unity 개발" },
      { name: "문지혜", role: "3D 아티스트" },
      { name: "권태양", role: "백엔드 개발" },
      { name: "안소희", role: "교육 컨텐츠 기획" },
      { name: "노민재", role: "QA 엔지니어" },
      { name: "배수진", role: "UI/UX 디자이너" },
    ],
    links: {},
  },
  {
    id: 6,
    title: "오픈소스 디자인 시스템",
    description: "재사용 가능한 UI 컴포넌트 라이브러리 구축",
    status: "완료",
    startDate: "2025-09",
    endDate: "2026-01",
    team: 5,
    tags: ["디자인", "오픈소스", "UI/UX"],
    leader: "한예지",
    overview: `
개발자와 디자이너가 쉽게 사용할 수 있는 오픈소스 디자인 시스템을 구축했습니다.

일관된 디자인 언어와 재사용 가능한 컴포넌트를 제공하여 프로젝트 개발 속도를 높이고 디자인 품질을 향상시킵니다.
    `,
    objectives: [
      "포괄적인 UI 컴포넌트 라이브러리 구축",
      "디자인 토큰 시스템 및 테마 커스터마이징",
      "상세한 문서화 및 사용 예제",
      "접근성(Accessibility) 준수",
    ],
    techStack: [
      "React, TypeScript",
      "Tailwind CSS",
      "Storybook",
      "Figma",
      "npm",
    ],
    milestones: [
      { phase: "1단계: 디자인 시스템 설계", period: "2025-09 ~ 2025-10", status: "완료" },
      { phase: "2단계: 컴포넌트 개발", period: "2025-11 ~ 2025-12", status: "완료" },
      { phase: "3단계: 문서화 작업", period: "2025-12 ~ 2026-01", status: "완료" },
      { phase: "4단계: 오픈소스 공개", period: "2026-01", status: "완료" },
    ],
    teamMembers: [
      { name: "한예지", role: "프로젝트 리더 / 디자이너" },
      { name: "류지훈", role: "프론트엔드 개발" },
      { name: "서윤아", role: "UI/UX 디자이너" },
      { name: "김도윤", role: "프론트엔드 개발" },
      { name: "이채원", role: "테크니컬 라이터" },
    ],
    links: {
      github: "https://github.com/ilc/design-system",
      docs: "https://design.ilc.com",
      npm: "https://www.npmjs.com/package/@ilc/ui",
    },
  },
];

const statusColors = {
  진행중: "bg-green-50 text-green-700 border-green-200",
  기획: "bg-blue-50 text-blue-700 border-blue-200",
  완료: "bg-neutral-100 text-neutral-700 border-neutral-200",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            프로젝트를 찾을 수 없습니다
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <button
          onClick={() => navigate("/projects")}
          className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </button>

        <article>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`text-xs font-medium px-3 py-1 border ${
                  statusColors[project.status as keyof typeof statusColors]
                }`}
              >
                {project.status}
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {project.title}
            </h1>

            <p className="text-lg text-neutral-600 mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {project.startDate} ~ {project.endDate}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                팀원 {project.team}명
              </div>
              <div>프로젝트 리더: {project.leader}</div>
            </div>

            {/* Links */}
            {Object.keys(project.links).length > 0 && (
              <div className="flex gap-4 mt-6">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    데모
                  </a>
                )}
                {project.links.docs && (
                  <a
                    href={project.links.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    문서
                  </a>
                )}
                {project.links.npm && (
                  <a
                    href={project.links.npm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    npm
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Overview */}
          <section className="mb-12 pb-12 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              프로젝트 개요
            </h2>
            <div className="text-neutral-700 leading-relaxed whitespace-pre-line">
              {project.overview}
            </div>
          </section>

          {/* Objectives */}
          <section className="mb-12 pb-12 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              주요 목표
            </h2>
            <ul className="space-y-3">
              {project.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-neutral-900 mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-neutral-700">{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tech Stack */}
          <section className="mb-12 pb-12 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              기술 스택
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.techStack.map((tech, index) => (
                <div
                  key={index}
                  className="border border-neutral-200 p-4 hover:border-neutral-900 transition-colors"
                >
                  <p className="text-neutral-700">{tech}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Milestones */}
          <section className="mb-12 pb-12 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              프로젝트 일정
            </h2>
            <div className="space-y-6">
              {project.milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-24 text-sm text-neutral-600">
                    {milestone.period}
                  </div>
                  <div className="flex-1 border-l-2 border-neutral-900 pl-6 pb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-neutral-900">
                        {milestone.phase}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 ${
                          milestone.status === "완료"
                            ? "bg-neutral-100 text-neutral-700"
                            : milestone.status === "진행중"
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {milestone.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Members */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              팀 구성원
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="border border-neutral-200 p-4 hover:border-neutral-900 transition-colors"
                >
                  <h3 className="font-medium text-neutral-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-8 border-t border-neutral-200">
            <Link
              to="/projects"
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
