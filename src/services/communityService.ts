import { Post, PostListResponse, PostDetailResponse } from '../types/community'
import { getAuthHeader } from '../utils/token'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * 공지사항 목록 조회 API 호출
 */
export const getNotices = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/community/notices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result: PostListResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '공지사항 목록 조회에 실패했습니다.')
    }

    return result.data || []
  } catch (error) {
    // 네트워크 오류 또는 기타 오류 처리
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('공지사항 목록 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 커뮤니티 게시글 목록 조회 API 호출
 */
export const getCommunityPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/community/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result: PostListResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '커뮤니티 게시글 목록 조회에 실패했습니다.')
    }

    return result.data || []
  } catch (error) {
    // 네트워크 오류 또는 기타 오류 처리
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('커뮤니티 게시글 목록 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 게시글 상세 정보 조회 API 호출
 */
export const getPostDetail = async (postId: string): Promise<Post> => {
  try {
    const response = await fetch(`${API_BASE_URL}/community/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result: PostDetailResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '게시글 상세 정보 조회에 실패했습니다.')
    }

    if (!result.data) {
      throw new Error('게시글 정보를 찾을 수 없습니다.')
    }

    return result.data
  } catch (error) {
    // 네트워크 오류 또는 기타 오류 처리
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('게시글 상세 정보 조회 중 오류가 발생했습니다.')
  }
}

