import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { listModules, type AppModule } from '../api/modules'

interface ModulesContextValue {
  modules: AppModule[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const ModulesContext = createContext<ModulesContextValue | undefined>(undefined)

export function ModulesProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<AppModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listModules()
      setModules(data)
    } catch {
      setError('Failed to load modules')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <ModulesContext.Provider value={{ modules, loading, error, refresh }}>
      {children}
    </ModulesContext.Provider>
  )
}

export function useModules() {
  const ctx = useContext(ModulesContext)
  if (!ctx) throw new Error('useModules must be used within ModulesProvider')
  return ctx
}
