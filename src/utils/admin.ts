import { getUser } from './token'

/**
 * 관리자 권한 확인
 * 실제 구현에서는 서버에서 사용자 역할을 확인해야 합니다.
 * 현재는 이메일로 임시 체크 (admin@ilc.com)
 */
export const isAdmin = (): boolean => {
  const user = getUser()
  if (!user) return false
  
  // 임시: admin@ilc.com 이메일을 가진 사용자를 관리자로 간주
  // 실제로는 서버에서 역할(role)을 확인해야 합니다
  return user.email === 'admin@ilc.com' || user.email.endsWith('@admin.ilc.com')
}

/**
 * 관리자 라우트 보호를 위한 체크
 */
export const checkAdminAccess = (): { isAdmin: boolean; user: { userId: string; email: string; name: string } | null } => {
  const user = getUser()
  if (!user) {
    return { isAdmin: false, user: null }
  }
  
  return { isAdmin: isAdmin(), user }
}

