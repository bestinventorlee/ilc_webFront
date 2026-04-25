export interface SignUpData {
  name: string
  username: string
  email?: string
  password: string
  confirmPassword: string
}

export interface SignUpResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    username: string
    email?: string
    name: string
    role: 'admin' | 'user'
    accessToken: string // Access Token (15분 만료)
    refreshToken: string // Refresh Token (7일 만료)
  }
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data?: {
    accessToken: string
  }
}

export interface LoginData {
  loginId: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    username: string
    email?: string
    name: string
    role: 'admin' | 'user'
    accessToken: string // Access Token (15분 만료)
    refreshToken: string // Refresh Token (15일 만료)
  }
}

export interface SignUpError {
  field?: string
  message: string
}

export interface UsernameCheckResponse {
  success: boolean
  message: string
  data?: {
    available: boolean
  }
}

export interface FindUsernameData {
  name: string
  email: string
}

export interface FindUsernameResponse {
  success: boolean
  message: string
  data?: {
    username: string
  }
}

