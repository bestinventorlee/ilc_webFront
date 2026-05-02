import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getUser, getRefreshToken, removeTokens, saveAccessToken, saveUser } from '../utils/token'
import { getMyProfile, logout, updateProfile, type ProfileUserPayload } from '../services/authService'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const initialUser = getUser()
  const [name, setName] = useState(initialUser?.name || '')
  const [email, setEmail] = useState(initialUser?.email || '')
  const [username, setUsername] = useState(initialUser?.username || '')
  const [editBasic, setEditBasic] = useState(false)
  const [editPassword, setEditPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [savingBasic, setSavingBasic] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getMyProfile()
        if (cancelled) return
        setName(data.name)
        setEmail(data.email || '')
        setUsername(data.username)
        setLoadError(null)
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : '내 정보를 불러오지 못했습니다.')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const persistUserFromPayload = (data: ProfileUserPayload) => {
    saveUser({
      userId: data.userId,
      username: data.username,
      email: data.email ?? '',
      name: data.name,
      tokenBalance: data.tokenBalance,
      walletAddress: data.walletAddress,
      role: data.role,
    })
    setName(data.name)
    setEmail(data.email || '')
    setUsername(data.username)
  }

  const handleSaveBasic = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      window.alert('이름을 입력해주세요.')
      return
    }
    setSavingBasic(true)
    try {
      const data = await updateProfile({
        name: trimmedName,
        email,
      })
      if (data.accessToken) {
        saveAccessToken(data.accessToken)
      }
      persistUserFromPayload(data)
      setEditBasic(false)
      window.alert('기본 정보가 저장되었습니다.')
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSavingBasic(false)
    }
  }

  const handleCancelBasic = () => {
    const u = getUser()
    setName(u?.name || '')
    setEmail(u?.email || '')
    setEditBasic(false)
  }

  const handleSavePassword = async () => {
    if (newPassword.length < 8) {
      window.alert('새 비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }
    if (newPassword !== confirmPassword) {
      window.alert('새 비밀번호와 확인이 일치하지 않습니다.')
      return
    }
    if (!currentPassword) {
      window.alert('현재 비밀번호를 입력해주세요.')
      return
    }
    setSavingPassword(true)
    try {
      const data = await updateProfile({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      if (data.accessToken) {
        saveAccessToken(data.accessToken)
      }
      persistUserFromPayload(data)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setEditPassword(false)
      window.alert('비밀번호가 변경되었습니다.')
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '비밀번호 변경에 실패했습니다.')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleCancelPassword = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setEditPassword(false)
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
        }
      }
      removeTokens()
      navigate('/', { replace: true })
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

        {loadError && <p className="profile-load-error">{loadError}</p>}

        <div className="profile-content">
          <div className="profile-section">
            <h2>기본 정보</h2>
            <div className="info-card">
              <div className="info-item">
                <label>이름</label>
                {editBasic ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <p>{name}</p>
                )}
              </div>
              <div className="info-item">
                <label>이메일</label>
                {editBasic ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="edit-input"
                    placeholder="선택 사항 (비워두면 저장 시 미등록 처리)"
                  />
                ) : (
                  <p>{email || '(미등록)'}</p>
                )}
                <span className="info-note">아이디는 변경할 수 없습니다</span>
              </div>
              <div className="info-item">
                <label>아이디</label>
                <p>{username || '-'}</p>
              </div>
              {editBasic ? (
                <div className="action-buttons inline-actions">
                  <button
                    className="save-btn"
                    type="button"
                    onClick={handleSaveBasic}
                    disabled={savingBasic}
                  >
                    {savingBasic ? '저장 중...' : '저장하기'}
                  </button>
                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={handleCancelBasic}
                    disabled={savingBasic}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button className="edit-btn" type="button" onClick={() => setEditBasic(true)}>
                  정보 수정
                </button>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>비밀번호 변경</h2>
            <div className="info-card">
              {editPassword ? (
                <>
                  <div className="info-item">
                    <label>현재 비밀번호</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="edit-input"
                      placeholder="현재 비밀번호를 입력하세요"
                      autoComplete="current-password"
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
                      autoComplete="new-password"
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
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="action-buttons inline-actions">
                    <button
                      className="save-btn"
                      type="button"
                      onClick={handleSavePassword}
                      disabled={savingPassword}
                    >
                      {savingPassword ? '저장 중...' : '비밀번호 변경'}
                    </button>
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={handleCancelPassword}
                      disabled={savingPassword}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <div className="info-item">
                  <p>비밀번호는 보안상 표시되지 않습니다</p>
                  <button className="edit-btn" type="button" onClick={() => setEditPassword(true)}>
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
                  <button type="button" className="toggle-btn">
                    설정하기
                  </button>
                </div>
              </div>
              <div className="info-item">
                <label>로그인 세션</label>
                <p>현재 활성 세션: 1개</p>
                <button type="button" className="link-btn">
                  세션 관리
                </button>
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
                  <button className="logout-btn" onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
