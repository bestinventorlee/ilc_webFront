import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import { getAdminLibraryItems } from '../../services/adminService'
import type { AdminLibraryItem } from '../../types/admin'
import './AdminLibrary.css'

const AdminLibrary = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [items, setItems] = useState<AdminLibraryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setIsLoading(true)
      const data = await getAdminLibraryItems()
      setItems(data)
    } catch (error) {
      console.error('자료실 로드 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-library">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>자료실 관리</h1>
          <p className="admin-subtitle">자료실의 모든 자료를 관리하세요</p>
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
          <p>로딩 중...</p>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>파일 타입</th>
                  <th>다운로드</th>
                  <th>업로드일</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.fileType.toUpperCase()}</td>
                    <td>{item.downloadCount}</td>
                    <td>{new Date(item.uploadDate).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <button className="action-btn-small">수정</button>
                      <button className="action-btn-small delete">삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLibrary

