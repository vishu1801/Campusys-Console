import { apiClient } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: string
}

export interface CurrentUser {
  id: string
  firstName: string
  lastName: string
  email: string
  userName: string
  groupId: string
  groupName: string
  groupDisplayName: string
  departmentId: string
  departmentName: string
  departmentDisplayName: string
  userType: string
  status: string
  lastLoginAt: string
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.post<CurrentUser>('/auth/getUser')
  return data
}
