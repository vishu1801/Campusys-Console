import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm ${
    isActive
      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`

export default function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="px-4 py-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Menu
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-2">
        <NavLink to="/modules" className={linkClass}>
          Modules
        </NavLink>
        <NavLink to="/buttons" className={linkClass}>
          Buttons
        </NavLink>
        <NavLink to="/templates" className={linkClass}>
          Email Templates
        </NavLink>
      </nav>
    </aside>
  )
}
