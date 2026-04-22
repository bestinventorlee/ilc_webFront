import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAnnouncementById } from '../../data/ilcPublicData'
import { renderAnnouncementBody } from '../../utils/announcementContent'
import './ilc-site.css'

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

export default function IlcAnnouncementDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const numId = Number(id)
  const announcement = Number.isFinite(numId) ? getAnnouncementById(numId) : undefined

  if (!announcement) {
    return (
      <div className="ilc-page">
        <div className="ilc-page__narrow">
          <Link to="/announcements" className="ilc-back">
            <ArrowLeft /> 목록으로 돌아가기
          </Link>
          <h1 className="ilc-page__h1">공지사항을 찾을 수 없습니다</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="ilc-page">
      <div className="ilc-page__narrow" style={{ maxWidth: '56rem' }}>
        <button type="button" className="ilc-back" onClick={() => navigate('/announcements')}>
          <ArrowLeft /> 목록으로 돌아가기
        </button>

        <article>
          {announcement.isPinned && (
            <div className="ilc-pin-label" style={{ marginBottom: '1rem' }}>
              <PinIcon /> 고정된 공지
            </div>
          )}
          <h1 className="ilc-article-title">{announcement.title}</h1>
          <div className="ilc-article-meta">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CalendarIcon />
              {announcement.date}
            </span>
            <span>작성자: {announcement.author}</span>
          </div>
          <div>{renderAnnouncementBody(announcement.content)}</div>
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e5e5' }}>
            <Link to="/announcements" className="ilc-btn-dark" style={{ display: 'inline-flex' }}>
              목록으로 돌아가기
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
