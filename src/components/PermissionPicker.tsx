import { useEffect, useState } from 'react'
import { listPermissions, type Permission } from '../api/permissions'

export default function PermissionPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPermissions()
      .then(setPermissions)
      .finally(() => setLoading(false))
  }, [])

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id])
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading permissions…</p>
  }

  if (permissions.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No permissions defined yet — add some on the Permissions page.
      </p>
    )
  }

  return (
    <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-gray-300 dark:border-gray-700 p-2">
      {permissions.map((permission) => (
        <label
          key={permission.id}
          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(permission.id)}
            onChange={() => toggle(permission.id)}
            className="rounded border-gray-300 dark:border-gray-700"
          />
          <span className="font-mono text-xs">{permission.code}</span>
          <span className="text-gray-400">— {permission.name}</span>
        </label>
      ))}
    </div>
  )
}
