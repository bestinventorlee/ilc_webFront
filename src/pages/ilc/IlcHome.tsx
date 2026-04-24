import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { publicProjects } from '../../data/ilcPublicData'
import { getPublicSiteContent } from '../../services/adminService'
import type { HomeSiteContent } from '../../types/siteContent'
import './ilc-site.css'

/** 참고: ILC Jeju Web3.0 레이아웃 — 마리나 히어로·2열 카드·인사이트 패널 */
const IMG_HERO =
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
/** `public/videos/about-hero.mp4` — 메인·회사소개 공용 루프(CC0) */
const HOME_HERO_VIDEO_SRC = '/videos/about-hero.mp4'
const IMG_MARINA =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
const IMG_NOMAD =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
const IMG_ASSET1 =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
const IMG_ASSET2 =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
const IMG_ASSET3 =
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconLightbulb() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.5V19a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4.5A7 7 0 0 0 12 2z" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

/** 홈 노출용 썸네일(프로젝트 목록 데이터와 1~3번 매칭) */
const FEATURED_THUMBS = [IMG_ASSET1, IMG_ASSET2, IMG_ASSET3] as const

export default function IlcHome() {
  const defaultContent: HomeSiteContent = {
    heroEyebrow: 'ILC JEJU · WEB3.0',
    heroTitle: 'ILC',
    heroLead: '혁신을 만들어가는 사람들의 커뮤니티.\n프로젝트와 네트워크를 한곳에서 연결합니다.',
    ctaTitle: '지금 바로 시작하세요',
    ctaLead: 'ILC 회원이 되어 다양한 프로젝트에 참여하고\n네트워크를 확장하세요',
  }
  const [content, setContent] = useState<HomeSiteContent>(defaultContent)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const loaded = await getPublicSiteContent<HomeSiteContent>('home')
        if (loaded) {
          setContent({
            ...defaultContent,
            ...loaded,
          })
        }
      } catch (error) {
        console.error('홈 콘텐츠 로드 오류:', error)
      }
    }
    loadContent()
  }, [])

  const featuredProjects = publicProjects.slice(0, 3).map((p, i) => ({
    ...p,
    thumb: FEATURED_THUMBS[i] ?? IMG_ASSET1,
  }))
  return (
    <div className="ilc-home-landing">
      <section
        className="ilc-hero-card"
        aria-labelledby="ilc-hero-title"
        style={{ ['--home-hero-poster' as string]: `url("${IMG_HERO}")` }}
      >
        <div className="ilc-home-container">
          <div className="ilc-hero-card__frame">
            <div className="ilc-hero-card__media" aria-hidden="true">
              <video
                className="ilc-hero-card__video"
                autoPlay
                muted
                loop
                playsInline
                poster={IMG_HERO}
                preload="metadata"
              >
                <source src={HOME_HERO_VIDEO_SRC} type="video/mp4" />
              </video>
              <div className="ilc-hero-card__gradient" />
            </div>
            <div className="ilc-hero-card__content">
              <p className="ilc-hero-card__eyebrow">{content.heroEyebrow}</p>
              <h1 id="ilc-hero-title" className="ilc-hero-card__title">
                {content.heroTitle}
              </h1>
              <p className="ilc-hero-card__lead">
                {content.heroLead.split('\n').map((line, idx) => (
                  <span key={`${line}-${idx}`}>
                    {line}
                    {idx < content.heroLead.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div className="ilc-hero-card__actions">
                <Link to="/projects" className="ilc-btn-white ilc-btn-white--shadow">
                  프로젝트 보기
                  <ArrowRight />
                </Link>
                <Link to="/portal" className="ilc-btn-wallet">
                  회원 로그인
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ilc-features ilc-features--on-light">
        <div className="ilc-home-container">
          <div className="ilc-features__grid">
            <div>
              <div className="ilc-features__icon">
                <IconUsers />
              </div>
              <h3 className="ilc-features__h3">활발한 커뮤니티</h3>
              <p className="ilc-features__p">
                다양한 분야의 전문가들이 모여 지식을 공유하고 함께 성장합니다
              </p>
            </div>
            <div>
              <div className="ilc-features__icon">
                <IconLightbulb />
              </div>
              <h3 className="ilc-features__h3">혁신적인 프로젝트</h3>
              <p className="ilc-features__p">
                실무에 적용 가능한 프로젝트를 통해 실질적인 경험을 쌓습니다
              </p>
            </div>
            <div>
              <div className="ilc-features__icon">
                <IconTarget />
              </div>
              <h3 className="ilc-features__h3">명확한 목표</h3>
              <p className="ilc-features__p">
                체계적인 로드맵과 함께 목표를 달성해 나갑니다
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ilc-business">
        <div className="ilc-home-container">
          <div className="ilc-business__grid">
            <div>
              <h2 className="ilc-business__heading">Marina Development</h2>
              <article className="ilc-business-card">
                <img src={IMG_MARINA} alt="" className="ilc-business-card__img" />
                <div className="ilc-business-card__body">
                  <p>
                    요트 호텔·풀빌라·국제회의 시설을 아우르는 하이엔드 복합 마리나 개발을 비전으로
                    ILC와 연계된 단계별 로드맵을 공유합니다.
                  </p>
                </div>
              </article>
            </div>
            <div>
              <h2 className="ilc-business__heading">Digital Nomad Village</h2>
              <article className="ilc-business-card">
                <img src={IMG_NOMAD} alt="" className="ilc-business-card__img" />
                <div className="ilc-business-card__body">
                  <p>
                    글로벌 크리에이터·노마드를 위한 코워킹·창작 스튜디오 구축을 목표로,
                    커뮤니티 기반 공간을 설계합니다.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="ilc-dash-panel">
        <div className="ilc-home-container">
          <h2 className="ilc-dash-panel__title">프로젝트 인사이트</h2>
          <div className="ilc-dash-panel__grid">
            <div>
              <h3 className="ilc-dash-panel__subtitle">누적 성장 지표</h3>
              <div className="ilc-dash-chart" role="img" aria-label="성장 지표 플레이스홀더">
                회원·프로젝트 참여 추이 그래프 영역
              </div>
            </div>
            <div>
              <h3 className="ilc-dash-panel__subtitle">주요 프로젝트</h3>
              <ul className="ilc-dash-list">
                {featuredProjects.map((project) => (
                  <li key={project.id}>
                    <Link
                      to={`/projects/${project.id}`}
                      className="ilc-dash-item"
                      aria-label={`${project.title} 프로젝트 상세 보기`}
                    >
                      <img src={project.thumb} alt="" className="ilc-dash-item__img" />
                      <div className="ilc-dash-item__info">
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>
                      </div>
                      <span className="ilc-dash-item__tag">{project.status}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ilc-home-cta">
        <div className="ilc-home-cta__blur" aria-hidden />
        <div className="ilc-home-cta__inner">
          <h2 className="ilc-home-cta__h2">{content.ctaTitle}</h2>
          <p className="ilc-home-cta__p">
            {content.ctaLead.split('\n').map((line, idx) => (
              <span key={`${line}-${idx}`}>
                {line}
                {idx < content.ctaLead.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
          <Link to="/portal" className="ilc-btn-dark">
            회원가입 / 로그인
            <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}
