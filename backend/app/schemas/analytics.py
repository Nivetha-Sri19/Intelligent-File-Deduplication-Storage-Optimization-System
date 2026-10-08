from pydantic import BaseModel
class DashboardResponse(BaseModel): total_files:int; total_storage_bytes:int; duplicate_files:int; duplicate_storage_bytes:int; potential_storage_savings_bytes:int; largest_files:list[dict]; recent_uploads:list[dict]
