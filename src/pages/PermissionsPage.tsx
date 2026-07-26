import { useEffect, useState } from 'react'
import { deletePermission, listPermissions, type Permission } from '../api/permissions'
import PermissionFormModal from '../components/PermissionFormModal'

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const data = await listPermissions()
      setPermissions(data)
    } catch {
      setError('Failed to load permissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleDelete(permission: Permission) {
    if (!window.confirm(`Delete permission "${permission.code}"? This cannot be undone.`)) {
      return
    }
    setDeletingId(permission.id)
    try {
      await deletePermission(permission.id)
      await refresh()
    } catch {
      setError('Failed to delete permission')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Permissions</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Permission codes can be attached to pages or buttons to gate access by group.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New permission
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
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
              {permissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    No permissions yet.
                  </td>
                </tr>
              )}
              {permissions.map((permission) => (
                <tr key={permission.id} className="text-gray-700 dark:text-gray-300">
                  <td className="px-4 py-2 font-mono text-xs">{permission.code}</td>
                  <td className="px-4 py-2">{permission.name}</td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {permission.description || '—'}
                  </td>
                  <td className="px-4 py-2 text-right space-x-3">
                    <button
                      onClick={() => setEditingPermission(permission)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(permission)}
                      disabled={deletingId === permission.id}
                      className="text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                    >
                      {deletingId === permission.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <PermissionFormModal onClose={() => setShowCreate(false)} onSaved={refresh} />
      )}
      {editingPermission && (
        <PermissionFormModal
          permission={editingPermission}
          onClose={() => setEditingPermission(null)}
          onSaved={refresh}
        />
      )}
    </div>
  )
}
