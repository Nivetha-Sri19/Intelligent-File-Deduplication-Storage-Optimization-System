from pathlib import Path
from uuid import uuid4
import shutil
from app.core.config import settings
class LocalStorage:
    def __init__(self): Path(settings.upload_dir).mkdir(parents=True,exist_ok=True)
    def new_name(self,extension:str)->str: return f'{uuid4().hex}.{extension}'
    def path(self,stored_name:str)->Path:
        root=Path(settings.upload_dir).resolve(); target=(root/stored_name).resolve()
        if root not in target.parents: raise ValueError('Invalid storage path')
        return target
    def stream_to_disk(self,source,destination:Path,max_bytes:int)->int:
        total=0
        try:
            with destination.open('wb') as out:
                while True:
                    chunk=source.read(settings.chunk_size_bytes)
                    if not chunk: break
                    total+=len(chunk)
                    if total>max_bytes: raise ValueError('File exceeds configured maximum size')
                    out.write(chunk)
            return total
        except Exception:
            destination.unlink(missing_ok=True); raise
    def delete(self,path:str|Path)->None: Path(path).unlink(missing_ok=True)
    def open(self,path:str|Path):
        root=Path(settings.upload_dir).resolve(); target=Path(path).resolve()
        if root not in target.parents: raise ValueError('Invalid storage path')
        return target.open('rb')
