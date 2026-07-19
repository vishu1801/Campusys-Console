import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useModules } from '../context/ModulesContext'
import PageFormModal from '../components/PageFormModal'
import ModuleFormModal from '../components/ModuleFormModal'
import { flattenPages, type Page } from '../api/pages'

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const { modules, loading } = useModules()
  const [showCreatePage, setShowCreatePage] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [editingModule, setEditingModule] = useState(false)

  const module = modules.find((m) => m.id === moduleId)

  if (loading) {
    return <p className="text-sm text-gray-400">Loading…</p>
  }

  if (!module) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Module not found.</p>
  }

  const sortedPages = flattenPages(module.pages).sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  )

  return (
    <div>
      <Link
        to="/modules"
        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        ← Modules
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {module.displayName}
            </h2>
            <button
              onClick={() => setEditingModule(true)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Edit
            </button>
          </div>
          {module.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowCreatePage(true)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New page
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Path</th>
              <th className="px-4 py-2 font-medium">Order</th>
              <th className="px-4 py-2 font-medium">Active</th>
              <th className="px-4 py-2 font-medium">Parent</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
            {sortedPages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No pages in this module yet.
                </td>
              </tr>
            )}
            {sortedPages.map((page) => (
              <tr key={page.id} className="text-gray-700 dark:text-gray-300">
                <td className="px-4 py-2">{page.displayName}</td>
                <td className="px-4 py-2 font-mono text-xs">{page.path}</td>
                <td className="px-4 py-2">{page.displayOrder ?? '—'}</td>
                <td className="px-4 py-2">{page.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{page.parentName ?? '—'}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => setEditingPage(page)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreatePage && (
        <PageFormModal module={module} onClose={() => setShowCreatePage(false)} />
      )}
      {editingPage && (
        <PageFormModal module={module} page={editingPage} onClose={() => setEditingPage(null)} />
      )}
      {editingModule && (
        <ModuleFormModal module={module} onClose={() => setEditingModule(false)} />
      )}
    </div>
  )
}
