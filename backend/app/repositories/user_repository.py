from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user import User
class UserRepository:
    def get_by_id(self,db:Session,user_id:UUID): return db.get(User,user_id)
    def get_by_email(self,db:Session,email:str): return db.scalar(select(User).where(User.email==email.lower()))
    def create(self,db:Session,user:User): db.add(user); db.flush(); return user
