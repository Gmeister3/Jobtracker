# JobTracker — Backend

A Spring Boot REST API for a job application tracker. Stores applications in PostgreSQL and supports the React and TypeScript dashboard.

## Features

- List, create, update, and delete job applications.
- Track company, position, status, salary, date applied, job URL, and notes.
- Validate required fields, nonnegative salary, and the 2,000-character notes limit.
- Return HTTP 404 when updating or deleting a missing application.

## Technology

Java 21, Spring Boot, Spring MVC, Spring Data JPA, Jakarta Validation, PostgreSQL, Maven, JUnit, and Mockito.

## Local setup

1. Install Java 21 and PostgreSQL.
2. Create an empty PostgreSQL database named `jobtracker`.
3. Copy `application-local.properties.example` to `application-local.properties` in this project's root.
4. Set your local database credentials in that file. It is ignored by Git.
5. Start the backend from the project root:

```powershell
.\mvnw.cmd spring-boot:run
```

On macOS/Linux, use `./mvnw spring-boot:run`. The API runs at http://localhost:8080/api/applications. Hibernate updates the local schema automatically.

Alternatively set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in your environment. If using environment variables, remove the local properties file so it does not override them. Never commit real credentials.

## API

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Create an application; returns 201 |
| PUT | `/api/applications/{id}` | Update an application |
| DELETE | `/api/applications/{id}` | Delete an application; returns 204 |

Example create/update body:

```json
{
  "company": "Example Company",
  "position": "Software Developer",
  "status": "APPLIED",
  "salary": 75000,
  "dateApplied": "2026-11-07",
  "jobUrl": "https://example.com/jobs/developer",
  "notes": "Submitted through the company website."
}
```

Statuses: `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`. Salary, job URL, and notes are optional.

## Tests

```powershell
.\mvnw.cmd test
```

The nine tests cover service operations, update field preservation, missing records, input validation, and application startup. The startup test requires the configured local PostgreSQL database. The service and validation tests can run independently:

```powershell
.\mvnw.cmd "-Dtest=JobApplicationServiceTests,JobApplicationValidationTests" test
```

## Architecture

`controller` handles HTTP requests and validation, `service` handles application operations, `repository` accesses PostgreSQL, and `model` defines stored fields and constraints.

## Current scope

This is a local, single-user application. Authentication, per-user authorization, production schema migrations, and deployment configuration are future work. Do not expose the API publicly with private application data before adding access controls.
