import { apiClient } from './client'

export type ButtonType = 'PAGE' | 'ROW'

export interface PageButton {
  id: string
  name: string
  displayName: string
  type: ButtonType
  icon: string | null
  displayOrder: number | null
  isActive: boolean
  pageId: string
  pageName: string
  pageDisplayName: string
  createdAt: string
  updatedAt: string
}

export interface PageButtonRequest {
  name: string
  displayName: string
  type: ButtonType
  icon?: string
  displayOrder?: number
  isActive?: boolean
  pageId: string
}

export async function listButtonsByPage(pageId: string): Promise<PageButton[]> {
  const { data } = await apiClient.get<PageButton[]>(`/api/v1/buttons/page/${pageId}`)
  return data
}

export async function createButton(payload: PageButtonRequest): Promise<PageButton> {
  const { data } = await apiClient.post<PageButton>('/api/v1/buttons', payload)
  return data
}

export async function updateButton(id: string, payload: PageButtonRequest): Promise<PageButton> {
  const { data } = await apiClient.put<PageButton>(`/api/v1/buttons/${id}`, payload)
  return data
}
