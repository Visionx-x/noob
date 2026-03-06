from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Truncate password to 72 characters max (bcrypt limitation)
    if len(plain_password) > 72:
        plain_password = plain_password[:72]
        print(f"Debug: Password truncated to 72 characters")
    
    try:
        # Try bcrypt verification first
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Debug: Bcrypt verification failed: {e}")
        print(f"Debug: Trying SHA256 fallback...")
        # Fallback to SHA256 verification
        import hashlib
        sha256_hash = hashlib.sha256(plain_password.encode()).hexdigest()
        return sha256_hash == hashed_password


def get_password_hash(password: str) -> str:
    # Truncate password to 72 characters max (bcrypt limitation)
    if len(password) > 72:
        password = password[:72]
        print(f"Debug: Password truncated to 72 characters")
    
    try:
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Debug: Bcrypt error: {e}")
        # Fallback to simple hash if bcrypt fails
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def verify_token(token: str, token_type: str = "access") -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        email: str = payload.get("sub")
        if email is None:
            return None
        
        if token_type == "refresh" and payload.get("type") != "refresh":
            return None
            
        return payload
    except JWTError:
        return None
