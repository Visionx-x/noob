from pydantic import BaseModel
from typing import List, Optional


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    total_xp: int
    longest_streak: int
    weekly_score: Optional[int] = None


class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]


class UserProfileResponse(BaseModel):
    username: str
    total_xp: int
    longest_streak: int
    created_at: str


class StandardResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    error: Optional[str] = None
