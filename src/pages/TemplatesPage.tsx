import { useEffect, useState } from 'react'
import { deleteTemplate, listTemplates, type EmailTemplate } from '../api/templates'
import TemplateFormModal from '../components/TemplateFormModal'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [deletingCode, setDeletingCode] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const data = await listTemplates()
      setTemplates(data)
    } catch {
      setError('Failed to load email templates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleDelete(template: EmailTemplate) {
    if (!window.confirm(`Delete template "${template.code}"? This cannot be undone.`)) {
      return
    }
    setDeletingCode(template.code)
    try {
      await deleteTemplate(template.code)
      await refresh()
    } catch {
      setError('Failed to delete template')
    } finally {
      setDeletingCode(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Email Templates
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Templates support Thymeleaf expressions, e.g. <code>{'[[${firstName}]]'}</code>.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New template
        </button>
      </div>

      {loading && <p className="mt-6 text-sm text-gray-400">Loading…</p>}
      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2 font-medium">Code</th>
                <th className="px-4 py-2 font-medium">Subject</th>
                <th className="px-4 py-2 font-medium">Active</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
              {templates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    No email templates yet.
                  </td>
                </tr>
              )}
              {templates.map((template) => (
                <tr key={template.code} className="text-gray-700 dark:text-gray-300">
                  <td className="px-4 py-2 font-mono text-xs">{template.code}</td>
                  <td className="px-4 py-2">{template.subject}</td>
                  <td className="px-4 py-2">{template.active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-right space-x-3">
                    <button
                      onClick={() => setEditingTemplate(template)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(template)}
                      disabled={deletingCode === template.code}
                      className="text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                    >
                      {deletingCode === template.code ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <TemplateFormModal onClose={() => setShowCreate(false)} onSaved={refresh} />
      )}
      {editingTemplate && (
        <TemplateFormModal
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSaved={refresh}
        />
      )}
    </div>
  )
}
