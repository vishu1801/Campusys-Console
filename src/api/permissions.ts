import { apiClient } from './client'

export interface Permission {
  id: string
  code: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface PermissionRequest {
  code: string
  name: string
  description?: string
}

export async function listPermissions(): Promise<Permission[]> {
  const { data } = await apiClient.get<Permission[]>('/api/v1/permissions')
  return data
}

export async function createPermission(payload: PermissionRequest): Promise<Permission> {
  const { data } = await apiClient.post<Permission>('/api/v1/permissions', payload)
  return data
}

export async function updatePermission(
  id: string,
  payload: PermissionRequest,
): Promise<Permission> {
  const { data } = await apiClient.put<Permission>(`/api/v1/permissions/${id}`, payload)
  return data
}

export async function deletePermission(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/permissions/${id}`)
}
