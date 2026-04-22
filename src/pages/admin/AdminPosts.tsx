import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import PostFormModal from '../../components/PostFormModal'
import { getAdminPosts, createNotice, updatePost, deletePost } from '../../services/adminService'
import { getUser } from '../../utils/token'
import type { AdminPost } from '../../types/admin'
import './AdminPosts.css'

const AdminPosts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'notice' | 'community'>('all')
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      // 더미 데이터
      const dummyData: AdminPost[] = [
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
          content: '2024년 1월 한 달간 회원권 갱신 시 20% 할인 이벤트를 진행합니다.',
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
          content: '2024년 1월 20일 오전 2시부터 4시까지 시스템 점검이 진행됩니다.',
          author: '관리자',
          authorId: 'admin',
          createdAt: '2024-01-18T14:00:00Z',
          views: 456,
          likes: 12,
          type: 'notice',
          isPinned: false,
        },
      ]
      setPosts(dummyData)
    } catch (err) {
      console.error('게시글 로드 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNotice = () => {
    setEditingPost(null)
    setShowFormModal(true)
  }

  const handleEditPost = (post: AdminPost) => {
    setEditingPost(post)
    setShowFormModal(true)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    try {
      // API 호출 (더미)
      // await deletePost(postId)
      
      // 더미 처리
      setPosts((prev) => prev.filter((p) => p.id !== postId))
      alert('게시글이 삭제되었습니다.')
    } catch (err) {
      console.error('게시글 삭제 오류:', err)
      alert('게시글 삭제에 실패했습니다.')
    }
  }

  const handleSavePost = async (data: { title: string; content: string; isPinned: boolean }) => {
    try {
      if (editingPost) {
        // 수정 모드
        // const updated = await updatePost(editingPost.id, data)
        
        // 더미 처리
        const updated: AdminPost = {
          ...editingPost,
          ...data,
          updatedAt: new Date().toISOString(),
        }
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? updated : p)))
        alert('공지사항이 수정되었습니다.')
      } else {
        // 생성 모드
        // const newPost = await createNotice(data)
        
        // 더미 처리
        const newPost: AdminPost = {
          id: Date.now().toString(),
          title: data.title,
          content: data.content,
          author: user?.name || '관리자',
          authorId: user?.userId || 'admin',
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0,
          type: 'notice',
          isPinned: data.isPinned,
        }
        setPosts((prev) => [newPost, ...prev])
        alert('공지사항이 등록되었습니다.')
      }
      setShowFormModal(false)
      setEditingPost(null)
    } catch (err) {
      console.error('게시글 저장 오류:', err)
      alert(editingPost ? '공지사항 수정에 실패했습니다.' : '공지사항 등록에 실패했습니다.')
    }
  }

  const filteredPosts = posts.filter(
    (post) => filterType === 'all' || post.type === filterType
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="admin-posts">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>커뮤니티 관리</h1>
          <p className="admin-subtitle">공지사항과 게시글을 관리하세요</p>
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
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              전체 ({posts.length})
            </button>
            <button
              className={`filter-btn ${filterType === 'notice' ? 'active' : ''}`}
              onClick={() => setFilterType('notice')}
            >
              공지사항 ({posts.filter((p) => p.type === 'notice').length})
            </button>
            <button
              className={`filter-btn ${filterType === 'community' ? 'active' : ''}`}
              onClick={() => setFilterType('community')}
            >
              커뮤니티 ({posts.filter((p) => p.type === 'community').length})
            </button>
          </div>
          <button className="create-btn" onClick={handleCreateNotice}>
            + 공지사항 작성
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>게시글을 불러오는 중...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-container">
            <p>게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="posts-list">
            {filteredPosts.map((post) => (
              <div key={post.id} className={`post-item ${post.type === 'notice' ? 'has-actions' : ''}`}>
                <div className="post-item-header">
                  <div className="post-item-info">
                    <div className="post-title-row">
                      {post.isPinned && <span className="pin-badge">고정</span>}
                      <h3 className="post-title">{post.title}</h3>
                    </div>
                    <div className="post-meta">
                      <span className="post-type">
                        {post.type === 'notice' ? '공지사항' : '커뮤니티'}
                      </span>
                      <span className="post-author">{post.author}</span>
                      <span className="post-date">{formatDate(post.createdAt)}</span>
                      {post.updatedAt && (
                        <span className="post-updated">수정됨</span>
                      )}
                      <span className="post-views">조회 {post.views.toLocaleString()}</span>
                      <span className="post-likes">좋아요 {post.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {post.type === 'notice' && (
                  <div className="post-actions-container">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditPost(post)}
                    >
                      수정
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
                <div className="post-content-preview">
                  {post.content.length > 150
                    ? post.content.substring(0, 150) + '...'
                    : post.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {showFormModal && (
          <PostFormModal
            post={editingPost}
            onClose={() => {
              setShowFormModal(false)
              setEditingPost(null)
            }}
            onSave={handleSavePost}
          />
        )}
      </div>
    </div>
  )
}

export default AdminPosts

