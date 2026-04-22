import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import './ilc-site.css'

const navItems = [
  { path: '/', label: '홈', end: true },
  { path: '/announcements', label: '공지사항', end: false },
  { path: '/projects', label: '프로젝트', end: false },
  { path: '/about', label: '회사 소개', end: false },
]

function MenuIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function IlcLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string, end?: boolean) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    if (end) {
      return location.pathname === path
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <div className="ilc-site">
      <nav className="ilc-nav" aria-label="주 내비게이션">
        <div className="ilc-nav__inner">
          <div className="ilc-nav__row">
            <Link to="/" className="ilc-nav__logo">
              ILC
            </Link>

            <div className="ilc-nav__desktop">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={
                    isActive(item.path, item.end)
                      ? 'ilc-nav__link ilc-nav__link--active'
                      : 'ilc-nav__link'
                  }
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/portal" className="ilc-nav__wallet">
                회원 포털
              </Link>
            </div>

            <button
              type="button"
              className="ilc-nav__mobile-btn"
              aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {mobileOpen && (
            <div className="ilc-nav__mobile-panel">
              <div className="ilc-nav__mobile-panel-inner">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={
                      isActive(item.path, item.end)
                        ? 'ilc-nav__mobile-link ilc-nav__mobile-link--active'
                        : 'ilc-nav__mobile-link'
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/portal"
                  className="ilc-nav__mobile-link ilc-nav__mobile-link--emph"
                  onClick={() => setMobileOpen(false)}
                >
                  회원 포털
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="ilc-main">
        <Outlet />
      </main>

      <footer className="ilc-footer">
        <div className="ilc-footer__inner">
          <div className="ilc-footer__grid">
            <div>
              <div className="ilc-footer__brand">ILC</div>
              <p className="ilc-footer__text">
                혁신적인 프로젝트와 함께하는 커뮤니티
              </p>
            </div>
            <div>
              <h3 className="ilc-footer__h4">바로가기</h3>
              <div className="ilc-footer__links">
                <Link to="/announcements">공지사항</Link>
                <Link to="/projects">프로젝트</Link>
                <Link to="/about">회사 소개</Link>
              </div>
            </div>
            <div>
              <h3 className="ilc-footer__h4">문의</h3>
              <p className="ilc-footer__text">이메일: contact@ilc.com</p>
              <p className="ilc-footer__text">전화: 02-1234-5678</p>
            </div>
          </div>
          <div className="ilc-footer__bottom">
            © {new Date().getFullYear()} ILC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
