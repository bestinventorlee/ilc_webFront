import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 라우트 전환 시 스크롤을 맨 위로 복원합니다.
 * (긴 홈에서 하단 링크 클릭 후 짧은 페이지에서 하단에 멈추는 문제 방지)
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
