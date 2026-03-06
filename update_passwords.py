#!/usr/bin/env python3
"""
Script to update user passwords in GrowthForge database
"""

import sys
import os
import hashlib
from datetime import datetime

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def update_admin_password():
    """Update admin user password"""
    
    new_password = "Admin123!@#"
    admin_email = "admin@growthforge.app"
    
    print(f"Updating admin password for: {admin_email}")
    print(f"New password: {new_password}")
    print("-" * 50)
    
    try:
        # Get database session
        db = next(get_db())
        
        # Find admin user
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if admin_user:
            # Update password
            admin_user.hashed_password = hash_password(new_password)
            db.commit()
            print(f"✅ Admin password updated successfully!")
            print(f"User ID: {admin_user.id}")
            print(f"Email: {admin_user.email}")
        else:
            print(f"❌ Admin user not found!")
            
    except Exception as e:
        print(f"❌ Error updating admin password: {e}")
    finally:
        if 'db' in locals():
            db.close()

def update_test_password():
    """Update test user password"""
    
    new_password = "Test123!@#"
    test_email = "test@growthforge.app"
    
    print(f"\nUpdating test password for: {test_email}")
    print(f"New password: {new_password}")
    print("-" * 50)
    
    try:
        # Get database session
        db = next(get_db())
        
        # Find test user
        test_user = db.query(User).filter(User.email == test_email).first()
        if test_user:
            # Update password
            test_user.hashed_password = hash_password(new_password)
            db.commit()
            print(f"✅ Test password updated successfully!")
            print(f"User ID: {test_user.id}")
            print(f"Email: {test_user.email}")
        else:
            print(f"❌ Test user not found!")
            
    except Exception as e:
        print(f"❌ Error updating test password: {e}")
    finally:
        if 'db' in locals():
            db.close()

def reset_all_passwords():
    """Reset all user passwords to known defaults"""
    
    print("🔄 Resetting all user passwords to defaults...")
    print("=" * 50)
    
    try:
        # Get database session
        db = next(get_db())
        
        # Get all users
        users = db.query(User).all()
        
        for user in users:
            if user.email == "admin@growthforge.app":
                new_password = "Admin123!@#"
            elif user.email == "test@growthforge.app":
                new_password = "Test123!@#"
            else:
                new_password = "password123"  # Default for other users
            
            user.hashed_password = hash_password(new_password)
            print(f"Updated password for: {user.email}")
        
        db.commit()
        print(f"\n✅ Reset passwords for {len(users)} users!")
        
    except Exception as e:
        print(f"❌ Error resetting passwords: {e}")
    finally:
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    print("🔐 GrowthForge Password Update Script")
    print("=" * 50)
    
    # Update admin password
    update_admin_password()
    
    # Update test password
    update_test_password()
    
    print("\n" + "=" * 50)
    print("📋 UPDATED CREDENTIALS:")
    print("=" * 50)
    print("ADMIN LOGIN:")
    print("  Email: admin@growthforge.app")
    print("  Password: Admin123!@#")
    print()
    print("TEST USER LOGIN:")
    print("  Email: test@growthforge.app")
    print("  Password: Test123!@#")
    print()
    print("📱 Use these credentials to test the mobile app!")
    print("🔧 Run this script anytime you need to reset passwords.")
