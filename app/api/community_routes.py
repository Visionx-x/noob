from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from app.db.session import get_db
from app.models.user import User
from app.models.habit_log import HabitLog
from app.models.leaderboard_snapshot import LeaderboardSnapshot
from app.schemas.community_schema import StandardResponse
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get("/leaderboard/weekly", response_model=StandardResponse)
def get_weekly_leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get top 40 users for weekly leaderboard"""
    
    # Try to get from snapshots first (for performance)
    today = datetime.now()
    week_number = today.isocalendar()[1]
    year = today.year
    
    snapshots = db.query(LeaderboardSnapshot).filter(
        LeaderboardSnapshot.week_number == week_number,
        LeaderboardSnapshot.year == year
    ).order_by(desc(LeaderboardSnapshot.weekly_score)).limit(40).all()
    
    if snapshots:
        # Use snapshot data
        entries = []
        for rank, snapshot in enumerate(snapshots, 1):
            user = db.query(User).filter(User.id == snapshot.user_id).first()
            if user and user.is_public:
                entries.append({
                    "rank": rank,
                    "username": user.username,
                    "total_xp": user.total_xp,
                    "longest_streak": user.longest_streak,
                    "weekly_score": snapshot.weekly_score
                })
    else:
        # Calculate on-the-fly if no snapshots exist
        entries = calculate_weekly_leaderboard(db)
    
    return StandardResponse(
        success=True,
        data={"leaderboard": entries}
    )


@router.get("/leaderboard/monthly", response_model=StandardResponse)
def get_monthly_leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get top 40 users for monthly leaderboard based on total XP"""
    
    users = db.query(User).filter(
        User.is_public == True
    ).order_by(desc(User.total_xp)).limit(40).all()
    
    entries = []
    for rank, user in enumerate(users, 1):
        entries.append({
            "rank": rank,
            "username": user.username,
            "total_xp": user.total_xp,
            "longest_streak": user.longest_streak,
            "weekly_score": None
        })
    
    return StandardResponse(
        success=True,
        data={"leaderboard": entries}
    )


@router.get("/users/{username}", response_model=StandardResponse)
def get_public_user_profile(
    username: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get public user profile by username"""
    
    user = db.query(User).filter(
        User.username == username,
        User.is_public == True
    ).first()
    
    if not user:
        return StandardResponse(
            success=False,
            error="User not found or profile is private"
        )
    
    return StandardResponse(
        success=True,
        data={
            "username": user.username,
            "total_xp": user.total_xp,
            "longest_streak": user.longest_streak,
            "created_at": user.created_at.isoformat()
        }
    )


def calculate_weekly_leaderboard(db: Session) -> list:
    """Calculate weekly leaderboard scores"""
    today = datetime.now().date()
    week_start = today - timedelta(days=today.weekday())  # Monday
    week_end = week_start + timedelta(days=7)  # Next Monday
    
    entries = []
    
    # Get all public users with activity this week
    active_users = db.query(User).filter(
        User.is_public == True
    ).all()
    
    user_scores = []
    
    for user in active_users:
        # Calculate weekly XP
        weekly_xp = db.query(func.sum(HabitLog.xp_earned)).filter(
            HabitLog.user_id == user.id,
            func.date(HabitLog.date) >= week_start,
            func.date(HabitLog.date) < week_end
        ).scalar() or 0
        
        # Calculate weekly completed habits
        weekly_completed = db.query(func.count(func.distinct(HabitLog.habit_id))).filter(
            HabitLog.user_id == user.id,
            func.date(HabitLog.date) >= week_start,
            func.date(HabitLog.date) < week_end
        ).scalar() or 0
        
        # Calculate weekly score using the formula
        weekly_score = (weekly_xp * 0.6) + (weekly_completed * 0.3) + (user.longest_streak * 0.1)
        
        if weekly_xp > 0:  # Only include users with activity
            user_scores.append({
                "user": user,
                "weekly_score": weekly_score
            })
    
    # Sort by score and take top 40
    user_scores.sort(key=lambda x: x["weekly_score"], reverse=True)
    
    for rank, user_data in enumerate(user_scores[:40], 1):
        user = user_data["user"]
        entries.append({
            "rank": rank,
            "username": user.username,
            "total_xp": user.total_xp,
            "longest_streak": user.longest_streak,
            "weekly_score": round(user_data["weekly_score"], 2)
        })
    
    return entries
