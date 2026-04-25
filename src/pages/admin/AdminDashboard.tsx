import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import { getAdminStats } from '../../services/adminService'
import type { AdminStats } from '../../types/admin'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    import('../../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAdminStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '통계를 불러오는데 실패했습니다.')
      console.error('통계 로드 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>관리자 대시보드</h1>
          <p className="admin-subtitle">웹사이트 전체 현황을 한눈에 확인하세요</p>
        </div>

        {/* 관리자 네비게이션 */}
        <div className="admin-nav">
          <button
            className={`nav-btn ${location.pathname === '/admin' ? 'active' : ''}`}
            onClick={() => navigate('/admin')}
          >
            대시보드
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/users' ? 'active' : ''}`}
            onClick={() => navigate('/admin/users')}
          >
            회원 관리
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/membership-types' ? 'active' : ''}`}
            onClick={() => navigate('/admin/membership-types')}
          >
            회원권 종류
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/memberships' ? 'active' : ''}`}
            onClick={() => navigate('/admin/memberships')}
          >
            회원권 관리
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/posts' ? 'active' : ''}`}
            onClick={() => navigate('/admin/posts')}
          >
            커뮤니티 관리
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/library' ? 'active' : ''}`}
            onClick={() => navigate('/admin/library')}
          >
            자료실 관리
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/contacts' ? 'active' : ''}`}
            onClick={() => navigate('/admin/contacts')}
          >
            문의하기 관리
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={loadStats}>
              다시 시도
            </button>
          </div>
        ) : stats ? (
          <>
            {/* 통계 카드 */}
            <div className="stats-grid">
              <div className="stat-card" onClick={() => navigate('/admin/users')}>
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>전체 회원</h3>
                  <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card" onClick={() => navigate('/admin/memberships')}>
                <div className="stat-icon">🎫</div>
                <div className="stat-content">
                  <h3>회원권</h3>
                  <p className="stat-number">{stats.totalMemberships.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card" onClick={() => navigate('/admin/posts')}>
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <h3>게시글</h3>
                  <p className="stat-number">{stats.totalPosts.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card" onClick={() => navigate('/admin/library')}>
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3>자료실</h3>
                  <p className="stat-number">{stats.totalLibraryItems.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card" onClick={() => navigate('/admin/contacts')}>
                <div className="stat-icon">📧</div>
                <div className="stat-content">
                  <h3>문의하기</h3>
                  <p className="stat-number">{stats.totalContacts.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* 최근 가입 회원 */}
            <div className="admin-section">
              <h2 className="section-title">최근 가입 회원</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>이름</th>
                      <th>이메일</th>
                      <th>역할</th>
                      <th>가입일</th>
                      <th>최근 로그인</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? '관리자' : '회원'}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 빠른 액션 */}
            <div className="admin-section">
              <h2 className="section-title">빠른 액션</h2>
              <div className="quick-actions">
                <button
                  className="action-btn"
                  onClick={() => navigate('/admin/posts?type=notice')}
                >
                  공지사항 작성
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate('/admin/library')}
                >
                  자료 업로드
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate('/admin/contacts')}
                >
                  문의 확인
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate('/admin/site-content')}
                >
                  메인 콘텐츠 편집
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default AdminDashboard

