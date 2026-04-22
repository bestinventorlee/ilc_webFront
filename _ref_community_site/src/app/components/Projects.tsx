import { Link } from "react-router";
import { Calendar, Users, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const projects = [
  {
    id: 1,
    title: "AI 기반 데이터 분석 플랫폼",
    description: "머신러닝을 활용한 비즈니스 인텔리전스 대시보드 구축",
    status: "진행중",
    startDate: "2026-03",
    team: 8,
    tags: ["AI", "데이터 분석", "웹 개발"],
  },
  {
    id: 2,
    title: "모바일 커뮤니티 앱",
    description: "회원 간 소통과 정보 공유를 위한 크로스 플랫폼 모바일 앱",
    status: "진행중",
    startDate: "2026-02",
    team: 6,
    tags: ["모바일", "React Native", "커뮤니티"],
  },
  {
    id: 3,
    title: "블록체인 기반 인증 시스템",
    description: "탈중앙화된 신원 인증 및 자격 증명 관리 시스템",
    status: "기획",
    startDate: "2026-05",
    team: 5,
    tags: ["블록체인", "보안", "웹3"],
  },
  {
    id: 4,
    title: "클라우드 인프라 자동화",
    description: "DevOps 프로세스 개선을 위한 자동화 도구 개발",
    status: "완료",
    startDate: "2025-11",
    team: 4,
    tags: ["DevOps", "클라우드", "자동화"],
  },
  {
    id: 5,
    title: "교육용 VR 콘텐츠",
    description: "몰입형 학습 경험을 제공하는 가상현실 교육 플랫폼",
    status: "기획",
    startDate: "2026-06",
    team: 7,
    tags: ["VR", "교육", "Unity"],
  },
  {
    id: 6,
    title: "오픈소스 디자인 시스템",
    description: "재사용 가능한 UI 컴포넌트 라이브러리 구축",
    status: "완료",
    startDate: "2025-09",
    team: 5,
    tags: ["디자인", "오픈소스", "UI/UX"],
  },
];

const statusColors = {
  진행중: "bg-green-50 text-green-700 border-green-200",
  기획: "bg-blue-50 text-blue-700 border-blue-200",
  완료: "bg-neutral-100 text-neutral-700 border-neutral-200",
};

export default function Projects() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            프로젝트
          </h1>
          <p className="text-xl text-neutral-600 mb-16 max-w-2xl">
            ILC에서 진행 중이거나 완료된 다양한 프로젝트를 만나보세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/projects/${project.id}`}
                className="block h-full border border-neutral-200 p-8 hover:border-neutral-900 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className={`text-xs font-medium px-3 py-1.5 border ${
                      statusColors[project.status as keyof typeof statusColors]
                    }`}
                  >
                    {project.status}
                  </span>
                  <ExternalLink className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                </div>

                <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-neutral-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    시작: {project.startDate}
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    팀원: {project.team}명
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
