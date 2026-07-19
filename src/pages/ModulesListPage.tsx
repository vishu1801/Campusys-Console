import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useModules } from '../context/ModulesContext'
import ModuleFormModal from '../components/ModuleFormModal'
import type { AppModule } from '../api/modules'

export default function ModulesListPage() {
  const { modules, loading, error } = useModules()
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [editingModule, setEditingModule] = useState<AppModule | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Modules</h2>
        <button
          onClick={() => setShowCreateModule(true)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New module
        </button>
      </div>

      {loading && <p className="mt-6 text-sm text-gray-400">Loading…</p>}
      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium">Pages</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
              {modules.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    No modules yet.
                  </td>
                </tr>
              )}
              {modules.map((mod) => (
                <tr key={mod.id} className="text-gray-700 dark:text-gray-300">
                  <td className="px-4 py-2">
                    <Link
                      to={`/modules/${mod.id}`}
                      className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {mod.displayName}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {mod.description || '—'}
                  </td>
                  <td className="px-4 py-2">{mod.pages.length}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => setEditingModule(mod)}
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
      )}

      {showCreateModule && <ModuleFormModal onClose={() => setShowCreateModule(false)} />}
      {editingModule && (
        <ModuleFormModal module={editingModule} onClose={() => setEditingModule(null)} />
      )}
    </div>
  )
}
