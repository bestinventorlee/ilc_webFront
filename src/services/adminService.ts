import { getAuthHeader } from '../utils/token'
import type {
  AdminStats,
  AdminUser,
  AdminMembership,
  AdminMembershipType,
  AdminPost,
  AdminLibraryItem,
  AdminContact,
} from '../types/admin'
import type { HomeSiteContent } from '../types/siteContent'

// AdminMembership을 export하기 위해 다시 import
export type { AdminMembership, AdminMembershipType } from '../types/admin'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * 관리자 통계 조회
 */
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '관리자 통계 조회에 실패했습니다.')
    }

    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('관리자 통계 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 회원 목록 조회
 */
export const getUsers = async (): Promise<AdminUser[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원 목록 조회에 실패했습니다.')
    }

    return result.data || []
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('회원 목록 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 회원권 목록 조회 (관리자용)
 */
export const getAdminMemberships = async (): Promise<AdminMembership[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/memberships`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원권 목록 조회에 실패했습니다.')
    }

    return result.data || []
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('회원권 목록 조회 중 오류가 발생했습니다.')
  }
}

export const getAdminMembershipsByUser = async (userId: string): Promise<AdminMembership[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/memberships`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원별 회원권 목록 조회에 실패했습니다.')
    }

    return result.data || []
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('회원별 회원권 목록 조회 중 오류가 발생했습니다.')
  }
}

export const getAdminMembershipTypes = async (): Promise<AdminMembershipType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/membership-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || '회원권 종류 목록 조회에 실패했습니다.')
    }
    return result.data || []
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('회원권 종류 목록 조회 중 오류가 발생했습니다.')
  }
}

export const createMembershipType = async (data: {
  name: string
  membershipNumberFormat: string
  defaultDurationDays?: number | null
  benefits: string[]
  price?: number | null
  description?: string | null
}): Promise<AdminMembershipType> => {
  const response = await fetch(`${API_BASE_URL}/admin/membership-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '회원권 종류 등록에 실패했습니다.')
  }
  return result.data
}

export const updateMembershipType = async (
  id: string,
  data: {
    name: string
    membershipNumberFormat: string
    defaultDurationDays?: number | null
    benefits: string[]
    price?: number | null
    description?: string | null
  }
): Promise<AdminMembershipType> => {
  const response = await fetch(`${API_BASE_URL}/admin/membership-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '회원권 종류 수정에 실패했습니다.')
  }
  return result.data
}

export const deleteMembershipType = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/admin/membership-types/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '회원권 종류 삭제에 실패했습니다.')
  }
}

/**
 * 게시글 목록 조회 (관리자용)
 */
export const getAdminPosts = async (): Promise<AdminPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '게시글 목록 조회에 실패했습니다.')
    }

    return result.data || []
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('게시글 목록 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 자료실 목록 조회 (관리자용)
 */
export const getAdminLibraryItems = async (): Promise<AdminLibraryItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/library`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '자료실 목록 조회에 실패했습니다.')
    }

    return result.data || []
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('자료실 목록 조회 중 오류가 발생했습니다.')
  }
}

export const createLibraryItem = async (data: {
  title: string
  description: string
  category: string
  fileType: string
  fileSize: number
  downloadUrl?: string
  author?: string
  thumbnailUrl?: string
}): Promise<AdminLibraryItem> => {
  const response = await fetch(`${API_BASE_URL}/admin/library`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '자료 등록에 실패했습니다.')
  }
  return result.data
}

export const updateLibraryItem = async (
  id: string,
  data: {
    title: string
    description: string
    category: string
    fileType: string
    fileSize: number
    downloadUrl?: string
    author?: string
    thumbnailUrl?: string
  }
): Promise<AdminLibraryItem> => {
  const response = await fetch(`${API_BASE_URL}/admin/library/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '자료 수정에 실패했습니다.')
  }
  return result.data
}

export const deleteLibraryItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/admin/library/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '자료 삭제에 실패했습니다.')
  }
}

/**
 * 문의하기 목록 조회
 */
export const getAdminContacts = async (): Promise<AdminContact[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/contacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '문의하기 목록 조회에 실패했습니다.')
    }

    return result.data || []
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('문의하기 목록 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 문의하기 답변
 */
export const answerContact = async (contactId: string, answer: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/contacts/${contactId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ answer }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '답변 등록에 실패했습니다.')
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('답변 등록 중 오류가 발생했습니다.')
  }
}

/**
 * 공지사항 생성
 */
export const createNotice = async (data: {
  title: string
  content: string
  isPinned?: boolean
}): Promise<AdminPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/posts/notice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        ...data,
        type: 'notice',
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '공지사항 생성에 실패했습니다.')
    }

    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('공지사항 생성 중 오류가 발생했습니다.')
  }
}

/**
 * 공지사항 수정
 */
export const updatePost = async (
  postId: string,
  data: {
    title: string
    content: string
    isPinned?: boolean
  }
): Promise<AdminPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '게시글 수정에 실패했습니다.')
    }

    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('게시글 수정 중 오류가 발생했습니다.')
  }
}

/**
 * 게시글 삭제
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '게시글 삭제에 실패했습니다.')
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('게시글 삭제 중 오류가 발생했습니다.')
  }
}

/**
 * 회원권 생성
 */
export const createMembership = async (data: {
  userId: string
  membershipType: string
  joinDate: string
  expiryDate?: string
  benefits: string[]
  price?: number
  description?: string
  status: 'active' | 'expired' | 'suspended'
}): Promise<AdminMembership> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/memberships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원권 생성에 실패했습니다.')
    }

    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('회원권 생성 중 오류가 발생했습니다.')
  }
}

/**
 * 회원권 수정
 */
export const updateMembership = async (
  membershipId: string,
  data: {
    membershipType: string
    joinDate: string
    expiryDate?: string
    benefits: string[]
    price?: number
    description?: string
    status: 'active' | 'expired' | 'suspended'
  }
): Promise<AdminMembership> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/memberships/${membershipId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원권 수정에 실패했습니다.')
    }

    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('회원권 수정 중 오류가 발생했습니다.')
  }
}

/**
 * 회원권 삭제
 */
export const deleteMembership = async (membershipId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/memberships/${membershipId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원권 삭제에 실패했습니다.')
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('회원권 삭제 중 오류가 발생했습니다.')
  }
}

export const getAdminSiteContent = async (key: string): Promise<Record<string, unknown> | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/site-content/${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || '사이트 콘텐츠 조회에 실패했습니다.')
    }
    return result.data || null
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('사이트 콘텐츠 조회 중 오류가 발생했습니다.')
  }
}

export const updateAdminSiteContent = async (
  key: string,
  content: HomeSiteContent
): Promise<HomeSiteContent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/site-content/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ content }),
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || '사이트 콘텐츠 저장에 실패했습니다.')
    }
    return result.data as HomeSiteContent
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('사이트 콘텐츠 저장 중 오류가 발생했습니다.')
  }
}

export const getPublicSiteContent = async <T>(key: string): Promise<T | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/content/${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || '공개 콘텐츠 조회에 실패했습니다.')
    }
    return (result.data as T) || null
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('공개 콘텐츠 조회 중 오류가 발생했습니다.')
  }
}

