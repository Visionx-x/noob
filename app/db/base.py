from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models to ensure they are registered with Base.metadata
from app.models import (
    user, habit, habit_log, achievement, 
    user_achievement, leaderboard_snapshot
)  # noqa
