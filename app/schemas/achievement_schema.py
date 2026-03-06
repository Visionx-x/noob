from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class AchievementResponse(BaseModel):
    id: int
    title: str
    description: str
    xp_required: int
    streak_required: int
    unlocked: bool
    unlocked_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class AchievementProgressResponse(BaseModel):
    achievements: List[AchievementResponse]


class StandardResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    error: Optional[str] = None
