import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../utils/token'
import { checkAdminAccess } from '../utils/admin'

interface AdminRouteProps {
  children: React.ReactNode
}

/**
 * 관리자 전용 라우트 보호 컴포넌트
 * 로그인하지 않았거나 관리자가 아닌 사용자는 접근 불가
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation()
  
  if (!isAuthenticated()) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to={`/portal?returnTo=${encodeURIComponent(location.pathname)}`} replace />
  }

  const { isAdmin } = checkAdminAccess()
  
  if (!isAdmin) {
    // 관리자가 아닌 경우 대시보드로 리다이렉트
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default AdminRoute

