import { useEffect } from 'react'
import type { Post } from '../types/community'
import './PostDetailModal.css'

interface PostDetailModalProps {
  post: Post | null
  onClose: () => void
}

const PostDetailModal = ({ post, onClose }: PostDetailModalProps) => {
  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (post) {
      document.addEventListener('keydown', handleEscape)
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [post, onClose])

  if (!post) return null

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
      <div className="modal-content post-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="post-header-info">
            <h2>{post.title}</h2>
            {post.isPinned && <span className="pinned-badge">고정</span>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="modal-body post-modal-body">
          <div className="post-meta">
            <div className="post-meta-row">
              <span className="meta-label">작성자</span>
              <span className="meta-value">{post.author}</span>
            </div>
            <div className="post-meta-row">
              <span className="meta-label">작성일</span>
              <span className="meta-value">{formatDate(post.createdAt)}</span>
            </div>
            {post.updatedAt && (
              <div className="post-meta-row">
                <span className="meta-label">수정일</span>
                <span className="meta-value">{formatDate(post.updatedAt)}</span>
              </div>
            )}
            <div className="post-meta-row">
              <span className="meta-label">조회수</span>
              <span className="meta-value">{post.views.toLocaleString()}</span>
            </div>
            <div className="post-meta-row">
              <span className="meta-label">좋아요</span>
              <span className="meta-value">{post.likes.toLocaleString()}</span>
            </div>
            {post.category && (
              <div className="post-meta-row">
                <span className="meta-label">카테고리</span>
                <span className="meta-value">{post.category}</span>
              </div>
            )}
          </div>

          <div className="post-content">
            <div className="content-text" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
          </div>
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

export default PostDetailModal

