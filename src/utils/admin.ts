import { getUser } from './token'

/**
 * 관리자 권한 확인
 * 실제 구현에서는 서버에서 사용자 역할을 확인해야 합니다.
 * 현재는 이메일로 임시 체크 (admin@ilc.com)
 */
export const isAdmin = (): boolean => {
  const user = getUser()
  if (!user) return false
  
  if (user.role) {
    return user.role === 'admin'
  }

  // role 필드가 없는 구버전 세션 대응
  return user.email === 'admin@ilc.com' || user.email.endsWith('@admin.ilc.com')
}

/**
 * 관리자 라우트 보호를 위한 체크
 */
export const checkAdminAccess = (): { isAdmin: boolean; user: { userId: string; email: string; name: string; role?: 'admin' | 'user' } | null } => {
  const user = getUser()
  if (!user) {
    return { isAdmin: false, user: null }
  }
  
  return { isAdmin: isAdmin(), user }
}

