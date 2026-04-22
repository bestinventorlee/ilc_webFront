import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import IlcLayout from './pages/ilc/IlcLayout'
import IlcHome from './pages/ilc/IlcHome'
import IlcAnnouncementsPage from './pages/ilc/IlcAnnouncementsPage'
import IlcAnnouncementDetailPage from './pages/ilc/IlcAnnouncementDetailPage'
import IlcProjectsPage from './pages/ilc/IlcProjectsPage'
import IlcProjectDetailPage from './pages/ilc/IlcProjectDetailPage'
import IlcAboutPage from './pages/ilc/IlcAboutPage'
import LandingPage from './components/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Dashboard from './pages/Dashboard'
import ProjectDocs from './pages/ProjectDocs'
import Membership from './pages/Membership'
import Profile from './pages/Profile'
import Community from './pages/Community'
import Library from './pages/Library'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminMemberships from './pages/admin/AdminMemberships'
import AdminPosts from './pages/admin/AdminPosts'
import AdminLibrary from './pages/admin/AdminLibrary'
import AdminContacts from './pages/admin/AdminContacts'
import { autoRefreshTokenIfNeeded, isAuthenticated } from './utils/token'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  const [isCheckingToken, setIsCheckingToken] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 토큰 자동 갱신 확인
    const checkAndRefreshToken = async () => {
      if (isAuthenticated()) {
        // 로그인 상태인 경우, Access Token이 만료되었으면 자동 갱신
        await autoRefreshTokenIfNeeded()
      }
      setIsCheckingToken(false)
    }

    checkAndRefreshToken()
  }, [])

  // 토큰 확인 중에는 로딩 표시 (선택사항)
  if (isCheckingToken) {
    return null // 또는 로딩 스피너 표시
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 공개 ILC 웹사이트 (ZIP 참고 레이아웃) */}
        <Route path="/" element={<IlcLayout />}>
          <Route index element={<IlcHome />} />
          <Route path="announcements" element={<IlcAnnouncementsPage />} />
          <Route path="announcements/:id" element={<IlcAnnouncementDetailPage />} />
          <Route path="projects" element={<IlcProjectsPage />} />
          <Route path="projects/:id" element={<IlcProjectDetailPage />} />
          <Route path="about" element={<IlcAboutPage />} />
        </Route>

        {/* 회원 포털 (로그인·회원가입) */}
        <Route path="/portal" element={<LandingPage />} />

        {/* 회원 전용 페이지 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membership"
          element={
            <ProtectedRoute>
              <Membership />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docs"
          element={
            <ProtectedRoute>
              <ProjectDocs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />

        {/* 관리자 전용 페이지 */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/memberships"
          element={
            <AdminRoute>
              <AdminMemberships />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <AdminRoute>
              <AdminPosts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/library"
          element={
            <AdminRoute>
              <AdminLibrary />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <AdminRoute>
              <AdminContacts />
            </AdminRoute>
          }
        />

        {/* 404 처리 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

