import { useState, useEffect } from 'react'
import { submitContact } from '../services/contactService'
import { getUser } from '../utils/token'
import type { ContactFormData } from '../types/contact'
import './ContactModal.css'

interface ContactModalProps {
  onClose: () => void
  onSuccess?: () => void
}

const ContactModal = ({ onClose, onSuccess }: ContactModalProps) => {
  const user = getUser()
  const [formData, setFormData] = useState<ContactFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // 모달이 열릴 때 body 스크롤 방지
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, isLoading])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.'
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '제목을 입력해주세요.'
    }

    if (!formData.message.trim()) {
      newErrors.message = '문의 내용을 입력해주세요.'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '문의 내용은 최소 10자 이상 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSuccessMessage('')

    try {
      // API가 없을 경우를 대비해 더미 처리
      // 실제 API가 준비되면 아래 주석을 해제하고 더미 처리 부분을 제거하세요
      // await submitContact(formData)
      
      // 더미 처리 (API가 준비될 때까지 사용)
      console.log('문의하기 제출:', formData)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 시뮬레이션

      setSuccessMessage('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.')
      
      // 성공 후 폼 초기화
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
        onClose()
      }, 2000)
    } catch (error) {
      console.error('문의하기 제출 오류:', error)
      setErrors({
        general: error instanceof Error ? error.message : '문의하기 제출 중 오류가 발생했습니다.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content contact-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>문의하기</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="닫기"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="modal-body contact-modal-body">
            {successMessage ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>{successMessage}</p>
              </div>
            ) : (
              <>
                {errors.general && (
                  <div className="error-message">{errors.general}</div>
                )}

                <div className="form-group">
                  <label htmlFor="name">
                    이름 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!!user || isLoading}
                    className={errors.name ? 'error' : ''}
                    placeholder="이름을 입력하세요"
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    이메일 <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!user || isLoading}
                    className={errors.email ? 'error' : ''}
                    placeholder="이메일을 입력하세요"
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">전화번호</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="전화번호를 입력하세요 (선택사항)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    제목 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.subject ? 'error' : ''}
                    placeholder="문의 제목을 입력하세요"
                  />
                  {errors.subject && <span className="field-error">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    문의 내용 <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.message ? 'error' : ''}
                    placeholder="문의 내용을 입력하세요 (최소 10자 이상)"
                    rows={6}
                  />
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>
              </>
            )}
          </div>

          {!successMessage && (
            <div className="modal-footer contact-modal-footer">
              <button
                type="button"
                className="contact-btn cancel-btn"
                onClick={onClose}
                disabled={isLoading}
              >
                취소
              </button>
              <button type="submit" className="contact-btn submit-btn" disabled={isLoading}>
                {isLoading ? '전송 중...' : '문의하기'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ContactModal

