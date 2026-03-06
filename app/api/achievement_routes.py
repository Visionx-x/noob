from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.models.user import User
from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement
from app.schemas.achievement_schema import StandardResponse
from app.core.dependencies import get_current_user

router = APIRouter()


@router.get("/achievements", response_model=StandardResponse)
def get_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all achievements with unlock status for current user"""
    
    # Get all achievements
    achievements = db.query(Achievement).all()
    
    # Get user's unlocked achievements
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    
    unlocked_ids = {ua.achievement_id for ua in user_achievements}
    unlocked_map = {ua.achievement_id: ua for ua in user_achievements}
    
    achievement_data = []
    for achievement in achievements:
        is_unlocked = achievement.id in unlocked_ids
        user_achievement = unlocked_map.get(achievement.id) if is_unlocked else None
        
        achievement_data.append({
            "id": achievement.id,
            "title": achievement.title,
            "description": achievement.description,
            "xp_required": achievement.xp_required,
            "streak_required": achievement.streak_required,
            "unlocked": is_unlocked,
            "unlocked_at": user_achievement.unlocked_at.isoformat() if user_achievement else None
        })
    
    return StandardResponse(
        success=True,
        data={"achievements": achievement_data}
    )


@router.get("/achievements/progress", response_model=StandardResponse)
def get_achievement_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get achievement progress and check for new unlocks"""
    
    # Get all achievements
    achievements = db.query(Achievement).all()
    
    # Get user's current unlocked achievements
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    
    unlocked_ids = {ua.achievement_id for ua in user_achievements}
    
    # Check for new achievements to unlock
    newly_unlocked = []
    
    for achievement in achievements:
        if achievement.id not in unlocked_ids:
            # Check if user meets requirements
            meets_xp = current_user.total_xp >= achievement.xp_required
            meets_streak = current_user.longest_streak >= achievement.streak_required
            
            if meets_xp and meets_streak:
                # Unlock achievement
                user_achievement = UserAchievement(
                    user_id=current_user.id,
                    achievement_id=achievement.id
                )
                db.add(user_achievement)
                newly_unlocked.append(achievement)
                unlocked_ids.add(achievement.id)
    
    if newly_unlocked:
        db.commit()
    
    # Get updated user achievements for response
    updated_user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    
    unlocked_map = {ua.achievement_id: ua for ua in updated_user_achievements}
    
    achievement_data = []
    for achievement in achievements:
        is_unlocked = achievement.id in unlocked_ids
        user_achievement = unlocked_map.get(achievement.id) if is_unlocked else None
        
        achievement_data.append({
            "id": achievement.id,
            "title": achievement.title,
            "description": achievement.description,
            "xp_required": achievement.xp_required,
            "streak_required": achievement.streak_required,
            "unlocked": is_unlocked,
            "unlocked_at": user_achievement.unlocked_at.isoformat() if user_achievement else None
        })
    
    return StandardResponse(
        success=True,
        data={
            "achievements": achievement_data,
            "newly_unlocked": len(newly_unlocked)
        },
        message=f"Unlocked {len(newly_unlocked)} new achievements!" if newly_unlocked else None
    )
