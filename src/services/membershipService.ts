import { Membership, MembershipListResponse, MembershipDetailResponse } from '../types/membership'
import { getAuthHeader } from '../utils/token'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * 회원권 목록 조회 API 호출
 */
export const getMemberships = async (): Promise<Membership[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/memberships`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result: MembershipListResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원권 목록 조회에 실패했습니다.')
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
    throw new Error('회원권 목록 조회 중 오류가 발생했습니다.')
  }
}

/**
 * 회원권 상세 정보 조회 API 호출
 */
export const getMembershipDetail = async (membershipId: string): Promise<Membership> => {
  try {
    const response = await fetch(`${API_BASE_URL}/memberships/${membershipId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const result: MembershipDetailResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원권 상세 정보 조회에 실패했습니다.')
    }

    if (!result.data) {
      throw new Error('회원권 정보를 찾을 수 없습니다.')
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
    throw new Error('회원권 상세 정보 조회 중 오류가 발생했습니다.')
  }
}

