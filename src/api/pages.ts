import { apiClient } from './client'

export interface Page {
  id: string
  name: string
  displayName: string
  description: string | null
  path: string
  icon: string | null
  displayOrder: number | null
  isActive: boolean
  appModuleId: string
  appModuleName: string
  parentId: string | null
  parentName: string | null
  subPages: Page[]
  createdAt: string
  updatedAt: string
}

export interface PageRequest {
  name: string
  displayName: string
  description?: string
  path: string
  icon?: string
  displayOrder?: number
  isActive?: boolean
  appModuleId: string
  parentId?: string | null
}

export async function createPage(payload: PageRequest): Promise<Page> {
  const { data } = await apiClient.post<Page>('/api/v1/pages', payload)
  return data
}

export async function updatePage(id: string, payload: PageRequest): Promise<Page> {
  const { data } = await apiClient.put<Page>(`/api/v1/pages/${id}`, payload)
  return data
}

// `AppModule.pages` only holds root-level pages; each page's children live
// nested in `subPages`, recursively. This walks the whole tree into one list.
export function flattenPages(pages: Page[]): Page[] {
  return pages.flatMap((page) => [page, ...flattenPages(page.subPages)])
}

export function collectDescendantIds(page: Page): Set<string> {
  const ids = new Set<string>()
  function walk(p: Page) {
    for (const child of p.subPages) {
      ids.add(child.id)
      walk(child)
    }
  }
  walk(page)
  return ids
}
