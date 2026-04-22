import { Link } from 'react-router-dom'
import { publicProjects } from '../../data/ilcPublicData'
import './ilc-site.css'

function CalendarIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" />
      <circle cx="9" cy="7" r="4" strokeWidth="2" />
    </svg>
  )
}

function statusClass(status: string) {
  if (status === '진행중') return 'ilc-status ilc-status--진행중'
  if (status === '기획') return 'ilc-status ilc-status--기획'
  return 'ilc-status ilc-status--완료'
}

export default function IlcProjectsPage() {
  return (
    <div className="ilc-page">
      <div className="ilc-page__wide">
        <h1 className="ilc-page__h1">프로젝트</h1>
        <p className="ilc-page__lead">
          ILC에서 진행 중이거나 완료된 다양한 프로젝트를 만나보세요
        </p>

        <div className="ilc-projects-grid">
          {publicProjects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="ilc-project-card">
              <div className="ilc-project-card__top">
                <span className={statusClass(project.status)}>{project.status}</span>
              </div>
              <h3 className="ilc-project-card__h3">{project.title}</h3>
              <p className="ilc-project-card__desc">{project.description}</p>
              <div className="ilc-project-card__meta">
                <CalendarIcon />
                시작: {project.startDate}
              </div>
              <div className="ilc-project-card__meta">
                <UsersIcon />
                팀원: {project.team}명
              </div>
              <div className="ilc-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="ilc-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
