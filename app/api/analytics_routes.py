from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app.db.session import get_db
from app.models.user import User
from app.models.habit_log import HabitLog
from app.schemas.analytics_schema import StandardResponse
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get("/analytics/weekly", response_model=StandardResponse)
def get_weekly_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get XP data for the last 7 days"""
    today = datetime.now().date()
    weekly_data = []
    
    for i in range(7):
        date = today - timedelta(days=6-i)
        xp_total = db.query(func.sum(HabitLog.xp_earned)).filter(
            HabitLog.user_id == current_user.id,
            func.date(HabitLog.date) == date
        ).scalar() or 0
        
        weekly_data.append({
            "date": date.isoformat(),
            "xp": int(xp_total)
        })
    
    return StandardResponse(
        success=True,
        data={"weekly_data": weekly_data}
    )


@router.get("/analytics/monthly", response_model=StandardResponse)
def get_monthly_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get XP data for the last 30 days grouped by week"""
    today = datetime.now().date()
    monthly_data = []
    
    # Get data for last 4 weeks
    for week_offset in range(4):
        week_start = today - timedelta(days=(week_offset + 1) * 7)
        week_end = today - timedelta(days=week_offset * 7)
        
        xp_total = db.query(func.sum(HabitLog.xp_earned)).filter(
            HabitLog.user_id == current_user.id,
            func.date(HabitLog.date) >= week_start,
            func.date(HabitLog.date) < week_end
        ).scalar() or 0
        
        monthly_data.append({
            "date": week_start.isoformat(),
            "xp": int(xp_total)
        })
    
    # Reverse to show oldest to newest
    monthly_data.reverse()
    
    return StandardResponse(
        success=True,
        data={"monthly_data": monthly_data}
    )


@router.get("/analytics/yearly", response_model=StandardResponse)
def get_yearly_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get XP data for the last 12 months"""
    today = datetime.now().date()
    yearly_data = []
    
    for month_offset in range(12):
        month_date = today.replace(day=1) - timedelta(days=month_offset * 30)
        
        xp_total = db.query(func.sum(HabitLog.xp_earned)).filter(
            HabitLog.user_id == current_user.id,
            extract('year', HabitLog.date) == month_date.year,
            extract('month', HabitLog.date) == month_date.month
        ).scalar() or 0
        
        yearly_data.append({
            "date": month_date.isoformat(),
            "xp": int(xp_total)
        })
    
    # Reverse to show oldest to newest
    yearly_data.reverse()
    
    return StandardResponse(
        success=True,
        data={"yearly_data": yearly_data}
    )


@router.get("/analytics/heatmap", response_model=StandardResponse)
def get_heatmap_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get habit completion data for the last year for heatmap visualization"""
    today = datetime.now().date()
    heatmap_data = []
    
    # Get data for last 365 days
    for day_offset in range(365):
        date = today - timedelta(days=day_offset)
        
        completion_count = db.query(func.count(HabitLog.id)).filter(
            HabitLog.user_id == current_user.id,
            func.date(HabitLog.date) == date
        ).scalar() or 0
        
        heatmap_data.append({
            "date": date.isoformat(),
            "count": completion_count
        })
    
    # Reverse to show oldest to newest
    heatmap_data.reverse()
    
    return StandardResponse(
        success=True,
        data={"heatmap_data": heatmap_data}
    )
