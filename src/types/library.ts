export interface LibraryItem {
  id: string
  title: string
  description: string
  category: string // 카테고리 (예: '문서', '이미지', '동영상', '기타')
  fileType: string // 파일 타입 (예: 'pdf', 'docx', 'xlsx', 'zip')
  fileSize: number // 파일 크기 (바이트)
  downloadUrl?: string // 다운로드 URL
  uploadDate: string // 업로드 날짜
  downloadCount: number // 다운로드 횟수
  author?: string // 작성자
  thumbnailUrl?: string // 썸네일 URL
}

export interface LibraryListResponse {
  success: boolean
  message: string
  data?: LibraryItem[]
}

export interface LibraryDetailResponse {
  success: boolean
  message: string
  data?: LibraryItem
}

