import { LibraryItem, LibraryListResponse, LibraryDetailResponse } from '../types/library'
import { getAuthHeader } from '../utils/token'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * 자료실 목록 조회 API 호출
 */
export const getLibraryItems = async (category?: string): Promise<LibraryItem[]> => {
  try {
    const url = category 
      ? `${API_BASE_URL}/library?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/library`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result: LibraryListResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '자료실 목록 조회에 실패했습니다.')
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
    throw new Error('자료실 목록 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 자료 상세 정보 조회 API 호출
 */
export const getLibraryItemDetail = async (itemId: string): Promise<LibraryItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/library/${itemId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result: LibraryDetailResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '자료 상세 정보 조회에 실패했습니다.')
    }

    if (!result.data) {
      throw new Error('자료 정보를 찾을 수 없습니다.')
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
    throw new Error('자료 상세 정보 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 자료 다운로드 API 호출
 */
export const downloadLibraryItem = async (itemId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/library/${itemId}/download`, {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
      },
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || '다운로드에 실패했습니다.')
    }
    const downloadUrl = result?.data?.downloadUrl as string | undefined
    if (!downloadUrl) {
      throw new Error('다운로드 URL이 없습니다.')
    }
    window.open(downloadUrl, '_blank', 'noopener,noreferrer')
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('다운로드 중 오류가 발생했습니다.')
  }
}

