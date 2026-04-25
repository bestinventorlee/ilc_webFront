import { useEffect, useState } from 'react'
import Header from '../components/Header'
import PostDetailModal from '../components/PostDetailModal'
import { getNotices, getCommunityPosts, getPostDetail } from '../services/communityService'
import type { Post } from '../types/community'
import './Community.css'

const Community = () => {
  const [notices, setNotices] = useState<Post[]>([])
  const [communityPosts, setCommunityPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 페이지 로드 시 토큰 자동 갱신 확인
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [noticesData, postsData] = await Promise.all([getNotices(), getCommunityPosts()])
      setNotices(noticesData)
      setCommunityPosts(postsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 목록을 불러오는데 실패했습니다.')
      console.error('게시글 목록 로드 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostClick = async (postId: string) => {
    try {
      const detail = await getPostDetail(postId)
      setSelectedPost(detail)
      setNotices((prev) => prev.map((p) => (p.id === postId ? { ...p, views: detail.views } : p)))
      setCommunityPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, views: detail.views } : p)))
    } catch (err) {
      console.error('게시글 상세 정보 로드 오류:', err)
      alert('게시글 상세 정보를 불러오는데 실패했습니다.')
    }
  }

  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes}분 전`
      }
      return `${hours}시간 전`
    } else if (days < 7) {
      return `${days}일 전`
    }

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="community">
      <Header />
      <div className="container">
        <h1>커뮤니티</h1>
        <p className="subtitle">공지사항과 회원 게시글을 확인하고 소통하세요</p>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>게시글을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={loadPosts}>
              다시 시도
            </button>
          </div>
        ) : (
          <>
            {/* 공지사항 섹션 */}
            <section className="post-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">📢</span>
                  공지사항
                </h2>
                <span className="post-count">{notices.length}개</span>
              </div>
              {notices.length === 0 ? (
                <div className="empty-posts">
                  <p>공지사항이 없습니다.</p>
                </div>
              ) : (
                <div className="post-list">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className={`post-item ${notice.isPinned ? 'pinned' : ''}`}
                      onClick={() => handlePostClick(notice.id)}
                    >
                      {notice.isPinned && <span className="pin-icon">📌</span>}
                      <div className="post-item-content">
                        <h3 className="post-title">{notice.title}</h3>
                        <div className="post-meta-info">
                          <span className="post-author">{notice.author}</span>
                          <span className="post-date">{formatDate(notice.createdAt)}</span>
                          <span className="post-views">조회 {notice.views}</span>
                          <span className="post-likes">좋아요 {notice.likes}</span>
                        </div>
                      </div>
                      <div className="post-arrow">→</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 커뮤니티 게시글 섹션 */}
            <section className="post-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">💬</span>
                  커뮤니티 게시글
                </h2>
                <span className="post-count">{communityPosts.length}개</span>
              </div>
              {communityPosts.length === 0 ? (
                <div className="empty-posts">
                  <p>게시글이 없습니다.</p>
                </div>
              ) : (
                <div className="post-list">
                  {communityPosts.map((post) => (
                    <div
                      key={post.id}
                      className="post-item"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <div className="post-item-content">
                        <div className="post-title-row">
                          <h3 className="post-title">{post.title}</h3>
                          {post.category && (
                            <span className="post-category">{post.category}</span>
                          )}
                        </div>
                        <div className="post-meta-info">
                          <span className="post-author">{post.author}</span>
                          <span className="post-date">{formatDate(post.createdAt)}</span>
                          {post.updatedAt && (
                            <span className="post-updated">수정됨</span>
                          )}
                          <span className="post-views">조회 {post.views}</span>
                          <span className="post-likes">좋아요 {post.likes}</span>
                        </div>
                      </div>
                      <div className="post-arrow">→</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default Community

