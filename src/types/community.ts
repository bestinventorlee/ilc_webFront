export interface Post {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  createdAt: string
  updatedAt?: string
  views: number
  likes: number
  type: 'notice' | 'community' // 공지사항 또는 커뮤니티 게시글
  category?: string // 카테고리 (선택사항)
  isPinned?: boolean // 공지사항 고정 여부
}

export interface PostListResponse {
  success: boolean
  message: string
  data?: Post[]
}

export interface PostDetailResponse {
  success: boolean
  message: string
  data?: Post
}

