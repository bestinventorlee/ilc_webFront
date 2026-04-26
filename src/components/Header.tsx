import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { isAuthenticated, removeTokens, getRefreshToken } from '../utils/token'
import { logout } from '../services/authService'
import { isAdmin } from '../utils/admin'
import LogoutConfirmModal from './LogoutConfirmModal'
import ContactModal from './ContactModal'
import '../pages/ilc/ilc-site.css'

function MenuIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function useActivePath() {
  const location = useLocation()
  return (path: string) => {
    if (path === '/admin') return location.pathname.startsWith('/admin')
    return location.pathname === path
  }
}

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActivePath = useActivePath()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const auth = isAuthenticated()

  const desktopLink = (path: string) =>
    isActivePath(path) ? 'ilc-nav__link ilc-nav__link--active' : 'ilc-nav__link'

  const mobileLink = (path: string) =>
    isActivePath(path)
      ? 'ilc-nav__mobile-link ilc-nav__mobile-link--active'
      : 'ilc-nav__mobile-link'

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
    setMobileOpen(false)
  }

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false)
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await logout(refreshToken)
      } catch (error) {
        console.error('로그아웃 API 오류:', error)
      }
    }
    removeTokens()
    navigate('/', { replace: true })
    window.location.reload()
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  const openContactFromNav = () => {
    setMobileOpen(false)
    if (location.pathname === '/') {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => setShowContactModal(true), 500)
      } else {
        setShowContactModal(true)
      }
    } else {
      navigate('/#contact')
      setTimeout(() => setShowContactModal(true), 500)
    }
  }

  return (
    <>
      <nav className="ilc-nav" aria-label="회원 포털 메뉴">
        <div className="ilc-nav__inner">
          <div className="ilc-nav__row">
            <div className="ilc-header-brand">
              <Link to="/" className="ilc-nav__logo" title="ILC 홈페이지로 이동">
                ILC
              </Link>
              <span className="ilc-header-brand__sub">회원 포털</span>
            </div>

            <div className="ilc-nav__desktop">
              {auth ? (
                <>
                  <Link to="/" className={desktopLink('/')}>
                    홈페이지
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className={desktopLink('/admin')}>
                      관리자
                    </Link>
                  )}
                  <Link to="/dashboard" className={desktopLink('/dashboard')}>
                    대시보드
                  </Link>
                  <Link to="/membership" className={desktopLink('/membership')}>
                    회원권
                  </Link>
                  <Link to="/wallet" className={desktopLink('/wallet')}>
                    토큰 지갑
                  </Link>
                  <Link to="/community" className={desktopLink('/community')}>
                    커뮤니티
                  </Link>
                  <Link to="/library" className={desktopLink('/library')}>
                    자료실
                  </Link>
                  <Link to="/docs" className={desktopLink('/docs')}>
                    문서
                  </Link>
                  <Link to="/profile" className={desktopLink('/profile')}>
                    프로필
                  </Link>
                  <button type="button" className="ilc-nav__logout-btn" onClick={handleLogoutClick}>
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <a href="#about" className="ilc-nav__link">
                    프로젝트 소개
                  </a>
                  <a href="#features" className="ilc-nav__link">
                    주요 기능
                  </a>
                  <a
                    href="#contact"
                    className="ilc-nav__link"
                    onClick={(e) => {
                      e.preventDefault()
                      openContactFromNav()
                    }}
                  >
                    문의하기
                  </a>
                </>
              )}
            </div>

            <button
              type="button"
              className="ilc-nav__mobile-btn"
              aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {mobileOpen && (
            <div className="ilc-nav__mobile-panel">
              <div className="ilc-nav__mobile-panel-inner">
                {auth ? (
                  <>
                    <Link
                      to="/"
                      className={mobileLink('/')}
                      onClick={() => setMobileOpen(false)}
                    >
                      홈페이지
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        className={mobileLink('/admin')}
                        onClick={() => setMobileOpen(false)}
                      >
                        관리자
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className={mobileLink('/dashboard')}
                      onClick={() => setMobileOpen(false)}
                    >
                      대시보드
                    </Link>
                    <Link
                      to="/membership"
                      className={mobileLink('/membership')}
                      onClick={() => setMobileOpen(false)}
                    >
                      회원권
                    </Link>
                    <Link
                      to="/community"
                      className={mobileLink('/community')}
                      onClick={() => setMobileOpen(false)}
                    >
                      커뮤니티
                    </Link>
                    <Link
                      to="/wallet"
                      className={mobileLink('/wallet')}
                      onClick={() => setMobileOpen(false)}
                    >
                      토큰 지갑
                    </Link>
                    <Link
                      to="/library"
                      className={mobileLink('/library')}
                      onClick={() => setMobileOpen(false)}
                    >
                      자료실
                    </Link>
                    <Link to="/docs" className={mobileLink('/docs')} onClick={() => setMobileOpen(false)}>
                      문서
                    </Link>
                    <Link
                      to="/profile"
                      className={mobileLink('/profile')}
                      onClick={() => setMobileOpen(false)}
                    >
                      프로필
                    </Link>
                    <button
                      type="button"
                      className="ilc-nav__logout-btn ilc-nav__mobile-logout"
                      onClick={handleLogoutClick}
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <a href="#about" className="ilc-nav__mobile-link" onClick={() => setMobileOpen(false)}>
                      프로젝트 소개
                    </a>
                    <a href="#features" className="ilc-nav__mobile-link" onClick={() => setMobileOpen(false)}>
                      주요 기능
                    </a>
                    <a
                      href="#contact"
                      className="ilc-nav__mobile-link"
                      onClick={(e) => {
                        e.preventDefault()
                        openContactFromNav()
                      }}
                    >
                      문의하기
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showLogoutConfirm && (
        <LogoutConfirmModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
      )}
      {showContactModal && (
        <ContactModal
          onClose={() => setShowContactModal(false)}
          onSuccess={() => setShowContactModal(false)}
        />
      )}
    </>
  )
}

export default Header
