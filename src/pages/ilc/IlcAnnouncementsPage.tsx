import { Link } from 'react-router-dom'
import { publicAnnouncements } from '../../data/ilcPublicData'
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

export default function IlcAnnouncementsPage() {
  const pinned = publicAnnouncements.filter((a) => a.isPinned)
  const regular = publicAnnouncements.filter((a) => !a.isPinned)

  return (
    <div className="ilc-page">
      <div className="ilc-page__narrow">
        <h1 className="ilc-page__h1">공지사항</h1>
        <p className="ilc-page__lead">
          ILC의 최신 소식과 중요한 공지사항을 확인하세요
        </p>

        {pinned.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <h2 className="ilc-pin-label">
              <PinIcon /> 고정된 공지
            </h2>
            {pinned.map((a) => (
              <Link key={a.id} to={`/announcements/${a.id}`} className="ilc-announce-pin">
                <div className="ilc-announce-pin__row">
                  <h3 className="ilc-announce-pin__title">{a.title}</h3>
                  <PinIcon />
                </div>
                <p className="ilc-announce-pin__ex">{a.excerpt}</p>
                <div className="ilc-announce-pin__date">
                  <CalendarIcon />
                  {a.date}
                </div>
              </Link>
            ))}
          </div>
        )}

        <h2 className="ilc-pin-label" style={{ marginTop: 0 }}>
          전체 공지사항
        </h2>
        <div className="ilc-announce-list">
          {regular.map((a) => (
            <Link key={a.id} to={`/announcements/${a.id}`} className="ilc-announce-item">
              <h3 className="ilc-announce-item__title">{a.title}</h3>
              <p className="ilc-announce-item__ex">{a.excerpt}</p>
              <div className="ilc-announce-pin__date">
                <CalendarIcon />
                {a.date}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
