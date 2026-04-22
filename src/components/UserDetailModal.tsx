import { useEffect } from 'react'
import type { AdminUser } from '../types/admin'
import './UserDetailModal.css'

interface UserDetailModalProps {
  user: AdminUser
  onClose: () => void
}

const UserDetailModal = ({ user, onClose }: UserDetailModalProps) => {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>회원 상세 정보</h2>
          <button className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="modal-body user-detail-body">
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
        </div>

        <div className="modal-footer user-detail-footer">
          <button className="form-btn close-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal

