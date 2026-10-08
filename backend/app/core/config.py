from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False, extra='ignore')
    app_name: str = Field('Intelligent File Deduplication & Storage Optimization System', alias='APP_NAME')
    app_version: str = Field('1.0.0', alias='APP_VERSION')
    environment: str = Field('development', alias='ENVIRONMENT')
    debug: bool = Field(False, alias='DEBUG')
    api_v1_prefix: str = Field('/api/v1', alias='API_V1_PREFIX')
    database_url: str = Field(alias='DATABASE_URL')
    jwt_secret_key: str = Field(alias='JWT_SECRET_KEY')
    jwt_algorithm: str = Field('HS256', alias='JWT_ALGORITHM')
    access_token_expire_minutes: int = Field(30, alias='ACCESS_TOKEN_EXPIRE_MINUTES')
    redis_url: str = Field('redis://redis:6379/0', alias='REDIS_URL')
    celery_broker_url: str = Field('redis://redis:6379/1', alias='CELERY_BROKER_URL')
    celery_result_backend: str = Field('redis://redis:6379/2', alias='CELERY_RESULT_BACKEND')
    upload_dir: str = Field('/app/uploads', alias='UPLOAD_DIR')
    max_file_size_mb: int = Field(1024, alias='MAX_FILE_SIZE_MB', gt=0)
    chunk_size_bytes: int = Field(1024 * 1024, alias='CHUNK_SIZE_BYTES', gt=0)
    allowed_extensions: str = Field('', alias='ALLOWED_EXTENSIONS')
    @property
    def max_file_size_bytes(self) -> int: return self.max_file_size_mb * 1024 * 1024
    @property
    def allowed_extension_set(self) -> set[str]: return {x.strip().lower().lstrip('.') for x in self.allowed_extensions.split(',') if x.strip()}

@lru_cache
def get_settings() -> Settings: return Settings()
settings = get_settings()
