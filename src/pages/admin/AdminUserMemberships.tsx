import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import MembershipFormModal from '../../components/MembershipFormModal'
import {
  createMembership,
  deleteMembership,
  getAdminMembershipTypes,
  getAdminMembershipsByUser,
  getUsers,
  updateMembership,
} from '../../services/adminService'
import type { AdminMembership, AdminMembershipType, AdminUser } from '../../types/admin'
import './AdminMemberships.css'

const AdminUserMemberships = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [memberships, setMemberships] = useState<AdminMembership[]>([])
  const [membershipTypes, setMembershipTypes] = useState<AdminMembershipType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingMembership, setEditingMembership] = useState<AdminMembership | null>(null)

  const selectedUser = useMemo(() => users.find((u) => u.id === userId), [users, userId])

  useEffect(() => {
    if (!userId) {
      setError('잘못된 접근입니다.')
      setIsLoading(false)
      return
    }

    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [usersData, membershipsData, typesData] = await Promise.all([
          getUsers(),
          getAdminMembershipsByUser(userId),
          getAdminMembershipTypes(),
        ])
        setUsers(usersData)
        setMemberships(membershipsData)
        setMembershipTypes(typesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '회원권 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [userId])

  const reloadMemberships = async () => {
    if (!userId) return
    const data = await getAdminMembershipsByUser(userId)
    setMemberships(data)
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
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteMembership(membershipId)
      await reloadMemberships()
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
      if (editingMembership) {
        const { userId: _uid, ...updatePayload } = data
        await updateMembership(editingMembership.id, updatePayload)
        alert('회원권이 수정되었습니다.')
      } else {
        await createMembership(data)
        alert('회원권이 등록되었습니다.')
      }
      await reloadMemberships()
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
          <h1>회원별 회원권 관리</h1>
          <p className="admin-subtitle">
            {selectedUser
              ? `${selectedUser.name} (${selectedUser.username || '-'}) 회원의 회원권을 관리하세요`
              : '선택한 회원의 회원권을 관리하세요'}
          </p>
        </div>

        <div className="admin-controls" style={{ justifyContent: 'space-between' }}>
          <button className="action-btn-small" onClick={() => navigate('/admin/users')}>
            회원관리로 돌아가기
          </button>
          <button className="create-btn" onClick={handleCreateMembership} disabled={!selectedUser}>
            + 회원권 등록
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>회원권 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="empty-container">
            <p>{error}</p>
          </div>
        ) : !selectedUser ? (
          <div className="empty-container">
            <p>선택한 회원 정보를 찾을 수 없습니다.</p>
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

        {showFormModal && selectedUser && (
          <MembershipFormModal
            membership={editingMembership}
            users={users}
            membershipTypes={membershipTypes}
            presetUserId={selectedUser.id}
            lockUserSelection
            lockTemplateFields
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

export default AdminUserMemberships
