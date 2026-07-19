import { useState, type FormEvent } from 'react'
import Modal from './Modal'
import { createButton, updateButton, type ButtonType, type PageButton } from '../api/buttons'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

export default function ButtonFormModal({
  pageId,
  pageDisplayName,
  button,
  defaultType,
  onClose,
  onSaved,
}: {
  pageId: string
  pageDisplayName: string
  button?: PageButton
  defaultType?: ButtonType
  onClose: () => void
  onSaved: () => Promise<void> | void
}) {
  const isEditing = Boolean(button)
  const [name, setName] = useState(button?.name ?? '')
  const [displayName, setDisplayName] = useState(button?.displayName ?? '')
  const [type, setType] = useState<ButtonType>(button?.type ?? defaultType ?? 'PAGE')
  const [icon, setIcon] = useState(button?.icon ?? '')
  const [displayOrder, setDisplayOrder] = useState(
    button?.displayOrder != null ? String(button.displayOrder) : '',
  )
  const [isActive, setIsActive] = useState(button?.isActive ?? true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        name,
        displayName,
        type,
        icon: icon || undefined,
        displayOrder: displayOrder ? Number(displayOrder) : undefined,
        isActive,
        pageId,
      }
      if (button) {
        await updateButton(button.id, payload)
      } else {
        await createButton(payload)
      }
      await onSaved()
      onClose()
    } catch {
      setError(isEditing ? 'Failed to save button' : 'Failed to create button')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={isEditing ? `Edit ${button!.displayName}` : `New button on ${pageDisplayName}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="button-name">
            Name
          </label>
          <input
            id="button-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g. add-student"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="button-display-name">
            Display name
          </label>
          <input
            id="button-display-name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
            placeholder="e.g. Add Student"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="button-type">
            Type
          </label>
          <select
            id="button-type"
            value={type}
            onChange={(e) => setType(e.target.value as ButtonType)}
            className={inputClass}
          >
            <option value="PAGE">Page — appears at top of the page (e.g. Add)</option>
            <option value="ROW">Row — appears on each data row (e.g. Edit/Delete)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="button-icon">
              Icon
            </label>
            <input
              id="button-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className={inputClass}
              placeholder="optional"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="button-order">
              Display order
            </label>
            <input
              id="button-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className={inputClass}
              placeholder="optional"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-700"
          />
          Active
        </label>

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
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create button'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
