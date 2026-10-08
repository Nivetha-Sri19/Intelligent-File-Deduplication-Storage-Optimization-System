from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import AuthenticationError
from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db),
) -> User:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise AuthenticationError()

    sub = decode_access_token(credentials.credentials)

    if not sub:
        raise AuthenticationError()

    try:
        user = UserRepository().get_by_id(db, UUID(sub))
    except ValueError:
        raise AuthenticationError()

    if not user or not user.is_active:
        raise AuthenticationError()

    return user