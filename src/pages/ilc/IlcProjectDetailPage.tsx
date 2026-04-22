import { Link, useParams } from 'react-router-dom'
import { getProjectById } from '../../data/ilcPublicData'
import './ilc-site.css'

function ArrowLeft() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function statusClass(status: string) {
  if (status === '진행중') return 'ilc-status ilc-status--진행중'
  if (status === '기획') return 'ilc-status ilc-status--기획'
  return 'ilc-status ilc-status--완료'
}

export default function IlcProjectDetailPage() {
  const { id } = useParams()
  const numId = Number(id)
  const project = Number.isFinite(numId) ? getProjectById(numId) : undefined

  if (!project) {
    return (
      <div className="ilc-page">
        <div className="ilc-page__narrow">
          <Link to="/projects" className="ilc-back">
            <ArrowLeft /> 프로젝트 목록
          </Link>
          <h1 className="ilc-page__h1">프로젝트를 찾을 수 없습니다</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="ilc-page">
      <div className="ilc-page__narrow" style={{ maxWidth: '48rem' }}>
        <Link to="/projects" className="ilc-back">
          <ArrowLeft /> 프로젝트 목록
        </Link>

        <span className={statusClass(project.status)} style={{ marginBottom: '1rem', display: 'inline-block' }}>
          {project.status}
        </span>
        <h1 className="ilc-page__h1" style={{ marginBottom: '1rem' }}>
          {project.title}
        </h1>
        <p className="ilc-page__lead" style={{ marginBottom: '2rem' }}>
          {project.description}
        </p>

        <div className="ilc-article-p" style={{ marginBottom: '2rem' }}>
          {project.detailOverview}
        </div>

        <p className="ilc-article-p">
          <strong>시작</strong>: {project.startDate} · <strong>팀</strong>: {project.team}명
        </p>

        <div className="ilc-tags" style={{ marginBottom: '2rem' }}>
          {project.tags.map((tag) => (
            <span key={tag} className="ilc-tag">
              {tag}
            </span>
          ))}
        </div>

        <p className="ilc-article-p" style={{ fontSize: '0.9375rem', color: '#737373' }}>
          상세 협업·문서는{' '}
          <Link to="/portal" style={{ color: '#171717', fontWeight: 600 }}>
            회원 포털
          </Link>
          에서 확인할 수 있습니다.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/projects" className="ilc-btn-dark" style={{ display: 'inline-flex' }}>
            목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}
