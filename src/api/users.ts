import { apiClient } from './client'

export type UserType = 'EMPLOYEE' | 'STUDENT' | 'FAMILY' | 'ALUMNI' | 'SUPPORT_STAFF'
export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  userName: string
  groupId: string | null
  groupName: string | null
  groupDisplayName: string | null
  departmentId: string | null
  departmentName: string | null
  departmentDisplayName: string | null
  userType: UserType
  status: UserStatus
  lastLoginAt: string | null
}

export interface UserRequest {
  firstName?: string
  lastName?: string
  email: string
  userName: string
  groupId?: string
  departmentId?: string
  userType: UserType
  status?: UserStatus
}

export interface UserFilter {
  firstName?: string
  email?: string
  userName?: string
  userType?: UserType
  status?: UserStatus
  groupId?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export async function listUsers(
  filter: UserFilter,
  page: number,
  size = 10,
): Promise<PageResponse<User>> {
  const { data } = await apiClient.get<PageResponse<User>>('/api/v1/user', {
    params: { ...filter, page, size, sort: 'createdAt,desc' },
  })
  return data
}

export async function createUser(payload: UserRequest): Promise<User> {
  const { data } = await apiClient.post<User>('/api/v1/user', payload)
  return data
}

export async function updateUser(id: string, payload: UserRequest): Promise<User> {
  const { data } = await apiClient.patch<User>(`/api/v1/user/${id}`, payload)
  return data
}
