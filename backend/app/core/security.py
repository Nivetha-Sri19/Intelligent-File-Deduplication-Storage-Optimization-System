from datetime import datetime, timedelta, timezone
import bcrypt
from jose import JWTError, jwt
from app.core.config import settings

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
def verify_password(password: str, password_hash: str) -> bool:
    try: return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    except (ValueError, TypeError): return False
def create_access_token(subject: str) -> str:
    now=datetime.now(timezone.utc); exp=now+timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({'sub':subject,'iat':now,'exp':exp},settings.jwt_secret_key,algorithm=settings.jwt_algorithm)
def decode_access_token(token: str) -> str | None:
    try:
        payload=jwt.decode(token,settings.jwt_secret_key,algorithms=[settings.jwt_algorithm]); sub=payload.get('sub')
        return str(sub) if sub else None
    except JWTError: return None
