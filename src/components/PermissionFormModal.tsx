import { useState, type FormEvent } from 'react'
import Modal from './Modal'
import { createPermission, updatePermission, type Permission } from '../api/permissions'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

export default function PermissionFormModal({
  permission,
  onClose,
  onSaved,
}: {
  permission?: Permission
  onClose: () => void
  onSaved: () => Promise<void> | void
}) {
  const isEditing = Boolean(permission)
  const [code, setCode] = useState(permission?.code ?? '')
  const [name, setName] = useState(permission?.name ?? '')
  const [description, setDescription] = useState(permission?.description ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = { code, name, description }
      if (permission) {
        await updatePermission(permission.id, payload)
      } else {
        await createPermission(payload)
      }
      await onSaved()
      onClose()
    } catch {
      setError(isEditing ? 'Failed to save permission' : 'Failed to create permission')
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEditing ? `Edit ${permission!.code}` : 'New permission'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="permission-code">
            Code
          </label>
          <input
            id="permission-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${inputClass} font-mono text-xs`}
            placeholder="e.g. student.view"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="permission-name">
            Name
          </label>
          <input
            id="permission-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g. View Student"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="permission-description">
            Description
          </label>
          <textarea
            id="permission-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="Optional description"
          />
        </div>

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
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create permission'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
