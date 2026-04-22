import { SignUpData, SignUpError } from '../types/auth'

export interface ValidationResult {
  isValid: boolean
  errors: SignUpError[]
}

/**
 * 이메일 형식 검증
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 비밀번호 강도 검증
 * 최소 8자, 영문, 숫자, 특수문자 중 2가지 이상 포함
 */
export const validatePassword = (password: string): boolean => {
  if (password.length < 8) {
    return false
  }
  
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const conditionsMet = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length
  return conditionsMet >= 2
}

/**
 * 회원가입 폼 전체 유효성 검사
 */
export const validateSignUpForm = (data: SignUpData): ValidationResult => {
  const errors: SignUpError[] = []

  // 이름 검증
  if (!data.name || data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: '이름은 최소 2자 이상 입력해주세요.',
    })
  }

  // 이메일 검증
  if (!data.email || !validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: '올바른 이메일 형식을 입력해주세요.',
    })
  }

  // 비밀번호 검증
  if (!data.password) {
    errors.push({
      field: 'password',
      message: '비밀번호를 입력해주세요.',
    })
  } else if (data.password.length < 8) {
    errors.push({
      field: 'password',
      message: '비밀번호는 최소 8자 이상이어야 합니다.',
    })
  } else if (!validatePassword(data.password)) {
    errors.push({
      field: 'password',
      message: '비밀번호는 영문, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.',
    })
  }

  // 비밀번호 확인 검증
  if (!data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: '비밀번호 확인을 입력해주세요.',
    })
  } else if (data.password !== data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: '비밀번호가 일치하지 않습니다.',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

