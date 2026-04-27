import {
  SignUpData,
  SignUpResponse,
  LoginData,
  LoginResponse,
  RefreshTokenResponse,
  UsernameCheckResponse,
  FindUsernameData,
  FindUsernameResponse,
} from '../types/auth'

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
        username: data.username,
        email: data.email || undefined,
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
 * 회원 아이디 중복 확인
 */
export const checkUsernameAvailability = async (username: string): Promise<UsernameCheckResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/check-username?username=${encodeURIComponent(username)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || '아이디 중복 확인에 실패했습니다.')
    }
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('아이디 중복 확인 중 오류가 발생했습니다.')
  }
}

/**
 * 아이디 찾기
 */
export const findUsername = async (data: FindUsernameData): Promise<FindUsernameResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/find-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || '아이디 찾기에 실패했습니다.')
    }
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('아이디 찾기 중 오류가 발생했습니다.')
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
        loginId: data.loginId,
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

export const getMyProfile = async (): Promise<{
  userId: string
  username: string
  email?: string
  name: string
  tokenBalance: number
  walletAddress: string
  role: 'admin' | 'user'
}> => {
  const { getAuthHeader } = await import('../utils/token')
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '내 정보 조회에 실패했습니다.')
  }
  return result.data
}

export const saveMyWalletAddress = async (walletAddress: string): Promise<{
  userId: string
  username: string
  email?: string
  name: string
  tokenBalance: number
  walletAddress: string
  role: 'admin' | 'user'
}> => {
  const { getAuthHeader } = await import('../utils/token')
  const response = await fetch(`${API_BASE_URL}/auth/wallet-address`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ walletAddress }),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '지갑 주소 저장에 실패했습니다.')
  }
  return result.data
}

export interface MyTokenTransfer {
  id: string
  amount: string
  tokenSymbol: string
  txHash?: string
  status: 'pending' | 'success' | 'failed'
  errorMessage?: string
  createdAt: string
}

export const getMyTokenTransfers = async (): Promise<MyTokenTransfer[]> => {
  const { getAuthHeader } = await import('../utils/token')
  const response = await fetch(`${API_BASE_URL}/auth/me/token-transfers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || '토큰 이력 조회에 실패했습니다.')
  }
  return (result.data || []) as MyTokenTransfer[]
}

export const sendMyToken = async (receiverWalletAddress: string, amount: string): Promise<void> => {
  const { getAuthHeader } = await import('../utils/token')
  const response = await fetch(`${API_BASE_URL}/auth/me/token-transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ receiverWalletAddress, amount }),
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 404 || response.status === 405) {
      throw new Error('회원간 토큰 전송 API가 아직 준비되지 않았습니다.')
    }
    throw new Error(result?.message || '토큰 전송에 실패했습니다.')
  }
}
