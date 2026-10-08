# Intelligent File Deduplication & Storage Optimization System — Backend

Enterprise-style FastAPI backend implementing secure file management, content-based SHA-256 deduplication, duplicate grouping, storage analytics, protected deletion, deletion history, audit logging, JWT authentication, Alembic migrations, Celery/Redis background processing, Docker, Swagger and Postman.

## Fixed architecture
`API → Services → Repositories → SQLAlchemy/MySQL`

Background work: `FastAPI → Redis → Celery Worker → HashingService`.
Storage is isolated behind `LocalStorage`; configuration is environment-driven.

## Project structure
- `app/api` — HTTP routes and dependencies
- `app/services` — business logic
- `app/repositories` — database access
- `app/models` — SQLAlchemy models
- `app/schemas` — Pydantic contracts
- `app/workers` — Celery tasks
- `app/storage` — file storage abstraction
- `alembic` — migrations
- `tests` — unit/integration test area

## Docker startup
1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET_KEY` for real use.
2. From `backend` run `docker compose up -d --build`.
3. Run the initial migration: `docker compose exec backend alembic upgrade head`.
4. Swagger: `http://localhost:8000/docs`.
5. Health: `http://localhost:8000/health`.

The Docker environment overrides `DATABASE_URL` to use the Compose service name `mysql`. Do not use the Docker hostname `mysql` from a Windows host process; when running Alembic directly on Windows, use a local MySQL endpoint such as `localhost:3306`.

## API
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/files/upload`
- `GET /api/v1/files`
- `GET /api/v1/files/{file_id}`
- `GET /api/v1/files/{file_id}/metadata`
- `GET /api/v1/files/{file_id}/download`
- `GET /api/v1/duplicates`
- `GET /api/v1/analytics/dashboard`
- `GET /api/v1/deletions/{file_id}/preview`
- `DELETE /api/v1/deletions/{file_id}`
- `GET /api/v1/deletions/history`

## File hashing
Files are streamed in configurable chunks and hashed with SHA-256. The full file is never loaded into memory for hashing. Hashing is executed by Celery workers so large-file processing does not block the upload request.

## Validation
Run `python -m compileall app tests` and `pytest`. The repository contains deterministic unit tests for the duplicate-detection hash behavior. Docker is the supported integration environment for MySQL/Redis/Celery.
