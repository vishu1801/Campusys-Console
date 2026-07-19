# Campusys Console

Admin console frontend for the Campusys backend microservices, talking to the API gateway.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- React Router
- Axios

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL to point at your gateway
npm run dev
```

The gateway (and Eureka + downstream services) must be running for login to succeed —
see `Campusys-Backend/project-overview.md` for start order.

## Structure

- `src/api` — axios client + typed API calls (`auth`, `modules`, `pages`, `buttons`, `templates`)
- `src/context/AuthContext.tsx` — token/user state, login/logout
- `src/context/ModulesContext.tsx` — fetches app modules (with nested pages) once, shared across the sidebar and pages
- `src/layouts/ConsoleLayout.tsx` — sidebar + header shell for authenticated routes
- `src/components` — `Sidebar`, `Modal`, `ModuleFormModal`, `PageFormModal`, `ButtonFormModal`, `TemplateFormModal` (each form doubles as create/edit depending on whether a `module`/`page`/`button`/`template` prop is passed)
- `src/pages` — route-level pages (`LoginPage`, `WelcomePage`, `ModulesListPage`, `ModulePage`, `ButtonsPage`, `TemplatesPage`)
- `src/routes/ProtectedRoute.tsx` — redirects to `/login` when no token is present

Currently wired up:
- `POST /auth/login`, `POST /auth/getUser`
- `GET /api/v1/app-modules`, `POST /api/v1/app-modules`, `PUT /api/v1/app-modules/{id}`
- `POST /api/v1/pages`, `PUT /api/v1/pages/{id}`
- `GET /api/v1/buttons/page/{pageId}`, `POST /api/v1/buttons`, `PUT /api/v1/buttons/{id}`
- `GET /api/v1/notification/templates`, `POST /api/v1/notification/templates`,
  `PUT /api/v1/notification/templates/{code}`, `DELETE /api/v1/notification/templates/{code}`

Navigation: the sidebar has "Modules" (→ `/modules`), "Buttons" (→ `/buttons`), and
"Email Templates" (→ `/templates`).

- **Modules**: lists all modules with "+ New module" and an "Edit" action per row.
  Clicking a module opens `/modules/:moduleId`, listing its pages with "+ New page"
  and an "Edit" action per row, plus an edit link on the module header itself.
- **Buttons**: pick a module then a leaf page (cascading selects — pages with
  sub-pages aren't selectable, since buttons belong on the sub-pages instead),
  and its buttons split into "Page buttons" and "Row buttons" side by side,
  each with "+ New button" and an "Edit" action per row.
- **Email Templates**: lists all templates (code, subject, active) with
  "+ New template", "Edit", and "Delete" (with a confirm prompt) per row. The
  body field supports Thymeleaf expressions (e.g. `[[${firstName}]]`); `code`
  is locked once a template exists, since the backend keys updates off it.

Note: unlike templates, the backend's `DELETE` endpoints for modules, pages,
and buttons are all no-ops (service calls are commented out server-side), so
delete isn't wired up for those three. Add more typed API modules under
`src/api` as more endpoints get consoles built for them.
