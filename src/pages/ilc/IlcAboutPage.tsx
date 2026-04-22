import './ilc-site.css'

/** 히어로 배경: 로딩·접근성(감속) 시 정지 프레임(영상과 톤 통일) */
const ABOUT_HERO_POSTER =
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1920&q=80'
/** `public/videos/about-hero.mp4` — CC0 샘플(MDN flower), 역동적 루프 배경용 */
const ABOUT_HERO_VIDEO_SRC = '/videos/about-hero.mp4'

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconAward() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  )
}

const values = [
  {
    title: '협업과 소통',
    description:
      '다양한 배경을 가진 회원들이 서로의 강점을 나누고 함께 문제를 해결합니다',
    Icon: IconUsers,
  },
  {
    title: '실행과 성과',
    description: '이론보다 실천을 중시하며, 구체적인 결과물을 통해 성장합니다',
    Icon: IconAward,
  },
  {
    title: '지속적 학습',
    description: '끊임없이 새로운 기술을 배우고 변화에 적응하는 문화를 만듭니다',
    Icon: IconTarget,
  },
]

const history = [
  { year: '2024', title: 'ILC 설립', description: '혁신과 학습을 추구하는 커뮤니티 공식 출범' },
  { year: '2025', title: '첫 프로젝트 완료', description: '오픈소스 디자인 시스템 프로젝트 성공적 완료' },
  {
    year: '2026',
    title: '다양한 프로젝트 진행',
    description: 'AI, 블록체인, VR 등 다양한 분야의 프로젝트 동시 진행',
  },
]

export default function IlcAboutPage() {
  return (
    <div>
      <section
        className="ilc-about-hero"
        aria-labelledby="ilc-about-hero-title"
        style={{ ['--about-hero-poster' as string]: `url("${ABOUT_HERO_POSTER}")` }}
      >
        <div className="ilc-about-hero__media" aria-hidden="true">
          <video
            className="ilc-about-hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster={ABOUT_HERO_POSTER}
            preload="metadata"
          >
            <source src={ABOUT_HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          <div className="ilc-about-hero__overlay" />
        </div>
        <div className="ilc-about-hero__inner">
          <h1 id="ilc-about-hero-title" className="ilc-about-hero__h1">
            ILC 소개
          </h1>
          <p className="ilc-about-hero__p">Innovation Learning Community</p>
        </div>
      </section>

      <section className="ilc-about-section">
        <div className="ilc-about-2col">
          <div>
            <div className="ilc-features__icon">
              <IconTarget />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '2rem', color: '#171717' }}>
              우리의 미션
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#525252', lineHeight: 1.75 }}>
              ILC는 혁신적인 기술과 창의적인 아이디어를 가진 사람들이 모여 함께 성장하고 발전하는
              커뮤니티입니다. 우리는 실질적인 프로젝트 경험을 통해 회원들의 역량을 강화하고, 산업 현장에서
              요구하는 실무 능력을 배양합니다.
            </p>
          </div>
          <div>
            <div className="ilc-features__icon">
              <IconEye />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '2rem', color: '#171717' }}>
              우리의 비전
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#525252', lineHeight: 1.75 }}>
              기술 혁신을 선도하는 글로벌 커뮤니티로 성장하여, 회원들이 자신의 잠재력을 최대한 발휘하고 사회에
              긍정적인 영향을 미칠 수 있도록 지원합니다. 지속 가능한 학습 문화와 협업 정신을 바탕으로 미래를
              준비합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="ilc-about-values">
        <h2 className="ilc-about-values__h2">핵심 가치</h2>
        <div className="ilc-about-values__grid">
          {values.map(({ title, description, Icon }) => (
            <div key={title} className="ilc-about-values__item">
              <div className="ilc-about-values__icon">
                <Icon />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#171717' }}>
                {title}
              </h3>
              <p style={{ fontSize: '1.125rem', color: '#525252', lineHeight: 1.75 }}>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ilc-history">
        <h2 className="ilc-history__h2">연혁</h2>
        {history.map((item) => (
          <div key={item.year} className="ilc-history__item">
            <div className="ilc-history__year">{item.year}</div>
            <div className="ilc-history__body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
