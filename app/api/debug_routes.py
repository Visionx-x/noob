# Debug logging endpoint for mobile debugging
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from datetime import datetime
import json
import os
from pathlib import Path

router = APIRouter()

class DebugLog(BaseModel):
    timestamp: str
    level: str
    message: str
    data: dict = None
    platform: str = None
    userAgent: str = None
    url: str = None

# Create logs directory if it doesn't exist
LOGS_DIR = Path("logs")
LOGS_DIR.mkdir(exist_ok=True)

@router.post("/debug/logs")
async def receive_debug_log(log_data: DebugLog, request: Request):
    """Receive debug logs from mobile clients"""
    try:
        # Add server timestamp
        log_data_dict = log_data.dict()
        log_data_dict['server_timestamp'] = datetime.utcnow().isoformat()
        log_data_dict['client_ip'] = request.client.host
        
        # Create daily log file
        today = datetime.now().strftime("%Y-%m-%d")
        log_file = LOGS_DIR / f"mobile_debug_{today}.log"
        
        # Write log entry
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_data_dict) + "\n")
        
        # Also print to console for immediate visibility
        print(f"📱 [MOBILE DEBUG] {log_data.level.upper()}: {log_data.message}")
        if log_data.data:
            print(f"   Data: {json.dumps(log_data.data, indent=2)}")
        
        return {"success": True, "message": "Log received"}
        
    except Exception as e:
        print(f"❌ Error processing debug log: {e}")
        raise HTTPException(status_code=500, detail="Failed to process debug log")

@router.get("/debug/logs")
async def get_debug_logs(date: str = None, limit: int = 100):
    """Get debug logs (for debugging purposes)"""
    try:
        if date:
            log_file = LOGS_DIR / f"mobile_debug_{date}.log"
        else:
            # Get today's logs
            today = datetime.now().strftime("%Y-%m-%d")
            log_file = LOGS_DIR / f"mobile_debug_{today}.log"
        
        if not log_file.exists():
            return {"logs": [], "message": "No logs found for this date"}
        
        logs = []
        with open(log_file, "r", encoding="utf-8") as f:
            lines = f.readlines()
            # Get last N lines
            for line in lines[-limit:]:
                try:
                    logs.append(json.loads(line.strip()))
                except json.JSONDecodeError:
                    continue
        
        return {"logs": logs, "count": len(logs)}
        
    except Exception as e:
        print(f"❌ Error retrieving debug logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve debug logs")

@router.delete("/debug/logs")
async def clear_debug_logs(date: str = None):
    """Clear debug logs (for debugging purposes)"""
    try:
        if date:
            log_file = LOGS_DIR / f"mobile_debug_{date}.log"
        else:
            # Clear today's logs
            today = datetime.now().strftime("%Y-%m-%d")
            log_file = LOGS_DIR / f"mobile_debug_{today}.log"
        
        if log_file.exists():
            log_file.unlink()
            return {"success": True, "message": "Logs cleared"}
        else:
            return {"success": True, "message": "No logs to clear"}
        
    except Exception as e:
        print(f"❌ Error clearing debug logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear debug logs")
