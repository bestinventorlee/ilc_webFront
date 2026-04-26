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
      const data = await getLibraryItems()
      setLibraryItems(data)
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
      await downloadLibraryItem(item.id)
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

