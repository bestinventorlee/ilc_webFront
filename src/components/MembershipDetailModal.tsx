import { useEffect } from 'react'
import { Membership } from '../types/membership'
import './MembershipDetailModal.css'

interface MembershipDetailModalProps {
  membership: Membership | null
  onClose: () => void
}

const MembershipDetailModal = ({ membership, onClose }: MembershipDetailModalProps) => {
  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (membership) {
      document.addEventListener('keydown', handleEscape)
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [membership, onClose])

  if (!membership) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성'
      case 'expired':
        return '만료'
      case 'suspended':
        return '정지'
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'expired':
        return 'status-expired'
      case 'suspended':
        return 'status-suspended'
      default:
        return ''
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>회원권 상세 정보</h2>
          <button className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">회원권 번호</span>
              <span className="detail-value">{membership.membershipNumber}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">회원권 종류</span>
              <span className="detail-value membership-type">{membership.membershipType}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">가입일자</span>
              <span className="detail-value">{formatDate(membership.joinDate)}</span>
            </div>

            {membership.expiryDate && (
              <div className="detail-row">
                <span className="detail-label">만료일자</span>
                <span className="detail-value">{formatDate(membership.expiryDate)}</span>
              </div>
            )}

            {membership.remainingDays !== undefined && (
              <div className="detail-row">
                <span className="detail-label">남은 기간</span>
                <span className="detail-value">
                  {membership.remainingDays > 0 ? `${membership.remainingDays}일` : '만료됨'}
                </span>
              </div>
            )}

            <div className="detail-row">
              <span className="detail-label">상태</span>
              <span className={`detail-value ${getStatusClass(membership.status)}`}>
                {getStatusText(membership.status)}
              </span>
            </div>

            {membership.price && (
              <div className="detail-row">
                <span className="detail-label">가격</span>
                <span className="detail-value">{membership.price.toLocaleString()}원</span>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3 className="section-title">혜택</h3>
            <ul className="benefits-list">
              {membership.benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {membership.description && (
            <div className="detail-section">
              <h3 className="section-title">설명</h3>
              <p className="description-text">{membership.description}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default MembershipDetailModal

