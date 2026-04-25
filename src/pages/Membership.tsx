import { useEffect, useState } from 'react'
import Header from '../components/Header'
import MembershipDetailModal from '../components/MembershipDetailModal'
import { getMemberships, getMembershipDetail } from '../services/membershipService'
import type { Membership as MembershipType } from '../types/membership'
import './Membership.css'

const Membership = () => {
  const [memberships, setMemberships] = useState<MembershipType[]>([])
  const [selectedMembership, setSelectedMembership] = useState<MembershipType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 페이지 로드 시 토큰 자동 갱신 확인
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    loadMemberships()
  }, [])

  const loadMemberships = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getMemberships()
      setMemberships(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원권 목록을 불러오는데 실패했습니다.')
      console.error('회원권 목록 로드 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMembershipClick = async (membershipId: string) => {
    try {
      const detail = await getMembershipDetail(membershipId)
      setSelectedMembership(detail)
    } catch (err) {
      console.error('회원권 상세 정보 로드 오류:', err)
      alert('회원권 상세 정보를 불러오는데 실패했습니다.')
    }
  }

  const handleCloseModal = () => {
    setSelectedMembership(null)
  }

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
    <div className="membership">
      <Header />
      <div className="container">
        <h1>회원권 관리</h1>
        <p className="subtitle">보유 회원권 및 이용권 현황을 확인하세요</p>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>회원권 정보를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={loadMemberships}>
              다시 시도
            </button>
          </div>
        ) : memberships.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">🎫</div>
            <p className="empty-message">보유하신 회원권이 없습니다.</p>
          </div>
        ) : (
          <div className="membership-list">
            {memberships.map((membership) => (
              <div
                key={membership.id}
                className="membership-item"
                onClick={() => handleMembershipClick(membership.id)}
              >
                <div className="membership-item-header">
                  <div className="membership-icon">🎫</div>
                  <div className="membership-info">
                    <h3 className="membership-type">{membership.membershipType}</h3>
                    <p className="membership-number">회원권번호: {membership.membershipNumber}</p>
                  </div>
                  <div className="membership-status-badge">
                    <span className={`status-badge ${getStatusClass(membership.status)}`}>
                      {getStatusText(membership.status)}
                    </span>
                  </div>
                </div>

                <div className="membership-item-body">
                  <div className="membership-detail-row">
                    <span className="detail-label">가입일자</span>
                    <span className="detail-value">{formatDate(membership.joinDate)}</span>
                  </div>
                  {membership.expiryDate && (
                    <div className="membership-detail-row">
                      <span className="detail-label">만료일자</span>
                      <span className="detail-value">{formatDate(membership.expiryDate)}</span>
                    </div>
                  )}
                  {membership.remainingDays !== undefined && membership.remainingDays > 0 && (
                    <div className="membership-detail-row">
                      <span className="detail-label">남은 기간</span>
                      <span className="detail-value highlight">
                        {membership.remainingDays}일
                      </span>
                    </div>
                  )}
                  <div className="membership-benefits-preview">
                    <span className="benefits-label">주요 혜택:</span>
                    <span className="benefits-text">
                      {membership.benefits.slice(0, 2).join(', ')}
                      {membership.benefits.length > 2 && ' 외 ' + (membership.benefits.length - 2) + '개'}
                    </span>
                  </div>
                </div>

                <div className="membership-item-footer">
                  <span className="view-detail">상세 정보 보기 →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMembership && (
        <MembershipDetailModal membership={selectedMembership} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default Membership

