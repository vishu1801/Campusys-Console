import { apiClient } from './client'
import type { Page } from './pages'

export interface AppModule {
  id: string
  name: string
  displayName: string
  description: string | null
  pages: Page[]
  createdAt: string
  updatedAt: string
}

export interface AppModuleRequest {
  name: string
  displayName: string
  description?: string
}

export async function listModules(): Promise<AppModule[]> {
  const { data } = await apiClient.get<AppModule[]>('/api/v1/app-modules')
  return data
}

export async function createModule(payload: AppModuleRequest): Promise<AppModule> {
  const { data } = await apiClient.post<AppModule>('/api/v1/app-modules', payload)
  return data
}

export async function updateModule(id: string, payload: AppModuleRequest): Promise<AppModule> {
  const { data } = await apiClient.put<AppModule>(`/api/v1/app-modules/${id}`, payload)
  return data
}
