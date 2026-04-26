import { useState, useEffect, useCallback } from 'react'
import type { AdminMembership, AdminMembershipType, AdminUser } from '../types/admin'
import './MembershipFormModal.css'

function addDaysFromJoinDate(joinDate: string, days: number): string {
  const d = new Date(joinDate + 'T12:00:00')
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

interface MembershipFormModalProps {
  membership?: AdminMembership | null
  users: AdminUser[]
  membershipTypes: AdminMembershipType[]
  presetUserId?: string | null
  onPresetConsumed?: () => void
  lockUserSelection?: boolean
  lockTemplateFields?: boolean
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

const MembershipFormModal = ({
  membership,
  users,
  membershipTypes,
  presetUserId,
  onPresetConsumed,
  lockUserSelection = false,
  lockTemplateFields = false,
  onClose,
  onSave,
}: MembershipFormModalProps) => {
  const [userId, setUserId] = useState(membership?.userId || '')
  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [membershipType, setMembershipType] = useState(membership?.membershipType || '')
  const [joinDate, setJoinDate] = useState(membership?.joinDate || '')
  const [expiryDate, setExpiryDate] = useState(membership?.expiryDate || '')
  const [benefits, setBenefits] = useState(membership?.benefits.join('\n') || '')
  const [price, setPrice] = useState(membership?.price?.toString() || '')
  const [description, setDescription] = useState(membership?.description || '')
  const [note, setNote] = useState(membership?.description || '')
  const [status, setStatus] = useState<'active' | 'expired' | 'suspended'>(membership?.status || 'active')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const applyTypeTemplate = useCallback(
    (type: AdminMembershipType, join: string) => {
      setMembershipType(type.name)
      setBenefits(type.benefits.join('\n'))
      setPrice(type.price != null ? String(type.price) : '')
      if (!lockTemplateFields) {
        setDescription(type.description ?? '')
      }
      if (type.defaultDurationDays != null && join) {
        setExpiryDate(addDaysFromJoinDate(join, type.defaultDurationDays))
      }
    },
    [lockTemplateFields]
  )

  useEffect(() => {
    if (!membership) {
      setSelectedTypeId('')
      return
    }
    const match = membershipTypes.find((t) => t.name === membership.membershipType)
    setSelectedTypeId(match ? match.id : '__orphan__')
  }, [membership, membershipTypes])

  useEffect(() => {
    if (membership) return
    if (!presetUserId) return
    if (!users.some((u) => u.id === presetUserId)) return
    setUserId(presetUserId)
    onPresetConsumed?.()
  }, [presetUserId, users, membership, onPresetConsumed])

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
      newErrors.membershipType = '회원권 종류를 선택해주세요.'
    }

    if (!membership) {
      if (membershipTypes.length === 0) {
        newErrors.membershipType =
          '등록된 회원권 종류가 없습니다. 관리 메뉴의 「회원권 종류」에서 먼저 등록해주세요.'
      } else if (!selectedTypeId) {
        newErrors.membershipType = '목록에서 회원권 종류를 선택해주세요.'
      }
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
      price: price ? parseInt(price, 10) : undefined,
      description: (lockTemplateFields ? note : description).trim() || undefined,
      status,
    })
    setIsLoading(false)
  }

  const handleTypeSelect = (id: string) => {
    setSelectedTypeId(id)
    if (errors.membershipType) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.membershipType
        return next
      })
    }
    if (!id) {
      return
    }
    if (id === '__orphan__') {
      if (membership) {
        setMembershipType(membership.membershipType)
        setBenefits(membership.benefits.join('\n'))
        setPrice(membership.price?.toString() ?? '')
        if (!lockTemplateFields) {
          setDescription(membership.description ?? '')
        }
        setExpiryDate(membership.expiryDate ?? '')
      }
      return
    }
    const t = membershipTypes.find((x) => x.id === id)
    if (!t) return
    applyTypeTemplate(t, joinDate)
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'userId') setUserId(value)
    else if (field === 'joinDate') {
      setJoinDate(value)
      if (selectedTypeId && selectedTypeId !== '__orphan__') {
        const t = membershipTypes.find((x) => x.id === selectedTypeId)
        if (t?.defaultDurationDays != null && value) {
          setExpiryDate(addDaysFromJoinDate(value, t.defaultDurationDays))
        }
      }
    } else if (field === 'expiryDate') setExpiryDate(value)
    else if (field === 'benefits') setBenefits(value)
    else if (field === 'price') setPrice(value)
    else if (field === 'description') setDescription(value)
    else if (field === 'note') setNote(value)
    else if (field === 'status') setStatus(value as 'active' | 'expired' | 'suspended')

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const orphanOption =
    membership && !membershipTypes.some((t) => t.name === membership.membershipType) ? (
      <option value="__orphan__">{membership.membershipType} (카탈로그에 없음)</option>
    ) : null
  const selectedType =
    selectedTypeId && selectedTypeId !== '__orphan__'
      ? membershipTypes.find((t) => t.id === selectedTypeId)
      : null

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
            type="button"
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
                disabled={isLoading || !!membership || lockUserSelection}
                className={errors.userId ? 'error' : ''}
              >
                <option value="">회원을 선택하세요</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.username || user.email || '이메일 없음'})
                  </option>
                ))}
              </select>
              {errors.userId && <span className="field-error">{errors.userId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="membershipTypeSelect">
                회원권 종류 <span className="required">*</span>
              </label>
              <select
                id="membershipTypeSelect"
                value={selectedTypeId}
                onChange={(e) => handleTypeSelect(e.target.value)}
                disabled={isLoading}
                className={errors.membershipType ? 'error' : ''}
              >
                <option value="">등록된 종류에서 선택</option>
                {membershipTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
                {orphanOption}
              </select>
              {errors.membershipType && <span className="field-error">{errors.membershipType}</span>}
              <p className="field-hint" style={{ marginTop: '0.35rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                「회원권 종류」 메뉴에서 먼저 종류를 등록한 뒤, 여기서 선택하면 혜택·가격 등이 채워집니다.
              </p>
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
                <label htmlFor="expiryDate">만료일 (유효기간 종료)</label>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  disabled={isLoading}
                />
                <p className="field-hint" style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  종류에 기본 일수가 있으면 선택 시 자동으로 채워지며, 필요하면 여기서 수정할 수 있습니다.
                </p>
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
                  disabled={isLoading || lockTemplateFields}
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
                disabled={isLoading || lockTemplateFields}
                className={errors.benefits ? 'error' : ''}
                placeholder="각 혜택을 줄바꿈으로 구분하세요&#10;예:&#10;무제한 문서 다운로드&#10;프리미엄 커뮤니티"
                rows={4}
              />
              {errors.benefits && <span className="field-error">{errors.benefits}</span>}
            </div>

            {lockTemplateFields ? (
              <>
                <div className="form-group">
                  <label htmlFor="templateDescription">설명 (회원권 종류 기본 내용)</label>
                  <textarea
                    id="templateDescription"
                    value={selectedType?.description ?? ''}
                    disabled
                    placeholder="선택한 회원권 종류의 설명이 표시됩니다."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="note">비고 (개별회원 특이사항)</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => handleChange('note', e.target.value)}
                    disabled={isLoading}
                    placeholder="해당 회원에게만 적용되는 특이사항을 입력하세요"
                    rows={3}
                  />
                </div>
              </>
            ) : (
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
            )}
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
