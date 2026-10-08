from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.analytics import DashboardResponse
from app.services.analytics_service import AnalyticsService
router=APIRouter(prefix='/analytics',tags=['Analytics'])
@router.get('/dashboard',response_model=DashboardResponse)
def dashboard(db:Session=Depends(get_db),user:User=Depends(get_current_user)): return AnalyticsService().dashboard(db,user.id)
