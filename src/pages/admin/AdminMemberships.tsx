import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import MembershipFormModal from '../../components/MembershipFormModal'
import {
  getAdminMemberships,
  getUsers,
  createMembership,
  updateMembership,
  deleteMembership,
} from '../../services/adminService'
import type { AdminMembership, AdminUser } from '../../types/admin'
import './AdminMemberships.css'

const AdminMemberships = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [memberships, setMemberships] = useState<AdminMembership[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingMembership, setEditingMembership] = useState<AdminMembership | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      await Promise.all([loadMemberships(), loadUsers()])
    } finally {
      setIsLoading(false)
    }
  }

  const loadMemberships = async () => {
    try {
      // 더미 데이터
      const dummyData: AdminMembership[] = [
        {
          id: '1',
          membershipNumber: 'MEM-2024-001',
          membershipType: '프리미엄 회원권',
          joinDate: '2024-01-15',
          expiryDate: '2025-12-31',
          benefits: ['무제한 문서 다운로드', '프리미엄 커뮤니티'],
          status: 'active',
          remainingDays: 45,
          price: 99000,
          userId: '1',
          userName: '홍길동',
          userEmail: 'hong@example.com',
        },
        {
          id: '2',
          membershipNumber: 'MEM-2024-002',
          membershipType: '베이직 회원권',
          joinDate: '2024-01-20',
          expiryDate: '2024-12-31',
          benefits: ['기본 문서 다운로드'],
          status: 'active',
          remainingDays: 320,
          price: 49000,
          userId: '2',
          userName: '김철수',
          userEmail: 'kim@example.com',
        },
      ]
      setMemberships(dummyData)
    } catch (err) {
      console.error('회원권 로드 오류:', err)
    }
  }

  const loadUsers = async () => {
    try {
      // 더미 데이터
      const dummyUsers: AdminUser[] = [
        {
          id: '1',
          name: '홍길동',
          email: 'hong@example.com',
          role: 'user',
          createdAt: '2024-01-20T10:00:00Z',
          lastLoginAt: '2024-01-25T14:30:00Z',
        },
        {
          id: '2',
          name: '김철수',
          email: 'kim@example.com',
          role: 'user',
          createdAt: '2024-01-19T09:00:00Z',
          lastLoginAt: '2024-01-25T11:20:00Z',
        },
        {
          id: '3',
          name: '이영희',
          email: 'lee@example.com',
          role: 'user',
          createdAt: '2024-01-18T15:00:00Z',
          lastLoginAt: '2024-01-24T16:45:00Z',
        },
      ]
      setUsers(dummyUsers)
    } catch (err) {
      console.error('회원 로드 오류:', err)
    }
  }

  const handleCreateMembership = () => {
    setEditingMembership(null)
    setShowFormModal(true)
  }

  const handleEditMembership = (membership: AdminMembership) => {
    setEditingMembership(membership)
    setShowFormModal(true)
  }

  const handleDeleteMembership = async (membershipId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    try {
      // API 호출 (더미)
      // await deleteMembership(membershipId)
      
      // 더미 처리
      setMemberships((prev) => prev.filter((m) => m.id !== membershipId))
      alert('회원권이 삭제되었습니다.')
    } catch (err) {
      console.error('회원권 삭제 오류:', err)
      alert('회원권 삭제에 실패했습니다.')
    }
  }

  const handleSaveMembership = async (data: {
    userId: string
    membershipType: string
    joinDate: string
    expiryDate?: string
    benefits: string[]
    price?: number
    description?: string
    status: 'active' | 'expired' | 'suspended'
  }) => {
    try {
      const selectedUser = users.find((u) => u.id === data.userId)
      if (!selectedUser) {
        alert('회원을 찾을 수 없습니다.')
        return
      }

      if (editingMembership) {
        // 수정 모드
        // const updated = await updateMembership(editingMembership.id, data)
        
        // 더미 처리
        const updated: AdminMembership = {
          ...editingMembership,
          ...data,
        }
        setMemberships((prev) => prev.map((m) => (m.id === editingMembership.id ? updated : m)))
        alert('회원권이 수정되었습니다.')
      } else {
        // 생성 모드
        // const newMembership = await createMembership(data)
        
        // 더미 처리
        const newMembership: AdminMembership = {
          id: Date.now().toString(),
          membershipNumber: `MEM-2024-${String(memberships.length + 1).padStart(3, '0')}`,
          ...data,
          userId: data.userId,
          userName: selectedUser.name,
          userEmail: selectedUser.email,
          remainingDays: data.expiryDate
            ? Math.ceil(
                (new Date(data.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )
            : undefined,
        }
        setMemberships((prev) => [newMembership, ...prev])
        alert('회원권이 등록되었습니다.')
      }
      setShowFormModal(false)
      setEditingMembership(null)
    } catch (err) {
      console.error('회원권 저장 오류:', err)
      alert(editingMembership ? '회원권 수정에 실패했습니다.' : '회원권 등록에 실패했습니다.')
    }
  }

  return (
    <div className="admin-memberships">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>회원권 관리</h1>
          <p className="admin-subtitle">전체 회원권 현황을 확인하고 관리하세요</p>
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

        <div className="admin-controls">
          <button className="create-btn" onClick={handleCreateMembership}>
            + 회원권 등록
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>회원권 목록을 불러오는 중...</p>
          </div>
        ) : memberships.length === 0 ? (
          <div className="empty-container">
            <p>등록된 회원권이 없습니다.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>회원</th>
                  <th>회원권 종류</th>
                  <th>회원권번호</th>
                  <th>상태</th>
                  <th>가입일</th>
                  <th>만료일</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((m) => (
                  <tr key={m.id}>
                    <td>{m.userName}</td>
                    <td>{m.membershipType}</td>
                    <td>{m.membershipNumber}</td>
                    <td>
                      <span className={`status-badge ${m.status}`}>
                        {m.status === 'active' ? '활성' : m.status === 'expired' ? '만료' : '정지'}
                      </span>
                    </td>
                    <td>{m.joinDate}</td>
                    <td>{m.expiryDate || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn-small edit-btn"
                          onClick={() => handleEditMembership(m)}
                        >
                          수정
                        </button>
                        <button
                          className="action-btn-small delete-btn"
                          onClick={() => handleDeleteMembership(m.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showFormModal && (
          <MembershipFormModal
            membership={editingMembership}
            users={users}
            onClose={() => {
              setShowFormModal(false)
              setEditingMembership(null)
            }}
            onSave={handleSaveMembership}
          />
        )}
      </div>
    </div>
  )
}

export default AdminMemberships

