import { useState, useEffect } from 'react'
import type { AdminPost } from '../types/admin'
import './PostFormModal.css'

interface PostFormModalProps {
  post?: AdminPost | null // 수정 모드일 때 기존 게시글 데이터
  onClose: () => void
  onSave: (data: { title: string; content: string; isPinned: boolean }) => void
}

const PostFormModal = ({ post, onClose, onSave }: PostFormModalProps) => {
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [isPinned, setIsPinned] = useState(post?.isPinned || false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // ESC 키로 모달 닫기
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

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요.'
    }

    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요.'
    } else if (content.trim().length < 10) {
      newErrors.content = '내용은 최소 10자 이상 입력해주세요.'
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
    onSave({
      title: title.trim(),
      content: content.trim(),
      isPinned,
    })
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string | boolean) => {
    if (field === 'title') {
      setTitle(value as string)
    } else if (field === 'content') {
      setContent(value as string)
    } else if (field === 'isPinned') {
      setIsPinned(value as boolean)
    }

    // 해당 필드의 에러 제거
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
      <div className="modal-content post-form-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{post ? '공지사항 수정' : '공지사항 작성'}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="닫기"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="modal-body post-form-body">
            <div className="form-group">
              <label htmlFor="title">
                제목 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => handleChange('title', e.target.value)}
                disabled={isLoading}
                className={errors.title ? 'error' : ''}
                placeholder="공지사항 제목을 입력하세요"
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="content">
                내용 <span className="required">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => handleChange('content', e.target.value)}
                disabled={isLoading}
                className={errors.content ? 'error' : ''}
                placeholder="공지사항 내용을 입력하세요 (최소 10자 이상)"
                rows={10}
              />
              {errors.content && <span className="field-error">{errors.content}</span>}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => handleChange('isPinned', e.target.checked)}
                  disabled={isLoading}
                />
                <span>공지사항 고정 (상단에 고정 표시)</span>
              </label>
            </div>
          </div>

          <div className="modal-footer post-form-footer">
            <button
              type="button"
              className="form-btn cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </button>
            <button type="submit" className="form-btn submit-btn" disabled={isLoading}>
              {isLoading ? '저장 중...' : post ? '수정하기' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostFormModal

