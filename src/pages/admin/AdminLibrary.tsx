import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import {
  getAdminLibraryItems,
  createLibraryItem,
  updateLibraryItem,
  deleteLibraryItem,
  uploadLibraryFile,
} from '../../services/adminService'
import type { AdminLibraryItem } from '../../types/admin'
import './AdminLibrary.css'

interface LibraryFormState {
  title: string
  description: string
  category: string
  fileType: string
  fileSize: string
  downloadUrl: string
  author: string
  thumbnailUrl: string
}

const initialForm: LibraryFormState = {
  title: '',
  description: '',
  category: '프로젝트 문서',
  fileType: 'pdf',
  fileSize: '0',
  downloadUrl: '',
  author: '',
  thumbnailUrl: '',
}

const AdminLibrary = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [items, setItems] = useState<AdminLibraryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AdminLibraryItem | null>(null)
  const [form, setForm] = useState<LibraryFormState>(initialForm)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setIsLoading(true)
      const data = await getAdminLibraryItems()
      setItems(data)
    } catch (error) {
      console.error('자료실 로드 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (item: AdminLibraryItem) => {
    setEditingItem(item)
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      fileType: item.fileType,
      fileSize: String(item.fileSize),
      downloadUrl: item.downloadUrl || '',
      author: item.author || '',
      thumbnailUrl: item.thumbnailUrl || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setForm(initialForm)
    setSelectedFile(null)
    setSelectedThumbnailFile(null)
  }

  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert('업로드할 파일을 선택해주세요.')
      return
    }
    try {
      setIsUploading(true)
      const uploaded = await uploadLibraryFile(selectedFile)
      setForm((prev) => ({
        ...prev,
        downloadUrl: uploaded.downloadUrl,
        fileType: uploaded.fileType,
        fileSize: String(uploaded.fileSize),
        title: prev.title || uploaded.originalName,
      }))
      alert('파일 업로드가 완료되었습니다.')
    } catch (error) {
      alert(error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadThumbnail = async () => {
    if (!selectedThumbnailFile) {
      alert('썸네일 파일을 선택해주세요.')
      return
    }
    try {
      setIsThumbnailUploading(true)
      const uploaded = await uploadLibraryFile(selectedThumbnailFile)
      setForm((prev) => ({
        ...prev,
        thumbnailUrl: uploaded.downloadUrl,
      }))
      alert('썸네일 업로드가 완료되었습니다.')
    } catch (error) {
      alert(error instanceof Error ? error.message : '썸네일 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsThumbnailUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      fileType: form.fileType.trim().toLowerCase(),
      fileSize: Number(form.fileSize),
      downloadUrl: form.downloadUrl.trim() || undefined,
      author: form.author.trim() || undefined,
      thumbnailUrl: form.thumbnailUrl.trim() || undefined,
    }
    if (
      !payload.title ||
      !payload.description ||
      !payload.category ||
      !payload.fileType ||
      !Number.isFinite(payload.fileSize) ||
      payload.fileSize < 0
    ) {
      alert('필수값을 확인해주세요.')
      return
    }
    try {
      if (editingItem) {
        await updateLibraryItem(editingItem.id, payload)
      } else {
        await createLibraryItem(payload)
      }
      closeModal()
      await loadItems()
    } catch (error) {
      alert(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (item: AdminLibraryItem) => {
    if (!confirm(`"${item.title}" 자료를 삭제하시겠습니까?`)) return
    try {
      await deleteLibraryItem(item.id)
      await loadItems()
    } catch (error) {
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="admin-library">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>자료실 관리</h1>
          <p className="admin-subtitle">자료실의 모든 자료를 관리하세요</p>
          <button className="create-btn" onClick={openCreateModal}>
            자료 등록
          </button>
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
            className={`nav-btn ${location.pathname === '/admin/membership-types' ? 'active' : ''}`}
            onClick={() => navigate('/admin/membership-types')}
          >
            회원권 종류
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

        {isLoading ? (
          <p>로딩 중...</p>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>파일 타입</th>
                  <th>다운로드</th>
                  <th>업로드일</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.fileType.toUpperCase()}</td>
                    <td>{item.downloadCount}</td>
                    <td>{new Date(item.uploadDate).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn-small library-edit-btn btn-fixed"
                          onClick={() => openEditModal(item)}
                        >
                          수정
                        </button>
                        <button
                          className="action-btn-small library-delete-btn btn-fixed"
                          onClick={() => handleDelete(item)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {isModalOpen && (
          <div className="library-modal-overlay" onClick={closeModal}>
            <div className="library-modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingItem ? '자료 수정' : '자료 등록'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="library-form-grid">
                  <label>
                    제목
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    카테고리
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="예: 프로젝트 문서, 문서, 이미지, 동영상"
                      required
                    />
                  </label>
                  <label>
                    파일 타입
                    <input
                      type="text"
                      value={form.fileType}
                      onChange={(e) => setForm((prev) => ({ ...prev, fileType: e.target.value }))}
                      placeholder="예: pdf, docx, png"
                      required
                    />
                  </label>
                  <label>
                    파일 크기(바이트)
                    <input
                      type="number"
                      min="0"
                      value={form.fileSize}
                      onChange={(e) => setForm((prev) => ({ ...prev, fileSize: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    다운로드 URL
                    <input
                      type="text"
                      value={form.downloadUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, downloadUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </label>
                  <label>
                    파일 업로드
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={handleUploadFile}
                      disabled={isUploading}
                    >
                      {isUploading ? '업로드 중...' : '파일 업로드'}
                    </button>
                  </label>
                  <label>
                    작성자
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                    />
                  </label>
                  <label>
                    썸네일 URL
                    <input
                      type="text"
                      value={form.thumbnailUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, thumbnailUrl: e.target.value }))}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedThumbnailFile(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={handleUploadThumbnail}
                      disabled={isThumbnailUploading}
                    >
                      {isThumbnailUploading ? '썸네일 업로드 중...' : '썸네일 업로드'}
                    </button>
                  </label>
                  <label className="library-form-description">
                    설명
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </label>
                </div>
                <div className="library-form-actions">
                  <button type="button" className="cancel-btn" onClick={closeModal}>
                    취소
                  </button>
                  <button type="submit" className="save-btn">
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLibrary

