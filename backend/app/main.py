from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exception_handlers import app_exception_handler
from app.core.exceptions import AppException
from app.core.logging import configure_logging
from app.storage.local_storage import LocalStorage
@asynccontextmanager
async def lifespan(app:FastAPI):
    configure_logging(); LocalStorage(); yield
app=FastAPI(title=settings.app_name,version=settings.app_version,description='Enterprise file management, deduplication and storage optimization API',lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=['http://localhost:5173','http://127.0.0.1:5173'],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
app.add_exception_handler(AppException,app_exception_handler)
app.include_router(api_router,prefix=settings.api_v1_prefix)
@app.get('/health',tags=['System'])
def health(): return {'status':'ok','version':settings.app_version}
