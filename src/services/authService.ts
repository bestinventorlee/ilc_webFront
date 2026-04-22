import { SignUpData, SignUpResponse, LoginData, LoginResponse, RefreshTokenResponse } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * 회원가입 API 호출
 */
export const signUp = async (data: SignUpData): Promise<SignUpResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '회원가입에 실패했습니다.')
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
    throw new Error('회원가입 중 오류가 발생했습니다.')
  }
}

/**
 * 로그인 API 호출
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '로그인에 실패했습니다.')
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
    throw new Error('로그인 중 오류가 발생했습니다.')
  }
}

/**
 * 토큰 갱신 API 호출
 */
export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '토큰 갱신에 실패했습니다.')
    }

    return result
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('토큰 갱신 중 오류가 발생했습니다.')
  }
}

/**
 * 로그아웃 API 호출
 */
export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
  } catch (error) {
    console.error('로그아웃 오류:', error)
  }
}
