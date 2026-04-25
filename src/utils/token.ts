const ACCESS_TOKEN_KEY = 'ilc_access_token'
const REFRESH_TOKEN_KEY = 'ilc_refresh_token'
const USER_KEY = 'ilc_user'

/**
 * Access Token 저장
 */
export const saveAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

/**
 * Refresh Token 저장
 */
export const saveRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

/**
 * 두 토큰 모두 저장
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  saveAccessToken(accessToken)
  saveRefreshToken(refreshToken)
}

/**
 * Access Token 가져오기
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Refresh Token 가져오기
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * 기존 함수 호환성 (deprecated)
 * @deprecated getAccessToken 사용 권장
 */
export const getToken = (): string | null => {
  return getAccessToken()
}

/**
 * 토큰 삭제
 */
export const removeTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * 기존 함수 호환성 (deprecated)
 * @deprecated removeTokens 사용 권장
 */
export const removeToken = (): void => {
  removeTokens()
}

/**
 * 사용자 정보 저장
 */
export const saveUser = (user: {
  userId: string
  username?: string
  email: string
  name: string
  role?: 'admin' | 'user'
}): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * 사용자 정보 가져오기
 */
export const getUser = (): {
  userId: string
  username?: string
  email: string
  name: string
  role?: 'admin' | 'user'
} | null => {
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * JWT 토큰의 만료 시간 확인
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // JWT 토큰은 base64로 인코딩된 3부분으로 구성: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) return true

    // payload 디코딩
    const payload = JSON.parse(atob(parts[1]))
    
    // exp (expiration time) 확인
    if (!payload.exp) return true

    // 현재 시간과 비교 (초 단위)
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    // 토큰 파싱 실패 시 만료된 것으로 간주
    return true
  }
}

/**
 * Access Token이 만료되었는지 확인
 */
export const isAccessTokenExpired = (): boolean => {
  const token = getAccessToken()
  if (!token) return true
  return isTokenExpired(token)
}

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  const authenticated = accessToken !== null && refreshToken !== null
  console.log('isAuthenticated 체크:', { accessToken: !!accessToken, refreshToken: !!refreshToken, authenticated })
  return authenticated
}

/**
 * Authorization 헤더 생성
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getAccessToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

/**
 * 토큰 갱신 함수
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return null
  }

  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    const result = await response.json()

    if (result.success && result.data?.accessToken) {
      saveAccessToken(result.data.accessToken)
      return result.data.accessToken
    }

    // Refresh Token도 만료된 경우
    if (!result.success) {
      removeTokens()
    }

    return null
  } catch (error) {
    console.error('토큰 갱신 실패:', error)
    removeTokens()
    return null
  }
}

/**
 * 페이지 로드 시 토큰 자동 갱신
 * Access Token이 만료되었고 Refresh Token이 있으면 자동으로 갱신
 */
export const autoRefreshTokenIfNeeded = async (): Promise<boolean> => {
  // Refresh Token이 없으면 갱신 불가
  if (!getRefreshToken()) {
    return false
  }

  // Access Token이 만료되었는지 확인
  if (isAccessTokenExpired()) {
    console.log('Access Token이 만료되어 자동 갱신 중...')
    const newToken = await refreshAccessToken()
    return newToken !== null
  }

  return true
}
