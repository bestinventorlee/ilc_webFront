import { useEffect, useState } from 'react'
import { getAdminMembershipsByUser } from '../services/adminService'
import type { AdminMembership, AdminUser } from '../types/admin'
import './UserDetailModal.css'

interface UserDetailModalProps {
  user: AdminUser
  onClose: () => void
  onRegisterMembership?: () => void
}

const UserDetailModal = ({ user, onClose, onRegisterMembership }: UserDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'memberships'>('profile')
  const [memberships, setMemberships] = useState<AdminMembership[]>([])
  const [isMembershipLoading, setIsMembershipLoading] = useState(false)
  const [membershipError, setMembershipError] = useState<string | null>(null)

  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  useEffect(() => {
    if (activeTab !== 'memberships') return

    const loadMemberships = async () => {
      try {
        setIsMembershipLoading(true)
        setMembershipError(null)
        const data = await getAdminMembershipsByUser(user.id)
        setMemberships(data)
      } catch (err) {
        setMembershipError(err instanceof Error ? err.message : '회원권 정보를 불러오지 못했습니다.')
      } finally {
        setIsMembershipLoading(false)
      }
    }

    loadMemberships()
  }, [activeTab, user.id])

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

  const getStatusText = (status: AdminMembership['status']) => {
    if (status === 'active') return '활성'
    if (status === 'expired') return '만료'
    return '정지'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>회원 상세 정보</h2>
          <button className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="modal-body user-detail-body">
          <div className="user-detail-tabs">
            <button
              type="button"
              className={`user-detail-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              기본 정보
            </button>
            <button
              type="button"
              className={`user-detail-tab ${activeTab === 'memberships' ? 'active' : ''}`}
              onClick={() => setActiveTab('memberships')}
            >
              회원권
            </button>
          </div>

          {activeTab === 'profile' ? (
            <div className="user-detail-section">
              <div className="detail-row">
                <span className="detail-label">이름</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">이메일</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">역할</span>
                <span className="detail-value">
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? '관리자' : '회원'}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">가입일</span>
                <span className="detail-value">{formatDate(user.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">최근 로그인</span>
                <span className="detail-value">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : '로그인 기록 없음'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">회원 ID</span>
                <span className="detail-value">{user.id}</span>
              </div>
            </div>
          ) : isMembershipLoading ? (
            <div className="user-membership-placeholder">회원권 정보를 불러오는 중...</div>
          ) : membershipError ? (
            <div className="user-membership-placeholder error">{membershipError}</div>
          ) : memberships.length === 0 ? (
            <div className="user-membership-placeholder">등록된 회원권이 없습니다.</div>
          ) : (
            <div className="user-membership-list">
              {memberships.map((membership) => (
                <div key={membership.id} className="user-membership-item">
                  <div className="user-membership-header">
                    <strong>{membership.membershipType}</strong>
                    <span className={`status-badge ${membership.status}`}>
                      {getStatusText(membership.status)}
                    </span>
                  </div>
                  <div className="user-membership-grid">
                    <span className="detail-label">회원권번호</span>
                    <span className="detail-value">{membership.membershipNumber}</span>
                    <span className="detail-label">기간</span>
                    <span className="detail-value">
                      {membership.joinDate} ~ {membership.expiryDate || '미정'}
                    </span>
                    <span className="detail-label">특이사항</span>
                    <span className="detail-value">{membership.description || '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer user-detail-footer">
          {onRegisterMembership && (
            <button type="button" className="membership-register-btn" onClick={onRegisterMembership}>
              회원권 등록
            </button>
          )}
          <button type="button" className="close-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal

