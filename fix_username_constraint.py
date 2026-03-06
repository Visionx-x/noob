#!/usr/bin/env python3
"""
Script to fix the username unique constraint issue
Run this on the server to update the database schema
"""

import sqlite3
import os
from pathlib import Path

def fix_username_constraint():
    """Remove the unique constraint from username column"""
    
    # Path to the database
    db_path = "growthforge.db"
    
    if not os.path.exists(db_path):
        print(f"❌ Database file not found: {db_path}")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if the table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cursor.fetchone():
            print("❌ Users table not found")
            return False
        
        # Get the current table schema
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        print("📋 Current table schema:")
        for col in columns:
            print(f"   {col}")
        
        # Create a backup of the table
        print("📦 Creating backup...")
        cursor.execute("ALTER TABLE users RENAME TO users_backup")
        
        # Create new table without unique constraint on username
        print("🔧 Creating new table schema...")
        cursor.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                username VARCHAR,
                email VARCHAR UNIQUE NOT NULL,
                hashed_password VARCHAR NOT NULL,
                total_xp INTEGER DEFAULT 0,
                longest_streak INTEGER DEFAULT 0,
                is_public BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Copy data from backup to new table
        print("📋 Copying data...")
        cursor.execute("""
            INSERT INTO users (id, username, email, hashed_password, total_xp, longest_streak, is_public, created_at)
            SELECT id, username, email, hashed_password, total_xp, longest_streak, is_public, created_at
            FROM users_backup
        """)
        
        # Drop the backup table
        print("🗑️ Cleaning up...")
        cursor.execute("DROP TABLE users_backup")
        
        # Commit changes
        conn.commit()
        print("✅ Database schema updated successfully!")
        
        # Verify the new schema
        cursor.execute("PRAGMA table_info(users)")
        new_columns = cursor.fetchall()
        print("\n📋 New table schema:")
        for col in new_columns:
            print(f"   {col}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error updating database: {e}")
        if conn:
            conn.close()
        return False

if __name__ == "__main__":
    print("🔧 Fixing username constraint issue...")
    success = fix_username_constraint()
    if success:
        print("✅ Fix completed successfully!")
    else:
        print("❌ Fix failed!")
