from sqlalchemy.orm import Session

from app.core.constants import AuditAction, UserRole
from app.core.exceptions import AuthenticationError, ConflictError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.services.audit_service import AuditService


class AuthService:
    def __init__(self):
        self.users = UserRepository()
        self.audit = AuditService()

    def register(
        self,
        db: Session,
        email: str,
        password: str,
    ):
        email = email.lower()

        if self.users.get_by_email(db, email):
            raise ConflictError("Email is already registered")

        user = self.users.create(
            db,
            User(
                email=email,
                password_hash=hash_password(password),
                role=UserRole.USER,
            ),
        )

        self.audit.log(
            db,
            AuditAction.REGISTER,
            user_id=user.id,
        )

        db.commit()
        db.refresh(user)

        return user

    def login(
        self,
        db: Session,
        email: str,
        password: str,
    ):
        user = self.users.get_by_email(db, email.lower())

        if (
            not user
            or not user.is_active
            or not verify_password(password, user.password_hash)
        ):
            raise AuthenticationError("Invalid email or password")

        token = create_access_token(str(user.id))

        self.audit.log(
            db,
            AuditAction.LOGIN,
            user_id=user.id,
        )

        db.commit()

        return user, token