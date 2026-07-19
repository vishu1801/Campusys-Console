import { useState, type FormEvent } from 'react'
import Modal from './Modal'
import { createTemplate, updateTemplate, type EmailTemplate } from '../api/templates'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const disabledInputClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm text-gray-500 dark:text-gray-400'
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

export default function TemplateFormModal({
  template,
  onClose,
  onSaved,
}: {
  template?: EmailTemplate
  onClose: () => void
  onSaved: () => Promise<void> | void
}) {
  const isEditing = Boolean(template)
  const [code, setCode] = useState(template?.code ?? '')
  const [subject, setSubject] = useState(template?.subject ?? '')
  const [body, setBody] = useState(template?.body ?? '')
  const [active, setActive] = useState(template?.active ?? true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const payload = { code, subject, body, active }
      if (template) {
        await updateTemplate(template.code, payload)
      } else {
        await createTemplate(payload)
      }
      await onSaved()
      onClose()
    } catch {
      setError(isEditing ? 'Failed to save template' : 'Failed to create template')
      setSubmitting(false)
    }
  }

  return (
    <Modal title={isEditing ? `Edit ${template!.code}` : 'New email template'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <label className={labelClass} htmlFor="template-code">
            Code
          </label>
          <input
            id="template-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={isEditing ? disabledInputClass : inputClass}
            placeholder="e.g. student-welcome"
            disabled={isEditing}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="template-subject">
            Subject
          </label>
          <input
            id="template-subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass}
            placeholder="e.g. Welcome to Campusys, [[${firstName}]]!"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="template-body">
            Body
          </label>
          <textarea
            id="template-body"
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${inputClass} font-mono text-xs`}
            rows={10}
            placeholder="Thymeleaf HTML, e.g. <p>Hi [[${firstName}]], welcome!</p>"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
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
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create template'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
