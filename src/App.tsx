import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import WelcomePage from './pages/WelcomePage'
import ModulesListPage from './pages/ModulesListPage'
import ModulePage from './pages/ModulePage'
import ButtonsPage from './pages/ButtonsPage'
import TemplatesPage from './pages/TemplatesPage'
import ProtectedRoute from './routes/ProtectedRoute'
import ConsoleLayout from './layouts/ConsoleLayout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<ConsoleLayout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/modules" element={<ModulesListPage />} />
          <Route path="/modules/:moduleId" element={<ModulePage />} />
          <Route path="/buttons" element={<ButtonsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
