# JobTracker

A full-stack job application tracker built with React, TypeScript, Spring Boot, and PostgreSQL.

## Features

- Create, view, edit, and delete applications.
- Search by company or position and filter by status.
- Track salary, application dates, job links, and notes.
- See application, interview, and offer totals.
- Responsive dashboard with validation, loading states, and error messages.

## Structure

```text
frontend/   React + TypeScript + Vite dashboard
backend/    Java 21 + Spring Boot REST API
```

Browser → React dashboard → Spring Boot REST API → PostgreSQL.

The API uses controllers, services, and repositories. The dashboard updates after successful API requests; search and filtering run locally on loaded applications.

## Run locally

Requirements: Java 21, PostgreSQL, Node.js 22.12+ and npm.

1. Create a PostgreSQL database named `jobtracker`.
2. Copy `backend/application-local.properties.example` to `backend/application-local.properties` and enter your database credentials. This file is ignored by Git.
3. Start the backend from its folder:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

On macOS/Linux, use `./mvnw spring-boot:run`. The API listens on port 8080. Run from the backend folder to load the local configuration.

4. In a second terminal, start the frontend:

```sh
cd frontend
npm ci
npm run dev
```

Open the URL printed by Vite, normally http://localhost:5173. The development server forwards API requests to port 8080.

## Checks and tests

From `frontend`, run `npm run lint` and `npm run build`.

From `backend`, run `.\mvnw.cmd test` (or `./mvnw test`). Nine backend tests cover service operations, input validation, missing records, and application startup. The startup test requires PostgreSQL and local credentials. Browser interaction testing remains to be completed.

See the [frontend README](frontend/README.md) and [backend README](backend/README.md) for additional details and API examples.

## Current scope

This version is for local, single-user use. Authentication, per-user access controls, and production deployment are future work. The Vite development proxy is not included in a production build.
