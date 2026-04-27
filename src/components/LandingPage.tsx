import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom'
import '../pages/ilc/ilc-site.css'
import './LandingPage.css'
import { signUp, login, checkUsernameAvailability, findUsername } from '../services/authService'
import { validateSignUpForm, validateEmail, validateUsername } from '../utils/validation'
import { saveTokens, saveUser, isAuthenticated } from '../utils/token'
import ContactModal from './ContactModal'

const HERO_BG =
  'https://images.unsplash.com/photo-1737573296361-75315239293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000'

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

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [isLogin, setIsLogin] = useState(true)
  const [loginId, setLoginId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [isUsernameChecking, setIsUsernameChecking] = useState(false)
  const [isUsernameChecked, setIsUsernameChecked] = useState(false)
  const [usernameCheckMessage, setUsernameCheckMessage] = useState('')
  const [showFindIdForm, setShowFindIdForm] = useState(false)
  const [findName, setFindName] = useState('')
  const [findEmail, setFindEmail] = useState('')
  const [isFindingId, setIsFindingId] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [showContactModal, setShowContactModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isPortalPath = location.pathname.startsWith('/portal')

  // 이미 로그인한 경우 대시보드로 리다이렉트
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      console.log('LandingPage - 로그인 상태 확인:', authenticated)
      if (authenticated) {
        const returnTo = searchParams.get('returnTo')
        if (returnTo) {
          console.log('returnTo로 리다이렉트:', returnTo)
          navigate(returnTo, { replace: true })
        } else {
          // returnTo가 없으면 대시보드로 리다이렉트
          console.log('대시보드로 리다이렉트')
          navigate('/dashboard', { replace: true })
        }
      }
    }
    checkAuth()
  }, [navigate, searchParams])

  // 폼 초기화
  const resetForm = () => {
    setEmail('')
    setLoginId('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setUsername('')
    setIsUsernameChecked(false)
    setUsernameCheckMessage('')
    setShowFindIdForm(false)
    setFindName('')
    setFindEmail('')
    setErrors({})
    setGeneralError('')
    setSuccessMessage('')
  }

  // 탭 변경 시 폼 초기화
  const handleTabChange = (login: boolean) => {
    setIsLogin(login)
    resetForm()
  }

  const handleUsernameCheck = async () => {
    const trimmed = username.trim()
    if (!validateUsername(trimmed)) {
      setErrors((prev) => ({
        ...prev,
        username: '아이디는 4~20자 영문, 숫자, 언더스코어(_)만 가능합니다.',
      }))
      setIsUsernameChecked(false)
      setUsernameCheckMessage('')
      return
    }

    setIsUsernameChecking(true)
    try {
      const result = await checkUsernameAvailability(trimmed)
      if (result.data?.available) {
        setIsUsernameChecked(true)
        setUsernameCheckMessage('사용 가능한 아이디입니다.')
        setErrors((prev) => {
          const next = { ...prev }
          delete next.username
          return next
        })
      } else {
        setIsUsernameChecked(false)
        setUsernameCheckMessage('이미 사용 중인 아이디입니다.')
        setErrors((prev) => ({
          ...prev,
          username: '이미 사용 중인 아이디입니다.',
        }))
      }
    } catch (error) {
      setIsUsernameChecked(false)
      setUsernameCheckMessage('')
      setErrors((prev) => ({
        ...prev,
        username: error instanceof Error ? error.message : '아이디 확인 중 오류가 발생했습니다.',
      }))
    } finally {
      setIsUsernameChecking(false)
    }
  }

  const handleFindUsername = async () => {
    if (!findName.trim() || !findEmail.trim()) {
      setGeneralError('아이디 찾기를 위해 이름과 이메일을 입력해주세요.')
      return
    }
    try {
      setIsFindingId(true)
      const result = await findUsername({
        name: findName.trim(),
        email: findEmail.trim(),
      })
      if (result.data?.username) {
        setGeneralError('')
        setSuccessMessage(`회원 아이디는 "${result.data.username}" 입니다.`)
        setShowFindIdForm(false)
        setFindName('')
        setFindEmail('')
      }
    } catch (error) {
      setSuccessMessage('')
      setGeneralError(error instanceof Error ? error.message : '아이디 찾기에 실패했습니다.')
    } finally {
      setIsFindingId(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setSuccessMessage('')

    if (isLogin) {
      // 로그인 로직
      // 입력 검증
      if (!loginId || !password) {
        setErrors({
          loginId: !loginId ? '아이디를 입력해주세요.' : '',
          password: !password ? '비밀번호를 입력해주세요.' : '',
        })
        return
      }

      setIsLoading(true)

      try {
        // 로그인 API 호출
        const response = await login({ loginId: loginId.trim(), password })

        if (response.success && response.data) {
          // 토큰 및 사용자 정보 저장
          if (response.data.accessToken && response.data.refreshToken) {
            saveTokens(response.data.accessToken, response.data.refreshToken)
          }
          saveUser({
            userId: response.data.userId,
            username: response.data.username,
            email: response.data.email || '',
            name: response.data.name,
            tokenBalance: response.data.tokenBalance ?? 0,
            walletAddress: response.data.walletAddress || '',
            role: response.data.role,
          })

          setSuccessMessage('로그인되었습니다!')
          // 1초 후 대시보드로 리다이렉트
          setTimeout(() => {
            const returnTo = searchParams.get('returnTo')
            navigate(returnTo || '/dashboard', { replace: true })
          }, 1000)
        }
      } catch (error) {
        if (error instanceof Error) {
          setGeneralError(error.message)
        } else {
          setGeneralError('로그인 중 오류가 발생했습니다.')
        }
      } finally {
        setIsLoading(false)
      }
      return
    }

    // 회원가입 로직
    const formData = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim() || undefined,
      password,
      confirmPassword,
    }

    // 유효성 검사
    const validation = validateSignUpForm(formData)
    if (!validation.isValid) {
      const errorMap: Record<string, string> = {}
      validation.errors.forEach((error) => {
        if (error.field) {
          errorMap[error.field] = error.message
        }
      })
      setErrors(errorMap)
      return
    }

    if (!isUsernameChecked) {
      setErrors((prev) => ({
        ...prev,
        username: '아이디 중복확인을 완료해주세요.',
      }))
      return
    }

    setIsLoading(true)

    try {
      // 회원가입 API 호출
      const response = await signUp(formData)

      if (response.success && response.data) {
        // 토큰 및 사용자 정보 저장
        if (response.data.accessToken && response.data.refreshToken) {
          saveTokens(response.data.accessToken, response.data.refreshToken)
        }
        saveUser({
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email || '',
          name: response.data.name,
          tokenBalance: response.data.tokenBalance ?? 0,
          walletAddress: response.data.walletAddress || '',
          role: response.data.role,
        })

        setSuccessMessage('회원가입이 완료되었습니다! 자동으로 로그인되었습니다.')
        // 2초 후 대시보드로 리다이렉트
        setTimeout(() => {
          const returnTo = searchParams.get('returnTo')
          navigate(returnTo || '/dashboard', { replace: true })
        }, 2000)
      }
    } catch (error) {
      if (error instanceof Error) {
        setGeneralError(error.message)
      } else {
        setGeneralError('회원가입 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="ilc-site landing-page">
      <nav className="ilc-nav" aria-label="회원 포털 내비게이션">
        <div className="ilc-nav__inner">
          <div className="ilc-nav__row">
            <div className="ilc-portal-nav__brand">
              <Link to="/" className="ilc-nav__logo">
                ILC
              </Link>
              <span className="ilc-portal-nav__sub">회원 포털</span>
            </div>

            <div className="ilc-nav__desktop">
              <Link
                to="/"
                className={
                  !isPortalPath ? 'ilc-nav__link ilc-nav__link--active' : 'ilc-nav__link'
                }
              >
                공식 홈
              </Link>
              <a href="#about" className="ilc-nav__link">
                프로젝트 소개
              </a>
              <a href="#features" className="ilc-nav__link">
                주요 기능
              </a>
              {isAuthenticated() ? (
                <>
                  <Link to="/dashboard" className="ilc-nav__link">
                    대시보드
                  </Link>
                  <Link to="/membership" className="ilc-nav__link">
                    회원권
                  </Link>
                  <Link to="/docs" className="ilc-nav__link">
                    문서
                  </Link>
                  <Link to="/profile" className="ilc-nav__link">
                    프로필
                  </Link>
                </>
              ) : (
                <a
                  href="#contact"
                  className="ilc-nav__link"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowContactModal(true)
                  }}
                >
                  문의하기
                </a>
              )}
              <Link
                to="/portal"
                className={isPortalPath ? 'ilc-nav__link ilc-nav__link--active' : 'ilc-nav__link'}
              >
                로그인
              </Link>
            </div>

            <button
              type="button"
              className="ilc-nav__mobile-btn"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="ilc-nav__mobile-panel">
              <div className="ilc-nav__mobile-panel-inner">
                <Link
                  to="/"
                  className={!isPortalPath ? 'ilc-nav__mobile-link ilc-nav__mobile-link--active' : 'ilc-nav__mobile-link'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  공식 홈
                </Link>
                <a
                  href="#about"
                  className="ilc-nav__mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  프로젝트 소개
                </a>
                <a
                  href="#features"
                  className="ilc-nav__mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  주요 기능
                </a>
                {isAuthenticated() ? (
                  <>
                    <Link to="/dashboard" className="ilc-nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>
                      대시보드
                    </Link>
                    <Link to="/membership" className="ilc-nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>
                      회원권
                    </Link>
                    <Link to="/docs" className="ilc-nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>
                      문서
                    </Link>
                    <Link to="/profile" className="ilc-nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>
                      프로필
                    </Link>
                  </>
                ) : (
                  <a
                    href="#contact"
                    className="ilc-nav__mobile-link"
                    onClick={(e) => {
                      e.preventDefault()
                      setMobileMenuOpen(false)
                      setShowContactModal(true)
                    }}
                  >
                    문의하기
                  </a>
                )}
                <Link
                  to="/portal"
                  className={isPortalPath ? 'ilc-nav__mobile-link ilc-nav__mobile-link--active' : 'ilc-nav__mobile-link'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  로그인
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="ilc-main">
      {/* 히어로 — 홈페이지와 동일 다크 히어로 + 로그인 폼 */}
      <section className="ilc-hero portal-hero">
        <div className="ilc-hero__bg" aria-hidden>
          <img src={HERO_BG} alt="" />
          <div className="ilc-hero__bg-shade" />
        </div>
        <div className="ilc-hero__inner">
          <div className="portal-hero__grid">
            <div className="ilc-hero__content">
              <p className="ilc-hero__eyebrow">INNOVATION LAB COMMUNITY</p>
              <h2 className="portal-hero__title">
                ILC 회원 전용 포털에
                <br />
                오신 것을 환영합니다
              </h2>
              <p className="ilc-hero__subtitle">
                회원권 및 이용권을 보유하신 회원님만 접근 가능한 프리미엄 콘텐츠와 커뮤니티를
                경험해보세요.
              </p>
              <div className="portal-hero__chips">
                <span className="portal-hero__chip">📚 프로젝트 문서</span>
                <span className="portal-hero__chip">👥 회원 커뮤니티</span>
                <span className="portal-hero__chip">🎫 회원권 관리</span>
              </div>
            </div>
            <div className="hero-form">
              <div className="form-tabs">
                <button
                  type="button"
                  className={`tab ${isLogin ? 'active' : ''}`}
                  onClick={() => handleTabChange(true)}
                >
                  로그인
                </button>
                <button
                  type="button"
                  className={`tab ${!isLogin ? 'active' : ''}`}
                  onClick={() => handleTabChange(false)}
                >
                  회원가입
                </button>
              </div>

              {/* 성공 메시지 */}
              {successMessage && (
                <div className="alert alert-success">
                  <span className="alert-icon">✓</span>
                  {successMessage}
                </div>
              )}

              {/* 일반 에러 메시지 */}
              {generalError && (
                <div className="alert alert-error">
                  <span className="alert-icon">✕</span>
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) {
                          setErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.name
                            return newErrors
                          })
                        }
                      }}
                      placeholder="이름을 입력하세요"
                      required={!isLogin}
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>
                )}

                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="username">회원 아이디</label>
                    <div className="username-check-row">
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value)
                          setIsUsernameChecked(false)
                          setUsernameCheckMessage('')
                          if (errors.username) {
                            setErrors((prev) => {
                              const next = { ...prev }
                              delete next.username
                              return next
                            })
                          }
                        }}
                        placeholder="아이디를 입력하세요 (4~20자)"
                        required={!isLogin}
                        className={errors.username ? 'error' : ''}
                      />
                      <button
                        type="button"
                        className="username-check-btn"
                        onClick={handleUsernameCheck}
                        disabled={isUsernameChecking || !username.trim()}
                      >
                        {isUsernameChecking ? '확인 중...' : '중복확인'}
                      </button>
                    </div>
                    {usernameCheckMessage && (
                      <span className="password-hint">{usernameCheckMessage}</span>
                    )}
                    {errors.username && (
                      <span className="error-message">{errors.username}</span>
                    )}
                  </div>
                )}

                {!isLogin && (
                  <div className="form-group">
                  <label htmlFor="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) {
                        setErrors((prev) => {
                          const newErrors = { ...prev }
                          delete newErrors.email
                          return newErrors
                        })
                      }
                    }}
                    placeholder="이메일을 입력하세요 (선택)"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                  </div>
                )}

                {isLogin && (
                  <div className="form-group">
                    <label htmlFor="loginId">회원 아이디</label>
                    <input
                      type="text"
                      id="loginId"
                      value={loginId}
                      onChange={(e) => {
                        setLoginId(e.target.value)
                        if (errors.loginId) {
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next.loginId
                            return next
                          })
                        }
                      }}
                      placeholder="회원 아이디를 입력하세요"
                      required={isLogin}
                      className={errors.loginId ? 'error' : ''}
                    />
                    {errors.loginId && (
                      <span className="error-message">{errors.loginId}</span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="password">비밀번호</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) {
                        setErrors((prev) => {
                          const newErrors = { ...prev }
                          delete newErrors.password
                          return newErrors
                        })
                      }
                    }}
                    placeholder="비밀번호를 입력하세요 (최소 8자)"
                    required
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                  {!isLogin && !errors.password && password && (
                    <span className="password-hint">
                      영문, 숫자, 특수문자 중 2가지 이상 포함
                    </span>
                  )}
                </div>

                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (errors.confirmPassword) {
                          setErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.confirmPassword
                            return newErrors
                          })
                        }
                      }}
                      placeholder="비밀번호를 다시 입력하세요"
                      required={!isLogin}
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && (
                      <span className="error-message">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                )}

                {isLogin && (
                  <div className="form-options">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span>로그인 상태 유지</span>
                    </label>
                    <a
                      href="#find-id"
                      className="forgot-link"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowFindIdForm((prev) => !prev)
                        setGeneralError('')
                        setSuccessMessage('')
                      }}
                    >
                      아이디 찾기
                    </a>
                  </div>
                )}

                {isLogin && showFindIdForm && (
                  <div className="find-id-box">
                    <p className="find-id-title">아이디 찾기</p>
                    <div className="form-group">
                      <label htmlFor="findName">이름</label>
                      <input
                        id="findName"
                        type="text"
                        value={findName}
                        onChange={(e) => setFindName(e.target.value)}
                        placeholder="가입 시 입력한 이름"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="findEmail">이메일</label>
                      <input
                        id="findEmail"
                        type="email"
                        value={findEmail}
                        onChange={(e) => setFindEmail(e.target.value)}
                        placeholder="가입 시 입력한 이메일"
                      />
                    </div>
                    <div className="find-id-actions">
                      <button type="button" className="find-id-btn" onClick={handleFindUsername} disabled={isFindingId}>
                        {isFindingId ? '조회 중...' : '아이디 조회'}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="ilc-btn-dark landing-page__submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      처리 중...
                    </>
                  ) : (
                    isLogin ? '로그인' : '회원가입'
                  )}
                </button>

                {!isLogin && (
                  <p className="terms-text">
                    회원가입 시{' '}
                    <a href="#terms">이용약관</a> 및{' '}
                    <a href="#privacy">개인정보처리방침</a>에 동의하게 됩니다.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 프로젝트 소개 섹션 */}
      <section id="about" className="about-section ilc-features">
        <div className="container">
          <h2 className="section-title ilc-page__h1 ilc-page__h1--center">
            ILC 프로젝트 소개
          </h2>
          <div className="about-content">
            <div className="about-card">
              <div className="card-icon">🎯</div>
              <h3>비전</h3>
              <p>
                ILC는 혁신적인 기술과 커뮤니티를 통해 미래를 만들어갑니다.
                회원 여러분과 함께 성장하는 생태계를 구축합니다.
              </p>
            </div>
            <div className="about-card">
              <div className="card-icon">🚀</div>
              <h3>목표</h3>
              <p>
                지속 가능한 발전과 회원 중심의 서비스를 제공하여
                최고의 가치를 창출합니다.
              </p>
            </div>
            <div className="about-card">
              <div className="card-icon">📈</div>
              <h3>로드맵</h3>
              <p>
                단계별로 체계적인 계획을 수립하여 프로젝트를 진행하며,
                회원 여러분께 투명하게 공유합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section id="features" className="features-section ilc-lp-section--muted">
        <div className="container">
          <h2 className="section-title ilc-page__h1 ilc-page__h1--center">주요 기능</h2>
          <div className="features-grid">
            <div
              className="feature-card clickable"
              onClick={() => {
                console.log('회원 인증 및 관리 클릭됨')
                const authenticated = isAuthenticated()
                console.log('로그인 상태:', authenticated)
                if (authenticated) {
                  console.log('프로필 페이지로 이동')
                  navigate('/profile')
                } else {
                  console.log('로그인 폼으로 스크롤')
                  // 로그인하지 않은 경우 로그인 폼으로 스크롤
                  const heroSection = document.querySelector('.portal-hero')
                  if (heroSection) {
                    heroSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }
              }}
            >
              <div className="feature-card-icon">🔐</div>
              <h3>회원 인증 및 관리</h3>
              <p>
                안전한 이메일/비밀번호 인증과 2단계 인증을 통한
                강화된 보안 시스템
              </p>
            </div>
            <div
              className="feature-card clickable"
              onClick={() => {
                if (isAuthenticated()) {
                  navigate('/docs')
                } else {
                  navigate('/portal?returnTo=/docs')
                }
              }}
            >
              <div className="feature-card-icon">📄</div>
              <h3>프로젝트 정보</h3>
              <p>
                백서, 기술 문서, 보고서 등 다양한 자료를
                회원 전용으로 제공
              </p>
            </div>
            <div
              className="feature-card clickable"
              onClick={() => {
                if (isAuthenticated()) {
                  navigate('/membership')
                } else {
                  navigate('/portal?returnTo=/membership')
                }
              }}
            >
              <div className="feature-card-icon">🎫</div>
              <h3>회원권 관리</h3>
              <p>
                보유 회원권 및 이용권 현황을 한눈에 확인하고
                갱신 및 업그레이드 가능
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">💬</div>
              <h3>커뮤니티</h3>
              <p>
                공지사항, 자유 게시판, Q&A를 통해
                회원 간 활발한 소통
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🔔</div>
              <h3>알림 시스템</h3>
              <p>
                이메일 및 푸시 알림으로 중요한 정보를
                실시간으로 받아보세요
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">📊</div>
              <h3>대시보드</h3>
              <p>
                회원권 현황, 사용 내역, 결제 내역을
                통합 관리하는 대시보드
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 문의하기 — 홈 CTA 톤 */}
      <section id="contact" className="ilc-home-cta landing-contact">
        <div className="ilc-home-cta__blur" aria-hidden />
        <div className="container landing-contact__inner">
          <div className="ilc-home-cta__inner">
            <h2 className="ilc-home-cta__h2">문의하기</h2>
            <p className="ilc-home-cta__p">
              궁금한 점이나 문의사항이 있으시면 언제든지 연락주세요.
              <br />
              빠른 시일 내에 답변드리겠습니다.
            </p>
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-info-item">
                  <div className="contact-icon">📧</div>
                  <h3>이메일</h3>
                  <p>support@ilc.com</p>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">📞</div>
                  <h3>전화</h3>
                  <p>02-1234-5678</p>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">⏰</div>
                  <h3>운영시간</h3>
                  <p>평일 09:00 - 18:00</p>
                </div>
              </div>
              <div className="contact-form-section">
                <button
                  type="button"
                  className="ilc-btn-dark landing-contact__btn"
                  onClick={() => setShowContactModal(true)}
                >
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <footer className="ilc-footer">
        <div className="ilc-footer__inner">
          <div className="ilc-footer__grid">
            <div>
              <div className="ilc-footer__brand">ILC 회원 포털</div>
              <p className="ilc-footer__text">회원 전용 프리미엄 서비스</p>
            </div>
            <div>
              <h3 className="ilc-footer__h4">바로가기</h3>
              <div className="ilc-footer__links">
                <Link to="/">공식 홈</Link>
                <Link to="/announcements">공지사항</Link>
                <a href="#about">프로젝트 소개</a>
                <a href="#features">주요 기능</a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    const el = document.getElementById('contact')
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' })
                      setTimeout(() => setShowContactModal(true), 400)
                    } else {
                      setShowContactModal(true)
                    }
                  }}
                >
                  문의하기
                </a>
              </div>
            </div>
            <div>
              <h3 className="ilc-footer__h4">문의</h3>
              <p className="ilc-footer__text">이메일: support@ilc.com</p>
              <p className="ilc-footer__text">전화: 02-1234-5678</p>
            </div>
          </div>
          <div className="ilc-footer__bottom">
            © {new Date().getFullYear()} ILC. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 문의하기 모달 */}
      {showContactModal && (
        <ContactModal
          onClose={() => setShowContactModal(false)}
          onSuccess={() => {
            setShowContactModal(false)
          }}
        />
      )}
    </div>
  )
}

export default LandingPage

