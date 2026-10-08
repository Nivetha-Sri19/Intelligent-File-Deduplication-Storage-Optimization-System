from pydantic import BaseModel, ConfigDict
class MessageResponse(BaseModel): model_config=ConfigDict(from_attributes=True); message:str
class PageInfo(BaseModel): page:int; page_size:int; total:int; pages:int
