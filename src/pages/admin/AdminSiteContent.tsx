import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { getAdminSiteContent, updateAdminSiteContent } from '../../services/adminService'
import type { HomeSiteContent } from '../../types/siteContent'
import './AdminDashboard.css'

const defaultContent: HomeSiteContent = {
  heroEyebrow: 'ILC JEJU · WEB3.0',
  heroTitle: 'ILC',
  heroLead: '혁신을 만들어가는 사람들의 커뮤니티.\n프로젝트와 네트워크를 한곳에서 연결합니다.',
  ctaTitle: '지금 바로 시작하세요',
  ctaLead: 'ILC 회원이 되어 다양한 프로젝트에 참여하고\n네트워크를 확장하세요',
}

const AdminSiteContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [content, setContent] = useState<HomeSiteContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await getAdminSiteContent('home')
        if (loaded) {
          const loadedContent = loaded as Partial<HomeSiteContent>
          setContent({
            ...defaultContent,
            ...loadedContent,
          })
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : '콘텐츠를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateAdminSiteContent('home', content)
      setMessage('저장되었습니다.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>사이트 콘텐츠 관리</h1>
          <p className="admin-subtitle">ILC 메인 페이지 문구를 편집합니다.</p>
        </div>

        <div className="admin-nav">
          <button className={`nav-btn ${location.pathname === '/admin' ? 'active' : ''}`} onClick={() => navigate('/admin')}>대시보드</button>
          <button className={`nav-btn ${location.pathname === '/admin/site-content' ? 'active' : ''}`} onClick={() => navigate('/admin/site-content')}>사이트 콘텐츠</button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <p>로딩 중...</p>
          </div>
        ) : (
          <div className="admin-section">
            <h2 className="section-title">홈 콘텐츠</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input value={content.heroEyebrow} onChange={(e) => setContent((p) => ({ ...p, heroEyebrow: e.target.value }))} placeholder="Hero 상단 문구" />
              <input value={content.heroTitle} onChange={(e) => setContent((p) => ({ ...p, heroTitle: e.target.value }))} placeholder="Hero 제목" />
              <textarea value={content.heroLead} onChange={(e) => setContent((p) => ({ ...p, heroLead: e.target.value }))} placeholder="Hero 설명 (줄바꿈 가능)" rows={4} />
              <input value={content.ctaTitle} onChange={(e) => setContent((p) => ({ ...p, ctaTitle: e.target.value }))} placeholder="CTA 제목" />
              <textarea value={content.ctaLead} onChange={(e) => setContent((p) => ({ ...p, ctaLead: e.target.value }))} placeholder="CTA 설명 (줄바꿈 가능)" rows={3} />
              <button className="action-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장'}
              </button>
              {message && <p>{message}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSiteContent
