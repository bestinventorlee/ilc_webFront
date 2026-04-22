import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../utils/token'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * 회원 전용 라우트 보호 컴포넌트
 * 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation()
  
  if (!isAuthenticated()) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    // returnTo 쿼리 파라미터로 원래 가려던 페이지 저장
    return <Navigate to={`/portal?returnTo=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

