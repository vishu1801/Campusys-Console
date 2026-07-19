import { useState, type FormEvent } from 'react'
import Modal from './Modal'
import { createModule, updateModule, type AppModule } from '../api/modules'
import { useModules } from '../context/ModulesContext'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

export default function ModuleFormModal({
  module,
  onClose,
}: {
  module?: AppModule
  onClose: () => void
}) {
  const { refresh } = useModules()
  const isEditing = Boolean(module)
  const [name, setName] = useState(module?.name ?? '')
  const [displayName, setDisplayName] = useState(module?.displayName ?? '')
  const [description, setDescription] = useState(module?.description ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = { name, displayName, description: description || undefined }
      if (module) {
        await updateModule(module.id, payload)
      } else {
        await createModule(payload)
      }
      await refresh()
      onClose()
    } catch {
      setError(isEditing ? 'Failed to save module' : 'Failed to create module')
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEditing ? `Edit ${module!.displayName}` : 'New module'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="module-name">
            Name
          </label>
          <input
            id="module-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g. student-management"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="module-display-name">
            Display name
          </label>
          <input
            id="module-display-name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
            placeholder="e.g. Student Management"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="module-description">
            Description
          </label>
          <textarea
            id="module-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            rows={2}
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
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create module'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
