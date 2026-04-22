import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { getLibraryItems, downloadLibraryItem } from '../services/libraryService'
import type { LibraryItem } from '../types/library'
import './Library.css'

const Library = () => {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<LibraryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // 페이지 로드 시 토큰 자동 갱신 확인
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    loadLibraryItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [selectedCategory, searchQuery, libraryItems])

  const loadLibraryItems = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // API가 없을 경우를 대비해 더미 데이터 사용
      // 실제 API가 준비되면 아래 주석을 해제하고 더미 데이터 부분을 제거하세요
      // const data = await getLibraryItems()
      // setLibraryItems(data)

      // 더미 데이터 (API가 준비될 때까지 사용)
      const dummyData: LibraryItem[] = [
        {
          id: '1',
          title: 'ILC 프로젝트 백서',
          description: '프로젝트의 비전, 목표, 기술 스택에 대한 상세한 문서입니다.',
          category: '문서',
          fileType: 'pdf',
          fileSize: 2048000, // 2MB
          uploadDate: '2024-01-15T10:00:00Z',
          downloadCount: 1250,
          author: '관리자',
        },
        {
          id: '2',
          title: '기술 문서',
          description: '프로젝트의 기술적 세부사항과 아키텍처에 대한 문서입니다.',
          category: '문서',
          fileType: 'pdf',
          fileSize: 1536000, // 1.5MB
          uploadDate: '2024-01-10T09:30:00Z',
          downloadCount: 890,
          author: '개발팀',
        },
        {
          id: '3',
          title: '프로젝트 로드맵',
          description: '향후 개발 계획과 마일스톤에 대한 로드맵입니다.',
          category: '문서',
          fileType: 'xlsx',
          fileSize: 512000, // 500KB
          uploadDate: '2024-01-05T14:20:00Z',
          downloadCount: 456,
          author: '기획팀',
        },
        {
          id: '4',
          title: '프로젝트 소개 영상',
          description: 'ILC 프로젝트를 소개하는 홍보 영상입니다.',
          category: '동영상',
          fileType: 'mp4',
          fileSize: 52428800, // 50MB
          uploadDate: '2024-01-12T11:15:00Z',
          downloadCount: 234,
          author: '마케팅팀',
        },
        {
          id: '5',
          title: '프로젝트 로고 이미지',
          description: 'ILC 프로젝트 로고 이미지 파일입니다.',
          category: '이미지',
          fileType: 'png',
          fileSize: 1024000, // 1MB
          uploadDate: '2024-01-08T16:45:00Z',
          downloadCount: 567,
          author: '디자인팀',
        },
        {
          id: '6',
          title: '회원 가이드',
          description: '회원 가입 및 이용 가이드 문서입니다.',
          category: '문서',
          fileType: 'docx',
          fileSize: 768000, // 750KB
          uploadDate: '2024-01-20T13:30:00Z',
          downloadCount: 345,
          author: '운영팀',
        },
        {
          id: '7',
          title: 'API 문서',
          description: 'ILC 프로젝트 API 사용 가이드입니다.',
          category: '문서',
          fileType: 'pdf',
          fileSize: 1280000, // 1.25MB
          uploadDate: '2024-01-18T10:00:00Z',
          downloadCount: 678,
          author: '개발팀',
        },
        {
          id: '8',
          title: '프로젝트 브로셔',
          description: '프로젝트 홍보용 브로셔 PDF 파일입니다.',
          category: '문서',
          fileType: 'pdf',
          fileSize: 3072000, // 3MB
          uploadDate: '2024-01-14T15:20:00Z',
          downloadCount: 123,
          author: '마케팅팀',
        },
      ]

      setLibraryItems(dummyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '자료 목록을 불러오는데 실패했습니다.')
      console.error('자료 목록 로드 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = libraryItems

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      )
    }

    setFilteredItems(filtered)
  }

  const handleDownload = async (item: LibraryItem) => {
    try {
      // API가 없을 경우를 대비해 더미 다운로드 처리
      // 실제 API가 준비되면 아래 주석을 해제하고 더미 다운로드 부분을 제거하세요
      // await downloadLibraryItem(item.id)
      
      // 더미 다운로드 처리
      alert(`${item.title} 다운로드를 시작합니다.\n\n(실제 API가 준비되면 파일이 다운로드됩니다)`)
      
      // 다운로드 횟수 증가 (더미)
      setLibraryItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id ? { ...i, downloadCount: i.downloadCount + 1 } : i
        )
      )
    } catch (err) {
      console.error('다운로드 오류:', err)
      alert('다운로드 중 오류가 발생했습니다.')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getFileIcon = (fileType: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      docx: '📝',
      xlsx: '📊',
      pptx: '📽️',
      zip: '📦',
      mp4: '🎬',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
    }
    return icons[fileType.toLowerCase()] || '📎'
  }

  const categories = ['전체', '문서', '이미지', '동영상', '기타']
  const categoryCounts = categories.map((cat) => {
    if (cat === '전체') return libraryItems.length
    return libraryItems.filter((item) => item.category === cat).length
  })

  return (
    <div className="library">
      <Header />
      <div className="container">
        <h1>자료실</h1>
        <p className="subtitle">다양한 자료를 다운로드하고 활용하세요</p>

        {/* 검색 및 필터 */}
        <div className="library-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="자료 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="category-filter">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              <span className="category-count">({categoryCounts[index]})</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>자료를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={loadLibraryItems}>
              다시 시도
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">📁</div>
            <p className="empty-message">
              {searchQuery ? '검색 결과가 없습니다.' : '자료가 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="library-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="library-item">
                <div className="item-icon">{getFileIcon(item.fileType)}</div>
                <div className="item-content">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-meta">
                    <span className="item-category">{item.category}</span>
                    <span className="item-file-type">{item.fileType.toUpperCase()}</span>
                    <span className="item-size">{formatFileSize(item.fileSize)}</span>
                  </div>
                  <div className="item-footer">
                    <div className="item-info">
                      {item.author && <span className="item-author">작성자: {item.author}</span>}
                      <span className="item-date">{formatDate(item.uploadDate)}</span>
                      <span className="item-downloads">다운로드: {item.downloadCount}</span>
                    </div>
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(item)}
                    >
                      다운로드
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Library

