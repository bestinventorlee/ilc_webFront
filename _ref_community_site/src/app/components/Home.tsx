import { Link } from "react-router";
import { ArrowRight, Users, Lightbulb, Target } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-neutral-900 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1737573296361-75315239293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
            alt="Team collaboration"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-neutral-900/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-sm font-medium tracking-wider text-neutral-400 mb-6">
                INNOVATION LAB COMMUNITY
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
                ILC
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl text-neutral-200 mb-12 leading-relaxed"
            >
              혁신을 만들어가는
              <br />
              사람들의 커뮤니티
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center justify-center px-10 py-5 bg-white text-neutral-900 text-lg font-medium hover:bg-neutral-100 transition-all hover:scale-105"
              >
                프로젝트 보기
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="group inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white text-lg font-medium hover:bg-white hover:text-neutral-900 transition-all"
              >
                회원 로그인
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-neutral-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            <div className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 bg-neutral-900 text-white flex items-center justify-center mb-8"
              >
                <Users className="w-8 h-8" />
              </motion.div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                활발한 커뮤니티
              </h3>
              <p className="text-lg text-neutral-600 leading-relaxed">
                다양한 분야의 전문가들이 모여 지식을 공유하고 함께 성장합니다
              </p>
            </div>

            <div className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 bg-neutral-900 text-white flex items-center justify-center mb-8"
              >
                <Lightbulb className="w-8 h-8" />
              </motion.div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                혁신적인 프로젝트
              </h3>
              <p className="text-lg text-neutral-600 leading-relaxed">
                실무에 적용 가능한 프로젝트를 통해 실질적인 경험을 쌓습니다
              </p>
            </div>

            <div className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 bg-neutral-900 text-white flex items-center justify-center mb-8"
              >
                <Target className="w-8 h-8" />
              </motion.div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                명확한 목표
              </h3>
              <p className="text-lg text-neutral-600 leading-relaxed">
                체계적인 로드맵과 함께 목표를 달성해 나갑니다
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 bg-neutral-50 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-neutral-900 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-neutral-900 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-8 leading-tight">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-neutral-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              ILC 회원이 되어 다양한 프로젝트에 참여하고
              <br />
              네트워크를 확장하세요
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-12 py-6 bg-neutral-900 text-white text-lg font-medium hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/20"
              >
                회원가입 / 로그인
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
