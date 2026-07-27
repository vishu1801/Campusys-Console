import { apiClient } from './client'

export interface Department {
  id: string
  name: string
  displayName: string
}

export async function listDepartments(): Promise<Department[]> {
  const { data } = await apiClient.get<Department[]>('/api/v1/departments')
  return data
}
