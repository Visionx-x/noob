from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class LeaderboardSnapshot(Base):
    __tablename__ = "leaderboard_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    weekly_score = Column(Integer, nullable=False, index=True)
    week_number = Column(Integer, nullable=False, index=True)
    year = Column(Integer, nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="leaderboard_snapshots")
