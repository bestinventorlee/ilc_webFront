import { useState, useEffect } from 'react'
import type { AdminMembership, AdminUser } from '../types/admin'
import './MembershipFormModal.css'

interface MembershipFormModalProps {
  membership?: AdminMembership | null
  users: AdminUser[]
  onClose: () => void
  onSave: (data: {
    userId: string
    membershipType: string
    joinDate: string
    expiryDate?: string
    benefits: string[]
    price?: number
    description?: string
    status: 'active' | 'expired' | 'suspended'
  }) => void
}

const MembershipFormModal = ({ membership, users, onClose, onSave }: MembershipFormModalProps) => {
  const [userId, setUserId] = useState(membership?.userId || '')
  const [membershipType, setMembershipType] = useState(membership?.membershipType || '')
  const [joinDate, setJoinDate] = useState(membership?.joinDate || '')
  const [expiryDate, setExpiryDate] = useState(membership?.expiryDate || '')
  const [benefits, setBenefits] = useState(membership?.benefits.join('\n') || '')
  const [price, setPrice] = useState(membership?.price?.toString() || '')
  const [description, setDescription] = useState(membership?.description || '')
  const [status, setStatus] = useState<'active' | 'expired' | 'suspended'>(membership?.status || 'active')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, isLoading])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!userId) {
      newErrors.userId = '회원을 선택해주세요.'
    }

    if (!membershipType.trim()) {
      newErrors.membershipType = '회원권 종류를 입력해주세요.'
    }

    if (!joinDate) {
      newErrors.joinDate = '가입일을 선택해주세요.'
    }

    if (!benefits.trim()) {
      newErrors.benefits = '혜택을 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    const benefitsArray = benefits.split('\n').filter((b) => b.trim())
    
    onSave({
      userId,
      membershipType: membershipType.trim(),
      joinDate,
      expiryDate: expiryDate || undefined,
      benefits: benefitsArray,
      price: price ? parseInt(price) : undefined,
      description: description.trim() || undefined,
      status,
    })
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'userId') setUserId(value)
    else if (field === 'membershipType') setMembershipType(value)
    else if (field === 'joinDate') setJoinDate(value)
    else if (field === 'expiryDate') setExpiryDate(value)
    else if (field === 'benefits') setBenefits(value)
    else if (field === 'price') setPrice(value)
    else if (field === 'description') setDescription(value)
    else if (field === 'status') setStatus(value as 'active' | 'expired' | 'suspended')

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content membership-form-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{membership ? '회원권 수정' : '회원권 등록'}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="닫기"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="membership-form">
          <div className="modal-body membership-form-body">
            <div className="form-group">
              <label htmlFor="userId">
                회원 선택 <span className="required">*</span>
              </label>
              <select
                id="userId"
                value={userId}
                onChange={(e) => handleChange('userId', e.target.value)}
                disabled={isLoading || !!membership}
                className={errors.userId ? 'error' : ''}
              >
                <option value="">회원을 선택하세요</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.userId && <span className="field-error">{errors.userId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="membershipType">
                회원권 종류 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="membershipType"
                value={membershipType}
                onChange={(e) => handleChange('membershipType', e.target.value)}
                disabled={isLoading}
                className={errors.membershipType ? 'error' : ''}
                placeholder="예: 프리미엄 회원권"
              />
              {errors.membershipType && <span className="field-error">{errors.membershipType}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="joinDate">
                  가입일 <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="joinDate"
                  value={joinDate}
                  onChange={(e) => handleChange('joinDate', e.target.value)}
                  disabled={isLoading}
                  className={errors.joinDate ? 'error' : ''}
                />
                {errors.joinDate && <span className="field-error">{errors.joinDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="expiryDate">만료일</label>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">가격 (원)</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  disabled={isLoading}
                  placeholder="예: 99000"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">상태</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  disabled={isLoading}
                >
                  <option value="active">활성</option>
                  <option value="expired">만료</option>
                  <option value="suspended">정지</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="benefits">
                혜택 <span className="required">*</span>
              </label>
              <textarea
                id="benefits"
                value={benefits}
                onChange={(e) => handleChange('benefits', e.target.value)}
                disabled={isLoading}
                className={errors.benefits ? 'error' : ''}
                placeholder="각 혜택을 줄바꿈으로 구분하세요&#10;예:&#10;무제한 문서 다운로드&#10;프리미엄 커뮤니티"
                rows={4}
              />
              {errors.benefits && <span className="field-error">{errors.benefits}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">설명</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={isLoading}
                placeholder="회원권에 대한 추가 설명을 입력하세요"
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer membership-form-footer">
            <button
              type="button"
              className="form-btn cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </button>
            <button type="submit" className="form-btn submit-btn" disabled={isLoading}>
              {isLoading ? '저장 중...' : membership ? '수정하기' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MembershipFormModal

