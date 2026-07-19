import { useState, type FormEvent } from 'react'
import Modal from './Modal'
import { collectDescendantIds, createPage, flattenPages, updatePage, type Page } from '../api/pages'
import { useModules } from '../context/ModulesContext'
import type { AppModule } from '../api/modules'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

export default function PageFormModal({
  module,
  page,
  onClose,
}: {
  module: AppModule
  page?: Page
  onClose: () => void
}) {
  const { refresh } = useModules()
  const isEditing = Boolean(page)
  const [name, setName] = useState(page?.name ?? '')
  const [displayName, setDisplayName] = useState(page?.displayName ?? '')
  const [description, setDescription] = useState(page?.description ?? '')
  const [path, setPath] = useState(page?.path ?? '')
  const [icon, setIcon] = useState(page?.icon ?? '')
  const [displayOrder, setDisplayOrder] = useState(
    page?.displayOrder != null ? String(page.displayOrder) : '',
  )
  const [isActive, setIsActive] = useState(page?.isActive ?? true)
  const [parentId, setParentId] = useState(page?.parentId ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const excludedParentIds = page ? new Set([page.id, ...collectDescendantIds(page)]) : new Set()
  const parentOptions = flattenPages(module.pages).filter((p) => !excludedParentIds.has(p.id))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        name,
        displayName,
        description: description || undefined,
        path,
        icon: icon || undefined,
        displayOrder: displayOrder ? Number(displayOrder) : undefined,
        isActive,
        appModuleId: module.id,
        parentId: parentId || null,
      }
      if (page) {
        await updatePage(page.id, payload)
      } else {
        await createPage(payload)
      }
      await refresh()
      onClose()
    } catch {
      setError(isEditing ? 'Failed to save page' : 'Failed to create page')
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={isEditing ? `Edit ${page!.displayName}` : `New page in ${module.displayName}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <label className={labelClass} htmlFor="page-name">
            Name
          </label>
          <input
            id="page-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g. student-list"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="page-display-name">
            Display name
          </label>
          <input
            id="page-display-name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
            placeholder="e.g. Student List"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="page-path">
            Path
          </label>
          <input
            id="page-path"
            required
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className={inputClass}
            placeholder="e.g. /students"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="page-description">
            Description
          </label>
          <textarea
            id="page-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="page-icon">
              Icon
            </label>
            <input
              id="page-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className={inputClass}
              placeholder="optional"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="page-order">
              Display order
            </label>
            <input
              id="page-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className={inputClass}
              placeholder="optional"
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="page-parent">
            Parent page
          </label>
          <select
            id="page-parent"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className={inputClass}
          >
            <option value="">None (root page)</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.parentName ? `${p.parentName} / ${p.displayName}` : p.displayName}
              </option>
            ))}
          </select>
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
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create page'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
