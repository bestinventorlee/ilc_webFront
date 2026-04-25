export interface AdminUser {
  id: string
  name: string
  username?: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  lastLoginAt?: string
}

export interface AdminStats {
  totalUsers: number
  totalMemberships: number
  totalPosts: number
  totalLibraryItems: number
  totalContacts: number
  recentUsers: AdminUser[]
}

export interface AdminMembership extends Membership {
  userId: string
  userName: string
  userEmail: string
}

export interface AdminMembershipType {
  id: string
  name: string
  membershipNumberFormat: string
  defaultDurationDays?: number
  benefits: string[]
  price?: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface AdminPost extends Post {
  userId?: string
}

export interface AdminLibraryItem extends LibraryItem {
  uploaderId?: string
  uploaderName?: string
}

export interface AdminContact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  userId?: string
  submittedAt: string
  status: 'pending' | 'answered' | 'closed'
  answer?: string
  answeredAt?: string
}

// 기존 타입들 import
import type { Membership } from './membership'
import type { Post } from './community'
import type { LibraryItem } from './library'

