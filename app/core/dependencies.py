from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.core.security import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_user_by_email(db: Session, email: str) -> User:
    print(f"🔍 get_user_by_email called with email: {email}")
    print(f"🗄️ Database session: {db}")
    
    try:
        user = db.query(User).filter(User.email == email).first()
        print(f"👤 Query result: {user}")
        print(f"👤 User found: {user is not None}")
        if user:
            print(f"👤 User details: ID={user.id}, Email={user.email}")
        return user
    except Exception as e:
        print(f"❌ Database query error: {e}")
        print(f"❌ Error type: {type(e)}")
        return None


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    
    return user
