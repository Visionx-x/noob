from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.api.auth_routes import router as auth_router
from app.api.habit_routes import router as habit_router
from app.api.analytics_routes import router as analytics_router
from app.api.achievement_routes import router as achievement_router
from app.api.community_routes import router as community_router
from app.api.debug_routes import router as debug_router
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
import logging
import time

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables and initial user on startup
def init_db():
    logger.info("Initializing database...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        test_email = "final@test.com"
        test_pass = "test"
        user = db.query(User).filter(User.email == test_email).first()
        if not user:
            logger.info(f"Creating test user: {test_email}")
            new_user = User(
                email=test_email,
                hashed_password=get_password_hash(test_pass),
                username="testuser"
            )
            db.add(new_user)
            db.commit()
            logger.info("Test user created successfully.")
        else:
            logger.info(f"Test user {test_email} already exists.")
    except Exception as e:
        logger.error(f"Error initializing test user: {e}")
    finally:
        db.close()

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="GrowthForge API",
    description="A gamified habit tracking application",
    version="1.0.0",
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url="/redoc" if settings.environment == "development" else None
)

# Run initialization
@app.on_event("startup")
async def startup_event():
    init_db()

# Rate limiting exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Trusted hosts: only in production and only if ALLOWED_HOSTS is set (e.g. api.yourdomain.com)
if settings.environment == "production" and (settings.allowed_hosts or "").strip():
    hosts = [h.strip() for h in settings.allowed_hosts.split(",") if h.strip()]
    if hosts:
        app.add_middleware(TrustedHostMiddleware, allowed_hosts=hosts)

# CORS: use ALLOWED_ORIGINS from env (include capacitor://localhost and your VPS domain in production)
origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url}")
    
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} - {process_time:.4f}s")
    
    return response

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(habit_router, prefix="/api", tags=["Habits"])
app.include_router(analytics_router, prefix="/api", tags=["Analytics"])
app.include_router(achievement_router, prefix="/api", tags=["Achievements"])
app.include_router(community_router, prefix="/api", tags=["Community"])
app.include_router(debug_router, prefix="/api", tags=["Debug"])


@app.get("/health")
@limiter.limit("100/minute")
def health_check(request: Request):
    return {"status": "ok", "message": "GrowthForge API is running"}


@app.get("/api/health")
@limiter.limit("100/minute")
def api_health_check(request: Request):
    """Mirror of /health for frontend (baseURL is /api)."""
    return {"status": "ok", "message": "GrowthForge API is running"}


@app.get("/")
@limiter.limit("100/minute")
def root(request: Request):
    return {
        "message": "Welcome to GrowthForge API",
        "docs": "/docs" if settings.environment == "development" else None,
        "health": "/health"
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    return {
        "success": False,
        "error": "Internal server error",
        "detail": str(exc) if settings.environment == "development" else "Something went wrong"
    }

# HTTP exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")
    return {
        "success": False,
        "error": exc.detail,
        "detail": exc.detail
    }
