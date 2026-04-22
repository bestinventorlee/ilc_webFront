import { useEffect } from 'react'
import Header from '../components/Header'
import './ProjectDocs.css'

const ProjectDocs = () => {
  useEffect(() => {
    // 페이지 로드 시 토큰 자동 갱신 확인
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  return (
    <div className="project-docs">
      <Header />
      <div className="container">
        <h1>프로젝트 문서</h1>
        <p className="subtitle">ILC 프로젝트 관련 문서를 다운로드하세요</p>

        <div className="docs-list">
          <div className="doc-item">
            <div className="doc-icon">📄</div>
            <div className="doc-content">
              <h3>ILC 프로젝트 백서</h3>
              <p>프로젝트의 비전, 목표, 기술 스택에 대한 상세한 문서</p>
              <button className="download-btn">다운로드</button>
            </div>
          </div>

          <div className="doc-item">
            <div className="doc-icon">📋</div>
            <div className="doc-content">
              <h3>기술 문서</h3>
              <p>프로젝트의 기술적 세부사항과 아키텍처</p>
              <button className="download-btn">다운로드</button>
            </div>
          </div>

          <div className="doc-item">
            <div className="doc-icon">📊</div>
            <div className="doc-content">
              <h3>프로젝트 로드맵</h3>
              <p>향후 개발 계획과 마일스톤</p>
              <button className="download-btn">다운로드</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDocs

