import { apiClient } from './client'

export interface EmailTemplate {
  id: number
  code: string
  subject: string
  body: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailTemplateRequest {
  code: string
  subject: string
  body: string
  active?: boolean
}

export async function listTemplates(): Promise<EmailTemplate[]> {
  const { data } = await apiClient.get<EmailTemplate[]>('/api/v1/notification/templates')
  return data
}

export async function createTemplate(payload: EmailTemplateRequest): Promise<EmailTemplate> {
  const { data } = await apiClient.post<EmailTemplate>('/api/v1/notification/templates', payload)
  return data
}

export async function updateTemplate(
  code: string,
  payload: EmailTemplateRequest,
): Promise<EmailTemplate> {
  const { data } = await apiClient.put<EmailTemplate>(
    `/api/v1/notification/templates/${code}`,
    payload,
  )
  return data
}

export async function deleteTemplate(code: string): Promise<void> {
  await apiClient.delete(`/api/v1/notification/templates/${code}`)
}
