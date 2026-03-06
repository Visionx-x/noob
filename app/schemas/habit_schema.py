from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class HabitCreate(BaseModel):
    title: str


class HabitResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class HabitCompleteResponse(BaseModel):
    xp_earned: int
    current_streak: int


class HabitListResponse(BaseModel):
    habits: List[HabitResponse]


class StandardResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    error: Optional[str] = None
