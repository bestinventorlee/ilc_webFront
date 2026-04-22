export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  userId?: string // 로그인한 사용자의 경우
}

export interface ContactResponse {
  success: boolean
  message: string
  data?: {
    contactId: string
    submittedAt: string
  }
}

