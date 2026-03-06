from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class HabitLog(Base):
    __tablename__ = "habit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(DateTime(timezone=True), nullable=False, index=True)
    xp_earned = Column(Integer, default=10)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    habit = relationship("Habit", back_populates="habit_logs")
    user = relationship("User", back_populates="habit_logs")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('habit_id', 'date', name='unique_habit_date'),
    )
