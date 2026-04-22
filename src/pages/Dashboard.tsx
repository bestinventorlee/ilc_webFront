import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getUser } from '../utils/token'
import './Dashboard.css'

const Dashboard = () => {
  const user = getUser()
  const navigate = useNavigate()

  useEffect(() => {
    // 페이지 로드 시 토큰 자동 갱신 확인
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  return (
    <div className="dashboard">
      <Header />
      <div className="container">
        <h1>대시보드</h1>
        <div className="welcome-section">
          <h2>환영합니다, {user?.name}님!</h2>
          <p>이메일: {user?.email}</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🎫</div>
            <h3>회원권 현황</h3>
            <p>보유 회원권 및 이용권을 확인하세요</p>
            <button className="card-button" onClick={() => navigate('/membership')}>
              확인하기
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📄</div>
            <h3>프로젝트 문서</h3>
            <p>ILC 프로젝트 관련 문서를 다운로드하세요</p>
            <button className="card-button" onClick={() => navigate('/docs')}>
              문서 보기
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💬</div>
            <h3>커뮤니티</h3>
            <p>회원들과 소통하고 정보를 공유하세요</p>
            <button className="card-button" onClick={() => navigate('/community')}>
              커뮤니티 가기
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>자료실</h3>
            <p>다양한 자료를 다운로드하고 활용하세요</p>
            <button className="card-button" onClick={() => navigate('/library')}>
              자료실 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

