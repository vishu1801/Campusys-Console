import { useCallback, useEffect, useState } from 'react'
import { listUsers, type User, type UserStatus, type UserType } from '../api/users'
import { listGroups, type Group } from '../api/groups'
import UserFormModal from '../components/UserFormModal'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

const USER_TYPES: UserType[] = ['EMPLOYEE', 'STUDENT', 'FAMILY', 'ALUMNI', 'SUPPORT_STAFF']
const USER_STATUSES: UserStatus[] = ['ACTIVE', 'INACTIVE']

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [emailFilter, setEmailFilter] = useState('')
  const [userNameFilter, setUserNameFilter] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')

  useEffect(() => {
    listGroups().then(setGroups)
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listUsers(
        {
          email: emailFilter || undefined,
          userName: userNameFilter || undefined,
          userType: (userTypeFilter || undefined) as UserType | undefined,
          status: (statusFilter || undefined) as UserStatus | undefined,
          groupId: groupFilter || undefined,
        },
        page,
      )
      setUsers(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, emailFilter, userNameFilter, userTypeFilter, statusFilter, groupFilter])

  useEffect(() => {
    refresh()
  }, [refresh])

  function handleFilterChange(setter: (value: string) => void) {
    return (value: string) => {
      setPage(0)
      setter(value)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Users</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New user
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div>
          <label className={labelClass}>Email</label>
          <input
            value={emailFilter}
            onChange={(e) => handleFilterChange(setEmailFilter)(e.target.value)}
            className={inputClass}
            placeholder="Search…"
          />
        </div>
        <div>
          <label className={labelClass}>Username</label>
          <input
            value={userNameFilter}
            onChange={(e) => handleFilterChange(setUserNameFilter)(e.target.value)}
            className={inputClass}
            placeholder="Search…"
          />
        </div>
        <div>
          <label className={labelClass}>Type</label>
          <select
            value={userTypeFilter}
            onChange={(e) => handleFilterChange(setUserTypeFilter)(e.target.value)}
            className={inputClass}
          >
            <option value="">All</option>
            {USER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
            className={inputClass}
          >
            <option value="">All</option>
            {USER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Group</label>
          <select
            value={groupFilter}
            onChange={(e) => handleFilterChange(setGroupFilter)(e.target.value)}
            className={inputClass}
          >
            <option value="">All</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-gray-400">Loading…</p>}
      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Username</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Group</th>
                  <th className="px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="text-gray-700 dark:text-gray-300">
                    <td className="px-4 py-2">
                      {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{u.userName}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.userType}</td>
                    <td className="px-4 py-2">{u.status}</td>
                    <td className="px-4 py-2">{u.groupDisplayName ?? '—'}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => setEditingUser(u)}
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

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              {totalElements} user{totalElements === 1 ? '' : 's'} · page {totalPages === 0 ? 0 : page + 1}{' '}
              of {totalPages}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page + 1 >= totalPages}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {showCreate && (
        <UserFormModal onClose={() => setShowCreate(false)} onSaved={refresh} />
      )}
      {editingUser && (
        <UserFormModal user={editingUser} onClose={() => setEditingUser(null)} onSaved={refresh} />
      )}
    </div>
  )
}
