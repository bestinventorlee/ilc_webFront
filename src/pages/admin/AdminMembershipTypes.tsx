import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import {
  getAdminMembershipTypes,
  createMembershipType,
  updateMembershipType,
  deleteMembershipType,
} from '../../services/adminService'
import type { AdminMembershipType } from '../../types/admin'
import './AdminMemberships.css'

const emptyForm = () => ({
  name: '',
  membershipNumberFormat: 'MEM-{YYYY}-{SEQ3}',
  defaultDurationDays: '' as string | number,
  benefits: '',
  price: '',
  description: '',
})

const AdminMembershipTypes = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [rows, setRows] = useState<AdminMembershipType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<AdminMembershipType | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      setIsLoading(true)
      const data = await getAdminMembershipTypes()
      setRows(data)
    } catch (e) {
      console.error(e)
      alert(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm())
    setShowModal(true)
  }

  const openEdit = (row: AdminMembershipType) => {
    setEditing(row)
    setForm({
      name: row.name,
      membershipNumberFormat: row.membershipNumberFormat,
      defaultDurationDays: row.defaultDurationDays ?? '',
      benefits: row.benefits.join('\n'),
      price: row.price != null ? String(row.price) : '',
      description: row.description ?? '',
    })
    setShowModal(true)
  }

  const parseBenefits = () =>
    form.benefits
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      alert('종류 이름을 입력해주세요.')
      return
    }
    if (!form.membershipNumberFormat.trim()) {
      alert('회원권 번호 형식을 입력해주세요.')
      return
    }
    const benefits = parseBenefits()
    if (benefits.length === 0) {
      alert('혜택을 한 줄 이상 입력해주세요.')
      return
    }
    const defaultDurationDays =
      form.defaultDurationDays === '' || form.defaultDurationDays === null
        ? null
        : Number(form.defaultDurationDays)
    if (
      form.defaultDurationDays !== '' &&
      form.defaultDurationDays != null &&
      (Number.isNaN(defaultDurationDays) || defaultDurationDays! < 0)
    ) {
      alert('기본 유효일수는 0 이상의 숫자로 입력해주세요.')
      return
    }
    const price =
      form.price === '' ? null : Number(form.price)
    if (form.price !== '' && (price === null || Number.isNaN(price) || price < 0)) {
      alert('가격은 0 이상의 숫자로 입력해주세요.')
      return
    }
    try {
      setSaving(true)
      const payload = {
        name: form.name.trim(),
        membershipNumberFormat: form.membershipNumberFormat.trim(),
        defaultDurationDays,
        benefits,
        price,
        description: form.description.trim() || null,
      }
      if (editing) {
        await updateMembershipType(editing.id, payload)
        alert('회원권 종류가 수정되었습니다.')
      } else {
        await createMembershipType(payload)
        alert('회원권 종류가 등록되었습니다.')
      }
      setShowModal(false)
      setEditing(null)
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row: AdminMembershipType) => {
    if (!confirm(`「${row.name}」 종류를 삭제할까요?`)) return
    try {
      await deleteMembershipType(row.id)
      alert('삭제되었습니다.')
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    }
  }

  const adminNav = (
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
  )

  return (
    <div className="admin-memberships">
      <Header />
      <div className="container">
        <div className="admin-header">
          <h1>회원권 종류</h1>
          <p className="admin-subtitle">
            회원권 관리에서 선택할 수 있는 종류를 먼저 등록합니다. 기본 유효일수를 넣으면 가입일 기준으로 만료일이
            자동 제안됩니다.
          </p>
        </div>
        {adminNav}
        <div className="admin-controls">
          <button type="button" className="create-btn" onClick={openCreate}>
            + 종류 등록
          </button>
        </div>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>불러오는 중...</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="empty-container">
            <p>등록된 회원권 종류가 없습니다. 위 버튼으로 종류를 추가하세요.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>번호 형식</th>
                  <th>기본 유효일수</th>
                  <th>가격(원)</th>
                  <th>혜택 요약</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td><code>{r.membershipNumberFormat}</code></td>
                    <td>{r.defaultDurationDays != null ? `${r.defaultDurationDays}일` : '-'}</td>
                    <td>{r.price != null ? r.price.toLocaleString() : '-'}</td>
                    <td>
                      {r.benefits.slice(0, 2).join(', ')}
                      {r.benefits.length > 2 ? ` 외 ${r.benefits.length - 2}개` : ''}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="action-btn-small membership-type-edit-btn btn-fixed"
                          onClick={() => openEdit(r)}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="action-btn-small membership-type-delete-btn btn-fixed"
                          onClick={() => handleDelete(r)}
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
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowModal(false)}>
          <div className="modal-content membership-form-modal-content" onClick={(ev) => ev.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? '회원권 종류 수정' : '회원권 종류 등록'}</h2>
              <button type="button" className="modal-close" aria-label="닫기" disabled={saving} onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="membership-form">
              <div className="modal-body membership-form-body">
                <div className="form-group">
                  <label htmlFor="mt-name">
                    종류 이름 <span className="required">*</span>
                  </label>
                  <input
                    id="mt-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={saving}
                    placeholder="예: 프리미엄 12개월"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mt-format">
                    회원권 번호 형식 <span className="required">*</span>
                  </label>
                  <input
                    id="mt-format"
                    value={form.membershipNumberFormat}
                    onChange={(e) => setForm((f) => ({ ...f, membershipNumberFormat: e.target.value }))}
                    disabled={saving}
                    placeholder="예: VIP-{YYYY}-{SEQ4}"
                  />
                  <p className="field-hint" style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    사용 가능 토큰: {'{YYYY}'}, {'{YY}'}, {'{MM}'}, {'{DD}'}, {'{SEQ}'}, {'{SEQ3}'}, {'{SEQ4}'}, {'{SEQ5}'}
                  </p>
                </div>
                <div className="form-group">
                  <label htmlFor="mt-days">기본 유효일수 (선택)</label>
                  <input
                    id="mt-days"
                    type="number"
                    min={0}
                    value={form.defaultDurationDays}
                    onChange={(e) => setForm((f) => ({ ...f, defaultDurationDays: e.target.value }))}
                    disabled={saving}
                    placeholder="가입일부터 며칠 후 만료로 제안할지 (비우면 수동만)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mt-price">가격 (원, 선택)</label>
                  <input
                    id="mt-price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    disabled={saving}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mt-benefits">
                    혜택 <span className="required">*</span>
                  </label>
                  <textarea
                    id="mt-benefits"
                    rows={4}
                    value={form.benefits}
                    onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))}
                    disabled={saving}
                    placeholder="줄바꿈으로 구분"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mt-desc">설명 (선택)</label>
                  <textarea
                    id="mt-desc"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="modal-footer membership-form-footer">
                <button type="button" className="form-btn cancel-btn" disabled={saving} onClick={() => setShowModal(false)}>
                  취소
                </button>
                <button type="submit" className="form-btn submit-btn" disabled={saving}>
                  {saving ? '저장 중...' : editing ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMembershipTypes
