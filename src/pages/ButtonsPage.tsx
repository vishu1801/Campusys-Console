import { useEffect, useState } from 'react'
import { useModules } from '../context/ModulesContext'
import { listButtonsByPage, type ButtonType, type PageButton } from '../api/buttons'
import { flattenPages } from '../api/pages'
import ButtonFormModal from '../components/ButtonFormModal'

const selectClass =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

function ButtonSection({
  title,
  emptyLabel,
  createLabel,
  buttons,
  onCreate,
  onEdit,
}: {
  title: string
  emptyLabel: string
  createLabel: string
  buttons: PageButton[]
  onCreate: () => void
  onEdit: (button: PageButton) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        <button
          onClick={onCreate}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          {createLabel}
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Order</th>
              <th className="px-4 py-2 font-medium">Active</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
            {buttons.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {buttons.map((btn) => (
              <tr key={btn.id} className="text-gray-700 dark:text-gray-300">
                <td className="px-4 py-2">{btn.displayName}</td>
                <td className="px-4 py-2">{btn.displayOrder ?? '—'}</td>
                <td className="px-4 py-2">{btn.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onEdit(btn)}
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
    </div>
  )
}

export default function ButtonsPage() {
  const { modules, loading: modulesLoading } = useModules()
  const [selectedModuleId, setSelectedModuleId] = useState('')
  const [selectedPageId, setSelectedPageId] = useState('')
  const [buttons, setButtons] = useState<PageButton[]>([])
  const [buttonsLoading, setButtonsLoading] = useState(false)
  const [buttonsError, setButtonsError] = useState<string | null>(null)
  const [creatingType, setCreatingType] = useState<ButtonType | null>(null)
  const [editingButton, setEditingButton] = useState<PageButton | null>(null)

  const selectedModule = modules.find((m) => m.id === selectedModuleId)
  const allPages = selectedModule ? flattenPages(selectedModule.pages) : []
  const selectedPage = allPages.find((p) => p.id === selectedPageId)
  // Only leaf pages can hold buttons — a page with sub-pages just organizes
  // them, and its buttons belong on those sub-pages instead.
  const selectablePages = allPages.filter((p) => p.subPages.length === 0)

  async function refreshButtons(pageId: string) {
    setButtonsLoading(true)
    setButtonsError(null)
    try {
      const data = await listButtonsByPage(pageId)
      setButtons(data)
    } catch {
      setButtonsError('Failed to load buttons')
    } finally {
      setButtonsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedPageId) {
      refreshButtons(selectedPageId)
    } else {
      setButtons([])
    }
  }, [selectedPageId])

  function handleModuleChange(moduleId: string) {
    setSelectedModuleId(moduleId)
    setSelectedPageId('')
  }

  const byOrder = (a: PageButton, b: PageButton) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  const pageButtons = buttons.filter((b) => b.type === 'PAGE').sort(byOrder)
  const rowButtons = buttons.filter((b) => b.type === 'ROW').sort(byOrder)

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Buttons</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Select a module and page to view and manage its buttons.
      </p>

      <div className="mt-6 grid max-w-xl grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="buttons-module">
            Module
          </label>
          <select
            id="buttons-module"
            value={selectedModuleId}
            onChange={(e) => handleModuleChange(e.target.value)}
            className={selectClass}
            disabled={modulesLoading}
          >
            <option value="">Select a module…</option>
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.displayName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="buttons-page">
            Page
          </label>
          <select
            id="buttons-page"
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            className={selectClass}
            disabled={!selectedModule}
          >
            <option value="">Select a page…</option>
            {selectablePages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.parentName ? `${page.parentName} / ${page.displayName}` : page.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedPage && (
        <>
          {buttonsLoading && <p className="mt-6 text-sm text-gray-400">Loading…</p>}
          {buttonsError && <p className="mt-6 text-sm text-red-500">{buttonsError}</p>}

          {!buttonsLoading && !buttonsError && (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ButtonSection
                title={`Page buttons on ${selectedPage.displayName}`}
                emptyLabel="No page buttons yet."
                createLabel="+ New page button"
                buttons={pageButtons}
                onCreate={() => setCreatingType('PAGE')}
                onEdit={setEditingButton}
              />
              <ButtonSection
                title={`Row buttons on ${selectedPage.displayName}`}
                emptyLabel="No row buttons yet."
                createLabel="+ New row button"
                buttons={rowButtons}
                onCreate={() => setCreatingType('ROW')}
                onEdit={setEditingButton}
              />
            </div>
          )}
        </>
      )}

      {creatingType && selectedPage && (
        <ButtonFormModal
          pageId={selectedPage.id}
          pageDisplayName={selectedPage.displayName}
          defaultType={creatingType}
          onClose={() => setCreatingType(null)}
          onSaved={() => refreshButtons(selectedPage.id)}
        />
      )}
      {editingButton && selectedPage && (
        <ButtonFormModal
          pageId={selectedPage.id}
          pageDisplayName={selectedPage.displayName}
          button={editingButton}
          onClose={() => setEditingButton(null)}
          onSaved={() => refreshButtons(selectedPage.id)}
        />
      )}
    </div>
  )
}
