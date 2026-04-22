import { Link, Outlet, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "홈" },
    { path: "/announcements", label: "공지사항" },
    { path: "/projects", label: "프로젝트" },
    { path: "/about", label: "회사 소개" },
    { path: "/login", label: "로그인" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="text-3xl font-bold text-neutral-900 tracking-tight">
              ILC
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors relative ${
                    isActive(item.path)
                      ? "text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-neutral-900"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t border-neutral-200"
              >
                <div className="py-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-4 text-base transition-colors ${
                        isActive(item.path)
                          ? "text-neutral-900 font-medium"
                          : "text-neutral-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-auto bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="text-3xl font-bold text-neutral-900 mb-6">ILC</div>
              <p className="text-base text-neutral-600 leading-relaxed">
                혁신적인 프로젝트와 함께하는 커뮤니티
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-6">바로가기</h3>
              <div className="space-y-3">
                <Link
                  to="/announcements"
                  className="block text-base text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  공지사항
                </Link>
                <Link
                  to="/projects"
                  className="block text-base text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  프로젝트
                </Link>
                <Link
                  to="/about"
                  className="block text-base text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  회사 소개
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-6">문의</h3>
              <p className="text-base text-neutral-600 mb-3">
                이메일: contact@ilc.com
              </p>
              <p className="text-base text-neutral-600">전화: 02-1234-5678</p>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-200 text-center text-sm text-neutral-600">
            © 2026 ILC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
