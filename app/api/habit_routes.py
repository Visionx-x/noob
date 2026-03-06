from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta
from app.db.session import get_db
from app.models.user import User
from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.schemas.habit_schema import HabitCreate, HabitResponse, HabitCompleteResponse, StandardResponse
from app.core.dependencies import get_current_user

router = APIRouter()


@router.post("/habits", response_model=StandardResponse)
def create_habit(
    habit_data: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    habit = Habit(
        user_id=current_user.id,
        title=habit_data.title
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    
    return StandardResponse(
        success=True,
        data={
            "id": habit.id,
            "title": habit.title
        },
        message="Habit created successfully"
    )


@router.get("/habits", response_model=StandardResponse)
def get_habits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    habits = db.query(Habit).filter(Habit.user_id == current_user.id).all()
    
    return StandardResponse(
        success=True,
        data={
            "habits": [
                {
                    "id": habit.id,
                    "title": habit.title,
                    "created_at": habit.created_at.isoformat()
                }
                for habit in habits
            ]
        }
    )


@router.post("/habits/{habit_id}/complete", response_model=StandardResponse)
def complete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if habit exists and belongs to user
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Check if already completed today
    today = datetime.now().date()
    existing_log = db.query(HabitLog).filter(
        HabitLog.habit_id == habit_id,
        func.date(HabitLog.date) == today
    ).first()
    
    if existing_log:
        return StandardResponse(
            success=False,
            error="Habit already completed today"
        )
    
    # Create habit log
    habit_log = HabitLog(
        habit_id=habit_id,
        user_id=current_user.id,
        date=datetime.now(),
        xp_earned=10
    )
    db.add(habit_log)
    
    # Update user XP
    current_user.total_xp += 10
    
    # Calculate current streak
    current_streak = calculate_current_streak(current_user.id, db)
    if current_streak > current_user.longest_streak:
        current_user.longest_streak = current_streak
    
    db.commit()
    
    return StandardResponse(
        success=True,
        data={
            "xp_earned": 10,
            "current_streak": current_streak
        },
        message="Habit completed successfully"
    )


@router.put("/habits/{habit_id}", response_model=StandardResponse)
def update_habit(
    habit_id: int,
    habit_data: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    habit.title = habit_data.title
    db.commit()
    
    return StandardResponse(
        success=True,
        data={
            "id": habit.id,
            "title": habit.title
        },
        message="Habit updated successfully"
    )


@router.delete("/habits/{habit_id}", response_model=StandardResponse)
def delete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    db.delete(habit)
    db.commit()
    
    return StandardResponse(
        success=True,
        message="Habit deleted successfully"
    )


def calculate_current_streak(user_id: int, db: Session) -> int:
    """Calculate current streak based on consecutive days with habit completions"""
    today = datetime.now().date()
    streak = 0
    
    for i in range(365):  # Check up to a year back
        check_date = today - timedelta(days=i)
        
        # Check if any habit was completed on this date
        completion_count = db.query(HabitLog).filter(
            HabitLog.user_id == user_id,
            func.date(HabitLog.date) == check_date
        ).count()
        
        if completion_count > 0:
            streak += 1
        else:
            # Break streak if no completions and we're not checking today (might complete later)
            if i > 0:
                break
    
    return streak
