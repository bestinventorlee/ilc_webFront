import { Link } from "react-router";
import { Calendar, Pin } from "lucide-react";
import { motion } from "motion/react";

const announcements = [
  {
    id: 1,
    title: "2026년 상반기 프로젝트 킥오프 안내",
    date: "2026-04-05",
    isPinned: true,
    excerpt: "2026년 상반기 주요 프로젝트 일정 및 참여 방법을 안내드립니다.",
  },
  {
    id: 2,
    title: "4월 정기 회원 모임 공지",
    date: "2026-04-01",
    isPinned: true,
    excerpt: "4월 정기 회원 모임이 4월 15일 진행될 예정입니다.",
  },
  {
    id: 3,
    title: "신규 회원 환영합니다",
    date: "2026-03-28",
    isPinned: false,
    excerpt: "3월에 가입하신 신규 회원분들을 환영합니다.",
  },
  {
    id: 4,
    title: "웹사이트 리뉴얼 완료",
    date: "2026-03-20",
    isPinned: false,
    excerpt: "더 나은 사용자 경험을 위해 웹사이트가 새롭게 단장했습니다.",
  },
  {
    id: 5,
    title: "2월 프로젝트 성과 공유",
    date: "2026-03-10",
    isPinned: false,
    excerpt: "2월 한 달간 진행된 프로젝트의 성과를 공유합니다.",
  },
];

export default function Announcements() {
  const pinnedAnnouncements = announcements.filter((a) => a.isPinned);
  const regularAnnouncements = announcements.filter((a) => !a.isPinned);

  return (
    <div className="py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            공지사항
          </h1>
          <p className="text-xl text-neutral-600 mb-16">
            ILC의 최신 소식과 중요한 공지사항을 확인하세요
          </p>
        </motion.div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-sm font-medium text-neutral-900 mb-6 flex items-center tracking-wider">
              <Pin className="w-4 h-4 mr-2" />
              고정된 공지
            </h2>
            <div className="space-y-6">
              {pinnedAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    to={`/announcements/${announcement.id}`}
                    className="block border-2 border-neutral-900 p-8 hover:bg-neutral-50 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-neutral-900 leading-tight">
                        {announcement.title}
                      </h3>
                      <Pin className="w-5 h-5 text-neutral-900 flex-shrink-0 ml-4" />
                    </div>
                    <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                      {announcement.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {announcement.date}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-sm font-medium text-neutral-900 mb-6 tracking-wider">
            전체 공지사항
          </h2>
          <div className="space-y-px border border-neutral-200">
            {regularAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              >
                <Link
                  to={`/announcements/${announcement.id}`}
                  className="block bg-white p-8 hover:bg-neutral-50 transition-colors border-b border-neutral-200 last:border-b-0"
                >
                  <h3 className="text-xl font-medium text-neutral-900 mb-3">
                    {announcement.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 leading-relaxed">
                    {announcement.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-neutral-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {announcement.date}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
