import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import { getAdminContacts, answerContact } from '../../services/adminService'
import type { AdminContact } from '../../types/admin'
import './AdminContacts.css'

const AdminContacts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [contacts, setContacts] = useState<AdminContact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<AdminContact | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'answered' | 'closed'>('all')

  useEffect(() => {
    import('../../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const contactsData = await getAdminContacts()
      setContacts(contactsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '문의 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = async (contactId: string) => {
    if (!answerText.trim()) {
      alert('답변 내용을 입력해주세요.')
      return
    }

    try {
      await answerContact(contactId, answerText)
      await loadContacts()
      setSelectedContact(null)
      setAnswerText('')
      alert('답변이 등록되었습니다.')
    } catch (err) {
      alert('답변 등록에 실패했습니다.')
    }
  }

  const filteredContacts = contacts.filter(
    (contact) => filterStatus === 'all' || contact.status === filterStatus
  )

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중'
      case 'answered':
        return '답변완료'
      case 'closed':
        return '완료'
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'answered':
        return 'status-answered'
      case 'closed':
        return 'status-closed'
      default:
        return ''
    }
  }

  return (
    <div className="admin-contacts">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>문의하기 관리</h1>
          <p className="admin-subtitle">회원 문의사항을 확인하고 답변하세요</p>
        </div>

        {/* 관리자 네비게이션 */}
        <div className="admin-nav">
          <button
            className={`nav-btn ${location.pathname === '/admin' ? 'active' : ''}`}
            onClick={() => navigate('/admin')}
          >
            대시보드
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/users' ? 'active' : ''}`}
            onClick={() => navigate('/admin/users')}
          >
            회원 관리
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/membership-types' ? 'active' : ''}`}
            onClick={() => navigate('/admin/membership-types')}
          >
            회원권 종류
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/memberships' ? 'active' : ''}`}
            onClick={() => navigate('/admin/memberships')}
          >
            회원권 관리
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/posts' ? 'active' : ''}`}
            onClick={() => navigate('/admin/posts')}
          >
            커뮤니티 관리
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/library' ? 'active' : ''}`}
            onClick={() => navigate('/admin/library')}
          >
            자료실 관리
          </button>
          <button
            className={`nav-btn ${location.pathname === '/admin/contacts' ? 'active' : ''}`}
            onClick={() => navigate('/admin/contacts')}
          >
            문의하기 관리
          </button>
        </div>

        <div className="admin-controls">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              전체 ({contacts.length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              대기중 ({contacts.filter((c) => c.status === 'pending').length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'answered' ? 'active' : ''}`}
              onClick={() => setFilterStatus('answered')}
            >
              답변완료 ({contacts.filter((c) => c.status === 'answered').length})
            </button>
            <button
              className={`filter-btn ${filterStatus === 'closed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('closed')}
            >
              완료 ({contacts.filter((c) => c.status === 'closed').length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>문의 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={loadContacts}>
              다시 시도
            </button>
          </div>
        ) : (
          <div className="contacts-list">
            {filteredContacts.length === 0 ? (
              <div className="empty-message">문의가 없습니다.</div>
            ) : (
              filteredContacts.map((contact) => (
                <div key={contact.id} className="contact-item">
                  <div className="contact-header">
                    <div className="contact-info">
                      <h3>{contact.subject}</h3>
                      <div className="contact-meta">
                        <span>{contact.name}</span>
                        <span>{contact.email}</span>
                        {contact.phone && <span>{contact.phone}</span>}
                        <span>{formatDate(contact.submittedAt)}</span>
                      </div>
                    </div>
                    <span className={`status-badge ${getStatusClass(contact.status)}`}>
                      {getStatusText(contact.status)}
                    </span>
                  </div>
                  <div className="contact-message">
                    <p>{contact.message}</p>
                  </div>
                  {contact.answer && (
                    <div className="contact-answer">
                      <h4>답변:</h4>
                      <p>{contact.answer}</p>
                      {contact.answeredAt && (
                        <span className="answer-date">
                          {formatDate(contact.answeredAt)}
                        </span>
                      )}
                    </div>
                  )}
                  {contact.status === 'pending' && (
                    <div className="contact-actions">
                      <button
                        className="answer-btn"
                        onClick={() => setSelectedContact(contact)}
                      >
                        답변하기
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 답변 모달 */}
        {selectedContact && (
          <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>답변 작성</h2>
                <button
                  className="modal-close"
                  onClick={() => setSelectedContact(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="question-section">
                  <h3>문의 내용</h3>
                  <p><strong>제목:</strong> {selectedContact.subject}</p>
                  <p><strong>내용:</strong> {selectedContact.message}</p>
                </div>
                <div className="answer-section">
                  <label htmlFor="answer">답변 내용</label>
                  <textarea
                    id="answer"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={6}
                    placeholder="답변 내용을 입력하세요"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setSelectedContact(null)
                    setAnswerText('')
                  }}
                >
                  취소
                </button>
                <button
                  className="submit-btn"
                  onClick={() => handleAnswer(selectedContact.id)}
                >
                  답변 등록
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminContacts

