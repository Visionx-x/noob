from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    xp_required = Column(Integer, default=0)
    streak_required = Column(Integer, default=0)
    
    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement")
