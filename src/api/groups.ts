import { apiClient } from './client'

export interface Group {
  id: string
  name: string
  displayName: string
}

export async function listGroups(): Promise<Group[]> {
  const { data } = await apiClient.get<Group[]>('/api/v1/groups')
  return data
}
