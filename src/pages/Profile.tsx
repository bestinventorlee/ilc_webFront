import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getUser, getRefreshToken, removeTokens } from '../utils/token'
import { logout } from '../services/authService'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    // 페이지 로드 시 토큰 자동 갱신 확인
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  const handleSave = () => {
    // TODO: 프로필 업데이트 API 호출
    console.log('프로필 저장', { name, currentPassword, newPassword })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setIsEditing(false)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    const confirmLogout = window.confirm('정말 로그아웃하시겠습니까?')
    if (!confirmLogout) return

    setIsLoggingOut(true)
    try {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          await logout(refreshToken)
        } catch (error) {
          console.error('로그아웃 API 오류:', error)
          // API 오류가 있어도 로컬 토큰은 삭제
        }
      }
      removeTokens()
      navigate('/', { replace: true })
      // 페이지 새로고침하여 상태 초기화
      window.location.reload()
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="profile">
      <Header />
      <div className="container">
        <h1>회원 인증 및 관리</h1>
        <p className="subtitle">프로필 정보를 관리하고 보안 설정을 변경하세요</p>

        <div className="profile-content">
          <div className="profile-section">
            <h2>기본 정보</h2>
            <div className="info-card">
              <div className="info-item">
                <label>이름</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{user?.name}</p>
                )}
              </div>
              <div className="info-item">
                <label>이메일</label>
                <p>{email}</p>
                <span className="info-note">이메일은 변경할 수 없습니다</span>
              </div>
              <div className="info-item">
                <label>아이디</label>
                <p>{user?.username || '-'}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>비밀번호 변경</h2>
            <div className="info-card">
              {isEditing ? (
                <>
                  <div className="info-item">
                    <label>현재 비밀번호</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="edit-input"
                      placeholder="현재 비밀번호를 입력하세요"
                    />
                  </div>
                  <div className="info-item">
                    <label>새 비밀번호</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="edit-input"
                      placeholder="새 비밀번호를 입력하세요 (최소 8자)"
                    />
                  </div>
                  <div className="info-item">
                    <label>비밀번호 확인</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="edit-input"
                      placeholder="새 비밀번호를 다시 입력하세요"
                    />
                  </div>
                </>
              ) : (
                <div className="info-item">
                  <p>비밀번호는 보안상 표시되지 않습니다</p>
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    비밀번호 변경
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>보안 설정</h2>
            <div className="info-card">
              <div className="info-item">
                <label>2단계 인증 (2FA)</label>
                <div className="toggle-section">
                  <p>추가 보안을 위해 2단계 인증을 활성화하세요</p>
                  <button className="toggle-btn">설정하기</button>
                </div>
              </div>
              <div className="info-item">
                <label>로그인 세션</label>
                <p>현재 활성 세션: 1개</p>
                <button className="link-btn">세션 관리</button>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>계정 관리</h2>
            <div className="info-card">
              <div className="info-item">
                <label>로그아웃</label>
                <div className="logout-section">
                  <p>현재 계정에서 로그아웃합니다</p>
                  <button 
                    className="logout-btn" 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="action-buttons">
              <button className="save-btn" onClick={handleSave}>
                저장하기
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

