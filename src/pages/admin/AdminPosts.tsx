import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import PostFormModal from '../../components/PostFormModal'
import { getAdminPosts, createNotice, updatePost, deletePost } from '../../services/adminService'
import type { AdminPost } from '../../types/admin'
import './AdminPosts.css'

const AdminPosts = () => {
  const navigate = useNavigate()
  const location = useLocation()
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
      const postsData = await getAdminPosts()
      setPosts(postsData)
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
      await deletePost(postId)
      await loadPosts()
      alert('게시글이 삭제되었습니다.')
    } catch (err) {
      console.error('게시글 삭제 오류:', err)
      alert('게시글 삭제에 실패했습니다.')
    }
  }

  const handleSavePost = async (data: { title: string; content: string; isPinned: boolean }) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, data)
        await loadPosts()
        alert('공지사항이 수정되었습니다.')
      } else {
        await createNotice(data)
        await loadPosts()
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

