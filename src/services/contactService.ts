import { ContactFormData, ContactResponse } from '../types/contact'
import { getAuthHeader, getUser } from '../utils/token'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * 문의하기 제출 API 호출
 */
export const submitContact = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    // 로그인한 사용자의 경우 userId 추가
    const user = getUser()
    const formData: ContactFormData = {
      ...data,
      userId: user?.userId,
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // 로그인한 경우 인증 헤더 추가
    const authHeader = getAuthHeader()
    if (Object.keys(authHeader).length > 0) {
      Object.assign(headers, authHeader)
    }

    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    })

    const result: ContactResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '문의하기 제출에 실패했습니다.')
    }

    return result
  } catch (error) {
    // 네트워크 오류 또는 기타 오류 처리
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('문의하기 제출 중 오류가 발생했습니다.')
  }
}

