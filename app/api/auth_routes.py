from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth_schema import UserSignup, UserLogin, TokenResponse, UserResponse, StandardResponse
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.core.config import settings
from app.core.dependencies import get_user_by_email, get_current_user

router = APIRouter()


@router.post("/signup", response_model=StandardResponse)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    try:
        # Check if user already exists
        if get_user_by_email(db, user_data.email):
            return StandardResponse(
                success=False,
                error="Email already registered"
            )
        
        # Create new user (removed username validation)
        print(f"Debug: Creating user with email: {user_data.email}")
        hashed_password = get_password_hash(user_data.password)
        print(f"Debug: Password hashed successfully")
        
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        print(f"Debug: User added to session: {db_user}")
        db.commit()
        print(f"Debug: Transaction committed")
        db.refresh(db_user)
        print(f"Debug: User refreshed: {db_user.id}")
        
        # Verify user was actually saved
        print(f"Debug: Verifying user was saved...")
        saved_user = db.query(User).filter(User.email == user_data.email).first()
        print(f"Debug: Saved user verification: {saved_user}")
        
        if not saved_user:
            print("❌ ERROR: User was not actually saved to database!")
            return StandardResponse(
                success=False,
                error="Failed to save user to database"
            )
        else:
            print(f"✅ User confirmed in database: {saved_user.id}")
        
        # Create tokens
        access_token = create_access_token(data={"sub": db_user.email})
        refresh_token = create_refresh_token(data={"sub": db_user.email})
        print(f"Debug: Tokens created successfully")
        
        return StandardResponse(
            success=True,
            data={
                "access_token": access_token,
                "refresh_token": refresh_token
            },
            message="User created successfully"
        )
        
    except Exception as e:
        print(f"Debug: Error in signup: {e}")
        return StandardResponse(
            success=False,
            error=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=StandardResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    print("🔍 LOGIN REQUEST RECEIVED")
    print(f"📝 Request data: {user_data}")
    print(f"📧 Email: {user_data.email}")
    print(f"🔑 Password length: {len(user_data.password)}")
    
    try:
        print("🔍 Looking up user in database...")
        user = get_user_by_email(db, user_data.email)
        
        if not user:
            print("❌ USER NOT FOUND")
            return StandardResponse(
                success=False,
                error="User not found. Please check your email or sign up first."
            )
        
        print(f"✅ User found: ID={user.id}, Email={user.email}")
        print("🔍 Verifying password...")
        
        try:
            password_valid = verify_password(user_data.password, user.hashed_password)
            print(f"🔐 Password verification result: {password_valid}")
        except Exception as e:
            print(f"❌ Password verification error: {e}")
            return StandardResponse(
                success=False,
                error="Password verification failed. Please try again."
            )
        
        if not password_valid:
            print("❌ INVALID PASSWORD")
            return StandardResponse(
                success=False,
                error="Invalid password. Please check your credentials."
            )
        
        print("✅ AUTHENTICATION SUCCESSFUL")
        print("🎫 Creating access token...")
        access_token = create_access_token(data={"sub": user.email})
        print("🎫 Creating refresh token...")
        refresh_token = create_refresh_token(data={"sub": user.email})
        
        print("📤 Returning success response")
        return StandardResponse(
            success=True,
            data={
                "access_token": access_token,
                "refresh_token": refresh_token
            },
            message="Login successful"
        )
        
    except Exception as e:
        print(f"❌ LOGIN ERROR: {e}")
        print(f"❌ Error type: {type(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        return StandardResponse(
            success=False,
            error=f"Login failed: {str(e)}"
        )


@router.get("/me", response_model=StandardResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return StandardResponse(
        success=True,
        data={
            "id": current_user.id,
            "username": current_user.username,
            "total_xp": current_user.total_xp,
            "longest_streak": current_user.longest_streak,
            "is_public": current_user.is_public
        }
    )


@router.get("/users", response_model=StandardResponse)
def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        user_list = []
        for user in users:
            user_list.append({
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "total_xp": user.total_xp,
                "longest_streak": user.longest_streak,
                "created_at": user.created_at.isoformat(),
                "is_public": user.is_public
            })
        
        return StandardResponse(
            success=True,
            data={"users": user_list},
            message="Users retrieved successfully"
        )
    except Exception as e:
        print(f"❌ Error fetching users: {e}")
        return StandardResponse(
            success=False,
            error=f"Failed to fetch users: {str(e)}"
        )
