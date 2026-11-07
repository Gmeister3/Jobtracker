# JobTracker — Frontend

A job application dashboard built with React and TypeScript. Track opportunities, update their progress, and keep application details together.

## Features

- Create, edit, and delete applications with confirmation before deletion.
- Search by company or position and filter by application status.
- View salary, application date, notes, and the job posting link.
- See application, interview, and offer totals.
- Responsive dashboard with keyboard-accessible controls and a details dialog.
- Loading, empty, saving, and error states.

## Technology

React 19, TypeScript, Vite, and CSS. The frontend connects to a Spring Boot REST API backed by PostgreSQL.

## Run locally

Requirements: Node.js 22.12+ and npm, plus the JobTracker backend running on port 8080.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173). The development server forwards `/api` requests to `http://localhost:8080`.

## Checks

```sh
npm run lint
npm run build
```

These checks validate code and the production build; they do not replace browser interaction tests.

## Project structure

- `src/App.tsx`: application state, dashboard, search, and filtering.
- `src/components/Applicationform.tsx`: create and edit form.
- `src/components/ApplicationDetails.tsx`: application details dialog.
- `src/types/JobApplication.ts`: shared frontend types.
- `src/App.css`: dashboard styling and responsive layouts.

## Architecture

Browser → React dashboard → Spring Boot REST API → PostgreSQL.

Search and filtering run locally on the loaded application list. Create, update, and delete operations update the dashboard after a successful API response.

## Current scope

This version is intended for local, single-user use. It does not include authentication or user-specific data isolation. A public deployment needs access controls and a production API routing configuration; the Vite development proxy is not part of the production build.

## Portfolio checklist

- Add a screenshot of the dashboard using fictional application data.
- Backend source and setup instructions are in `../backend`.
- Add a live demo link after deployment.
- Complete browser testing for create, edit, delete, filtering, and mobile layouts.

