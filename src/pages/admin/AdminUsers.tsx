import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import UserDetailModal from '../../components/UserDetailModal'
import { getUsers } from '../../services/adminService'
import type { AdminUser } from '../../types/admin'
import './AdminUsers.css'

const AdminUsers = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    import('../../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const usersData = await getUsers()
      setUsers(usersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="admin-users">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>회원 관리</h1>
          <p className="admin-subtitle">전체 회원 목록을 확인하고 관리하세요</p>
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

        <div className="admin-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="회원 검색 (이름, 이메일)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>회원 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={loadUsers}>
              다시 시도
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>아이디</th>
                  <th>이메일</th>
                  <th>역할</th>
                  <th>가입일</th>
                  <th>최근 로그인</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-message">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.username || '-'}</td>
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
                      <td>
                        <div className="action-group">
                          <button
                            type="button"
                            className="action-btn-small"
                            onClick={() => setSelectedUser(user)}
                          >
                            상세
                          </button>
                          <button
                            type="button"
                            className="action-btn-small edit-btn"
                            onClick={() => navigate(`/admin/users/${user.id}/memberships`)}
                          >
                            회원권
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onRegisterMembership={() => {
              navigate(`/admin/users/${selectedUser.id}/memberships`)
              setSelectedUser(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default AdminUsers

