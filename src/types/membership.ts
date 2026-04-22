export interface Membership {
  id: string
  membershipNumber: string // 회원권번호
  membershipType: string // 회원권 종류
  joinDate: string // 가입일자
  expiryDate?: string // 만료일자
  benefits: string[] // 혜택
  status: 'active' | 'expired' | 'suspended' // 상태
  remainingDays?: number // 남은 기간 (일)
  price?: number // 가격
  description?: string // 설명
}

export interface MembershipListResponse {
  success: boolean
  message: string
  data?: Membership[]
}

export interface MembershipDetailResponse {
  success: boolean
  message: string
  data?: Membership
}

