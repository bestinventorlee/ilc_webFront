import { useEffect } from 'react'
import './LogoutConfirmModal.css'

interface LogoutConfirmModalProps {
  onConfirm: () => void
  onCancel: () => void
}

const LogoutConfirmModal = ({ onConfirm, onCancel }: LogoutConfirmModalProps) => {
  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // 모달이 열릴 때 body 스크롤 방지
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onCancel])

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>로그아웃 확인</h2>
        </div>

        <div className="modal-body confirm-modal-body">
          <div className="confirm-icon">⚠️</div>
          <p className="confirm-message">정말 로그아웃 하시겠습니까?</p>
          <p className="confirm-submessage">로그아웃 후에는 회원 전용 기능을 이용하실 수 없습니다.</p>
        </div>

        <div className="modal-footer confirm-modal-footer">
          <button className="confirm-btn cancel-btn" onClick={onCancel}>
            취소
          </button>
          <button className="confirm-btn confirm-btn-primary" onClick={onConfirm}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirmModal

