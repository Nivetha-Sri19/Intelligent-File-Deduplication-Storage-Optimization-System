from fastapi import APIRouter
from app.api.v1 import analytics, auth, deletions, duplicates, files
api_router=APIRouter()
api_router.include_router(auth.router); api_router.include_router(files.router); api_router.include_router(duplicates.router); api_router.include_router(analytics.router); api_router.include_router(deletions.router)
