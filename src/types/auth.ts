export interface SignUpData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface SignUpResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    email: string
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
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    email: string
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

