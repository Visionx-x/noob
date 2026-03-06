from pydantic import BaseModel
from typing import List, Optional


class AnalyticsDataPoint(BaseModel):
    date: str
    xp: int


class HeatmapDataPoint(BaseModel):
    date: str
    count: int


class AnalyticsResponse(BaseModel):
    data: List[AnalyticsDataPoint]


class HeatmapResponse(BaseModel):
    data: List[HeatmapDataPoint]


class StandardResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    error: Optional[str] = None
