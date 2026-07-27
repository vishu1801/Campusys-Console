import { useEffect, useState, type FormEvent } from 'react'
import Modal from './Modal'
import { createUser, updateUser, type User, type UserStatus, type UserType } from '../api/users'
import { listGroups, type Group } from '../api/groups'
import { listDepartments, type Department } from '../api/departments'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

const USER_TYPES: UserType[] = ['EMPLOYEE', 'STUDENT', 'FAMILY', 'ALUMNI', 'SUPPORT_STAFF']
const USER_STATUSES: UserStatus[] = ['ACTIVE', 'INACTIVE']

export default function UserFormModal({
  user,
  onClose,
  onSaved,
}: {
  user?: User
  onClose: () => void
  onSaved: () => Promise<void> | void
}) {
  const isEditing = Boolean(user)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [userName, setUserName] = useState(user?.userName ?? '')
  const [userType, setUserType] = useState<UserType>(user?.userType ?? 'EMPLOYEE')
  const [status, setStatus] = useState<UserStatus>(user?.status ?? 'ACTIVE')
  const [groupId, setGroupId] = useState(user?.groupId ?? '')
  const [departmentId, setDepartmentId] = useState(user?.departmentId ?? '')
  const [groups, setGroups] = useState<Group[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listGroups().then(setGroups)
    listDepartments().then(setDepartments)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email,
        userName,
        userType,
        status,
        groupId: groupId || undefined,
        departmentId: departmentId || undefined,
      }
      if (user) {
        await updateUser(user.id, payload)
      } else {
        await createUser(payload)
      }
      await onSaved()
      onClose()
    } catch {
      setError(isEditing ? 'Failed to save user' : 'Failed to create user')
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEditing ? `Edit ${user!.userName}` : 'New user'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="user-first-name">
              First name
            </label>
            <input
              id="user-first-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="user-last-name">
              Last name
            </label>
            <input
              id="user-last-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="user-email">
            Email
          </label>
          <input
            id="user-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="user-username">
            Username
          </label>
          <input
            id="user-username"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="user-type">
              User type
            </label>
            <select
              id="user-type"
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              className={inputClass}
            >
              {USER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="user-status">
              Status
            </label>
            <select
              id="user-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className={inputClass}
            >
              {USER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="user-group">
              Group
            </label>
            <select
              id="user-group"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className={inputClass}
            >
              <option value="">Unassigned</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.displayName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="user-department">
              Department
            </label>
            <select
              id="user-department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className={inputClass}
            >
              <option value="">Unassigned</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isEditing && (user?.groupId || user?.departmentId) && (
          <p className="text-xs text-gray-400">
            Note: clearing an existing group/department assignment back to "Unassigned" isn't
            currently supported by the backend — pick a different one instead.
          </p>
        )}
        {!isEditing && (
          <p className="text-xs text-gray-400">
            New users get a default password of <code>Target@123</code> — let them know to
            change it after first login.
          </p>
        )}

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
