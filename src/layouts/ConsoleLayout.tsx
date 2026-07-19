import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ModulesProvider } from '../context/ModulesContext'
import Sidebar from '../components/Sidebar'

export default function ConsoleLayout() {
  const { user, logout } = useAuth()

  return (
    <ModulesProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Campusys Console
            </h1>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {user.userName}
                </span>
              )}
              <button
                onClick={logout}
                className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Log out
              </button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ModulesProvider>
  )
}
