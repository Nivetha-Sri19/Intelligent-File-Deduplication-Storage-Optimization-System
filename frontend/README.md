# Deduply Frontend

Unique dark command-center UI for the Intelligent File Deduplication & Storage Optimization System.

## Backend contract
Uses the current FastAPI `/api/v1` contract:
- POST `/auth/login`, POST `/auth/register`, GET `/auth/me`
- POST `/files/upload`, GET `/files`, GET `/files/{id}`, GET `/files/{id}/metadata`, GET `/files/{id}/download`
- GET `/duplicates`
- GET `/analytics/dashboard`
- GET `/deletions/history`, GET `/deletions/{file_id}/preview`, DELETE `/deletions/{file_id}`

## Run
1. Copy `.env.example` to `.env`.
2. `npm install`
3. `npm run dev`

Frontend: http://localhost:5173
Backend: http://localhost:8000
