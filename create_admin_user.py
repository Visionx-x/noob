#!/usr/bin/env python3
"""
Script to create an admin user in the GrowthForge database
"""

import sys
import os
import hashlib
import secrets
from datetime import datetime

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_admin_user():
    """Create an admin user in the database"""
    
    # Admin credentials
    admin_email = "admin@growthforge.app"
    admin_password = "Admin123!@#"
    admin_name = "Admin"
    
    print(f"Creating admin user with email: {admin_email}")
    print(f"Password: {admin_password}")
    print("-" * 50)
    
    try:
        # Get database session
        db = next(get_db())
        
        # Check if admin user already exists
        existing_user = db.query(User).filter(User.email == admin_email).first()
        if existing_user:
            print(f"Admin user with email {admin_email} already exists!")
            print(f"User ID: {existing_user.id}")
            print(f"Username: {existing_user.username}")
            print(f"Total XP: {existing_user.total_xp}")
            print(f"Longest Streak: {existing_user.longest_streak}")
            print(f"Created At: {existing_user.created_at}")
            
            # Update username to indicate admin status
            if not existing_user.username or "admin" not in existing_user.username.lower():
                existing_user.username = "admin"
                db.commit()
                print("Updated existing user username to 'admin'!")
            return existing_user
        
        # Hash the password
        hashed_password = hash_password(admin_password)
        
        # Create admin user
        admin_user = User(
            email=admin_email,
            hashed_password=hashed_password,
            username="admin",  # Use username field to indicate admin
            total_xp=1000,  # Give admin some starting XP
            longest_streak=0,
            is_public=True
        )
        
        # Add to database
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"✅ Admin user created successfully!")
        print(f"User ID: {admin_user.id}")
        print(f"Email: {admin_user.email}")
        print(f"Username: {admin_user.username}")
        print(f"Total XP: {admin_user.total_xp}")
        print(f"Created At: {admin_user.created_at}")
        
        return admin_user
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        return None
    finally:
        if 'db' in locals():
            db.close()

def create_test_user():
    """Create a regular test user for testing"""
    
    # Test user credentials
    test_email = "test@growthforge.app"
    test_password = "Test123!@#"
    test_name = "Test"
    
    print(f"\nCreating test user with email: {test_email}")
    print(f"Password: {test_password}")
    print("-" * 50)
    
    try:
        # Get database session
        db = next(get_db())
        
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == test_email).first()
        if existing_user:
            print(f"Test user with email {test_email} already exists!")
            print(f"User ID: {existing_user.id}")
            print(f"Username: {existing_user.username}")
            return existing_user
        
        # Hash the password
        hashed_password = hash_password(test_password)
        
        # Create test user
        test_user = User(
            email=test_email,
            hashed_password=hashed_password,
            username="testuser",
            total_xp=100,
            longest_streak=0,
            is_public=True
        )
        
        # Add to database
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print(f"✅ Test user created successfully!")
        print(f"User ID: {test_user.id}")
        print(f"Email: {test_user.email}")
        print(f"Username: {test_user.username}")
        print(f"Total XP: {test_user.total_xp}")
        
        return test_user
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        return None
    finally:
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    print("🚀 GrowthForge User Creation Script")
    print("=" * 50)
    
    # Create admin user
    admin = create_admin_user()
    
    # Create test user
    test_user = create_test_user()
    
    print("\n" + "=" * 50)
    print("📋 SUMMARY:")
    print("=" * 50)
    
    if admin:
        print(f"✅ Admin User: {admin.email}")
        print(f"   Password: Admin123!@#")
    
    if test_user:
        print(f"✅ Test User: {test_user.email}")
        print(f"   Password: Test123!@#")
    
    print("\n🔑 LOGIN CREDENTIALS:")
    print("=" * 50)
    print("ADMIN LOGIN:")
    print("  Email: admin@growthforge.app")
    print("  Password: Admin123!@#")
    print()
    print("TEST USER LOGIN:")
    print("  Email: test@growthforge.app")
    print("  Password: Test123!@#")
    
    print("\n📱 You can now use these credentials to test the mobile app!")
