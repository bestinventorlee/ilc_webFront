import { Target, Eye, Award, Users } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-32 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-8">ILC 소개</h1>
            <p className="text-2xl text-neutral-300">
              Innovation Learning Community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 bg-neutral-900 text-white flex items-center justify-center mb-8">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-8">
                우리의 미션
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                ILC는 혁신적인 기술과 창의적인 아이디어를 가진 사람들이 모여
                함께 성장하고 발전하는 커뮤니티입니다. 우리는 실질적인 프로젝트
                경험을 통해 회원들의 역량을 강화하고, 산업 현장에서 요구하는
                실무 능력을 배양합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 bg-neutral-900 text-white flex items-center justify-center mb-8">
                <Eye className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-8">
                우리의 비전
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                기술 혁신을 선도하는 글로벌 커뮤니티로 성장하여, 회원들이 자신의
                잠재력을 최대한 발휘하고 사회에 긍정적인 영향을 미칠 수 있도록
                지원합니다. 지속 가능한 학습 문화와 협업 정신을 바탕으로 미래를
                준비합니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-neutral-900 mb-20 text-center"
          >
            핵심 가치
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: Users,
                title: "협업과 소통",
                description:
                  "다양한 배경을 가진 회원들이 서로의 강점을 나누고 함께 문제를 해결합니다",
              },
              {
                icon: Award,
                title: "실행과 성과",
                description:
                  "이론보다 실천을 중시하며, 구체적인 결과물을 통해 성장합니다",
              },
              {
                icon: Target,
                title: "지속적 학습",
                description:
                  "끊임없이 새로운 기술을 배우고 변화에 적응하는 문화를 만듭니다",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-neutral-900 text-white flex items-center justify-center mx-auto mb-8">
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                  {value.title}
                </h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-neutral-900 mb-20 text-center"
          >
            연혁
          </motion.h2>

          <div className="space-y-16">
            {[
              {
                year: "2024",
                title: "ILC 설립",
                description: "혁신과 학습을 추구하는 커뮤니티 공식 출범",
              },
              {
                year: "2025",
                title: "첫 프로젝트 완료",
                description: "오픈소스 디자인 시스템 프로젝트 성공적 완료",
              },
              {
                year: "2026",
                title: "다양한 프로젝트 진행",
                description: "AI, 블록체인, VR 등 다양한 분야의 프로젝트 동시 진행",
              },
            ].map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-12"
              >
                <div className="flex-shrink-0 w-32">
                  <span className="text-3xl font-bold text-neutral-900">
                    {item.year}
                  </span>
                </div>
                <div className="border-l-2 border-neutral-900 pl-12 pb-4">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-lg text-neutral-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
