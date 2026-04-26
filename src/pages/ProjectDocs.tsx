import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { getLibraryItems, downloadLibraryItem } from '../services/libraryService'
import type { LibraryItem } from '../types/library'
import './ProjectDocs.css'

const ProjectDocs = () => {
  const [docs, setDocs] = useState<LibraryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 페이지 로드 시 토큰 자동 갱신 확인
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    loadDocs()
  }, [])

  const loadDocs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const items = await getLibraryItems()
      setDocs(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로젝트 문서를 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDocs = useMemo(
    () =>
      docs.filter((item) => {
        const category = item.category.toLowerCase()
        return category === '프로젝트 문서' || category === '문서'
      }),
    [docs]
  )

  const getFileIcon = (fileType: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      xlsx: '📊',
      pptx: '📽️',
      zip: '📦',
    }
    return icons[fileType.toLowerCase()] || '📎'
  }

  const handleDownload = async (item: LibraryItem) => {
    try {
      await downloadLibraryItem(item.id)
      setDocs((prev) =>
        prev.map((doc) => (doc.id === item.id ? { ...doc, downloadCount: doc.downloadCount + 1 } : doc))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : '다운로드 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="project-docs">
      <Header />
      <div className="container">
        <h1>프로젝트 문서</h1>
        <p className="subtitle">ILC 프로젝트 관련 문서를 다운로드하세요</p>
        {isLoading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <div className="docs-empty">
            <p>{error}</p>
            <button className="download-btn" onClick={loadDocs}>
              다시 시도
            </button>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="docs-empty">
            <p>등록된 프로젝트 문서가 없습니다.</p>
          </div>
        ) : (
          <div className="docs-list">
            {filteredDocs.map((doc) => (
              <div className="doc-item" key={doc.id}>
                <div className="doc-icon">{getFileIcon(doc.fileType)}</div>
                <div className="doc-content">
                  <h3>{doc.title}</h3>
                  <p>{doc.description}</p>
                  <button className="download-btn" onClick={() => handleDownload(doc)}>
                    다운로드
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectDocs

