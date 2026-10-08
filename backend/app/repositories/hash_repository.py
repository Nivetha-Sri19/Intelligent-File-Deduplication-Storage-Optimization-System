from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.file_hash import FileHash
class HashRepository:
    def get_by_file(self,db:Session,file_id:UUID): return db.scalar(select(FileHash).where(FileHash.file_id==file_id))
    def get_by_hash(self,db:Session,algorithm:str,hash_value:str): return db.scalar(select(FileHash).where(FileHash.algorithm==algorithm,FileHash.hash_value==hash_value))
    def create(self,db:Session,obj:FileHash): db.add(obj); db.flush(); return obj
