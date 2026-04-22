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
      
      // API가 없을 경우를 대비해 더미 데이터 사용
      // 실제 API가 준비되면 아래 주석을 해제하고 더미 데이터 부분을 제거하세요
      // const [noticesData, postsData] = await Promise.all([
      //   getNotices(),
      //   getCommunityPosts(),
      // ])
      // setNotices(noticesData)
      // setCommunityPosts(postsData)

      // 더미 데이터 (API가 준비될 때까지 사용)
      const dummyNotices: Post[] = [
        {
          id: '1',
          title: 'ILC 프로젝트 업데이트 안내',
          content: '안녕하세요. ILC 프로젝트의 새로운 업데이트가 진행되었습니다.\n\n주요 변경사항:\n- 회원권 관리 시스템 개선\n- 커뮤니티 기능 추가\n- 성능 최적화\n\n자세한 내용은 프로젝트 문서를 참고해주세요.',
          author: '관리자',
          authorId: 'admin',
          createdAt: '2024-01-15T10:00:00Z',
          views: 1250,
          likes: 45,
          type: 'notice',
          isPinned: true,
        },
        {
          id: '2',
          title: '회원권 갱신 이벤트 안내',
          content: '2024년 1월 한 달간 회원권 갱신 시 20% 할인 이벤트를 진행합니다.\n\n이벤트 기간: 2024년 1월 1일 ~ 1월 31일\n할인율: 20%\n\n많은 참여 부탁드립니다!',
          author: '관리자',
          authorId: 'admin',
          createdAt: '2024-01-10T09:30:00Z',
          views: 890,
          likes: 32,
          type: 'notice',
          isPinned: true,
        },
        {
          id: '3',
          title: '시스템 점검 안내',
          content: '2024년 1월 20일 오전 2시부터 4시까지 시스템 점검이 진행됩니다.\n\n점검 시간 동안 서비스 이용이 제한될 수 있습니다.\n불편을 드려 죄송합니다.',
          author: '관리자',
          authorId: 'admin',
          createdAt: '2024-01-18T14:00:00Z',
          views: 456,
          likes: 12,
          type: 'notice',
          isPinned: false,
        },
      ]

      const dummyPosts: Post[] = [
        {
          id: '4',
          title: 'ILC 프로젝트에 대한 질문이 있습니다',
          content: '안녕하세요. ILC 프로젝트를 처음 접하게 되었는데, 어떤 기능들이 있는지 궁금합니다.\n\n특히 회원권 시스템과 커뮤니티 기능에 대해 알고 싶습니다.\n\n답변 부탁드립니다!',
          author: '홍길동',
          authorId: 'user1',
          createdAt: '2024-01-19T11:20:00Z',
          updatedAt: '2024-01-19T15:30:00Z',
          views: 234,
          likes: 8,
          type: 'community',
          category: 'Q&A',
        },
        {
          id: '5',
          title: '회원권 갱신 후기',
          content: '프리미엄 회원권으로 갱신했는데 정말 만족스럽습니다!\n\n특히 프로젝트 문서 다운로드가 무제한이라서 너무 좋아요.\n\n다른 분들도 추천드립니다!',
          author: '김철수',
          authorId: 'user2',
          createdAt: '2024-01-17T16:45:00Z',
          views: 567,
          likes: 25,
          type: 'community',
          category: '후기',
        },
        {
          id: '6',
          title: '커뮤니티 이용 팁 공유',
          content: '커뮤니티를 더 잘 활용하는 방법을 공유하고 싶어요.\n\n1. 검색 기능을 활용하세요\n2. 카테고리별로 분류된 게시글을 확인하세요\n3. 좋아요와 댓글로 소통하세요\n\n함께 성장하는 커뮤니티가 되었으면 좋겠습니다!',
          author: '이영희',
          authorId: 'user3',
          createdAt: '2024-01-16T13:10:00Z',
          views: 345,
          likes: 18,
          type: 'community',
          category: '팁',
        },
        {
          id: '7',
          title: '프로젝트 문서 다운로드 오류',
          content: '프로젝트 문서를 다운로드하려고 하는데 오류가 발생합니다.\n\n에러 메시지: "다운로드 실패"\n\n어떻게 해결할 수 있을까요?',
          author: '박민수',
          authorId: 'user4',
          createdAt: '2024-01-15T10:30:00Z',
          views: 123,
          likes: 3,
          type: 'community',
          category: '문의',
        },
      ]

      setNotices(dummyNotices)
      setCommunityPosts(dummyPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 목록을 불러오는데 실패했습니다.')
      console.error('게시글 목록 로드 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostClick = async (postId: string) => {
    try {
      // API가 없을 경우를 대비해 더미 데이터 사용
      // 실제 API가 준비되면 아래 주석을 해제하고 더미 데이터 부분을 제거하세요
      // const detail = await getPostDetail(postId)
      // setSelectedPost(detail)

      // 더미 데이터에서 찾기
      const allPosts = [...notices, ...communityPosts]
      const post = allPosts.find((p) => p.id === postId)
      if (post) {
        setSelectedPost(post)
      }
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

