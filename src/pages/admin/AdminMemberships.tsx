import { useEffect, useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import Header from '../../components/Header'
import MembershipFormModal from '../../components/MembershipFormModal'
import {
  getAdminMemberships,
  getAdminMembershipTypes,
  getUsers,
  createMembership,
  updateMembership,
  deleteMembership,
} from '../../services/adminService'
import type { AdminMembership, AdminMembershipType, AdminUser } from '../../types/admin'
import './AdminMemberships.css'

const AdminMemberships = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [memberships, setMemberships] = useState<AdminMembership[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [membershipTypes, setMembershipTypes] = useState<AdminMembershipType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingMembership, setEditingMembership] = useState<AdminMembership | null>(null)
  const [presetUserId, setPresetUserId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const p = searchParams.get('presetUser')
    if (!p) return
    setPresetUserId(p)
    setEditingMembership(null)
    setShowFormModal(true)
    const next = new URLSearchParams(searchParams)
    next.delete('presetUser')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const loadData = async () => {
    try {
      setIsLoading(true)
      await Promise.all([loadMemberships(), loadUsers(), loadMembershipTypes()])
    } finally {
      setIsLoading(false)
    }
  }

  const loadMemberships = async () => {
    try {
      const membershipsData = await getAdminMemberships()
      setMemberships(membershipsData)
    } catch (err) {
      console.error('회원권 로드 오류:', err)
    }
  }

  const loadUsers = async (): Promise<AdminUser[]> => {
    try {
      const usersData = await getUsers()
      setUsers(usersData)
      return usersData
    } catch (err) {
      console.error('회원 로드 오류:', err)
      return []
    }
  }

  const loadMembershipTypes = async () => {
    try {
      const types = await getAdminMembershipTypes()
      setMembershipTypes(types)
    } catch (err) {
      console.error('회원권 종류 로드 오류:', err)
    }
  }

  const handleCreateMembership = () => {
    setEditingMembership(null)
    setPresetUserId(null)
    setShowFormModal(true)
  }

  const handleEditMembership = (membership: AdminMembership) => {
    setPresetUserId(null)
    setEditingMembership(membership)
    setShowFormModal(true)
  }

  const handleDeleteMembership = async (membershipId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteMembership(membershipId)
      await loadMemberships()
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
        const { userId: _uid, ...updatePayload } = data
        await updateMembership(editingMembership.id, updatePayload)
        await loadMemberships()
        alert('회원권이 수정되었습니다.')
      } else {
        await createMembership(data)
        await loadMemberships()
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
                  <th>이메일</th>
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
                    <td>{m.userEmail}</td>
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
            membershipTypes={membershipTypes}
            presetUserId={presetUserId}
            onClose={() => {
              setShowFormModal(false)
              setEditingMembership(null)
              setPresetUserId(null)
            }}
            onSave={handleSaveMembership}
          />
        )}
      </div>
    </div>
  )
}

export default AdminMemberships

