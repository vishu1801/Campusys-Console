import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listPermissions()
      .then(setPermissions)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) searchInputRef.current?.focus()
  }, [isOpen])

  const selectedPermissions = useMemo(
    () => permissions.filter((p) => selectedIds.includes(p.id)),
    [permissions, selectedIds],
  )

  const filteredPermissions = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return permissions
    return permissions.filter(
      (p) => p.code.toLowerCase().includes(term) || p.name.toLowerCase().includes(term),
    )
  }, [permissions, search])

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id])
  }

  function remove(id: string) {
    onChange(selectedIds.filter((i) => i !== id))
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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex min-h-[38px] w-full flex-wrap items-center gap-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-left text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {selectedPermissions.length === 0 ? (
          <span className="text-gray-400">Select permissions…</span>
        ) : (
          selectedPermissions.map((permission) => (
            <span
              key={permission.id}
              className="flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-700 dark:text-indigo-300"
            >
              <span className="font-mono">{permission.code}</span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Remove ${permission.code}`}
                onClick={(e) => {
                  e.stopPropagation()
                  remove(permission.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    remove(permission.id)
                  }
                }}
                className="cursor-pointer text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
              >
                ✕
              </span>
            </span>
          ))
        )}
        <span className="ml-auto pl-2 text-xs text-gray-400">
          {selectedPermissions.length > 0 && `${selectedPermissions.length} selected`}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-800 p-2">
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search permissions…"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-1 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filteredPermissions.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-gray-400">No matching permissions</p>
            ) : (
              filteredPermissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
