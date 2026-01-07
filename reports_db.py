"""
============================================
WASTEWATCH - REPORTS_DB.PY
Reports database module with SQLite
============================================
"""

import sqlite3
import os
from datetime import datetime

# Database file path
DB_PATH = 'reports.db'

def get_db_connection():
    """Create and return a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_reports_db():
    """Initialize the reports database and create reports table if it doesn't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create reports table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            username TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            readable_area TEXT,
            photo_path TEXT NOT NULL,
            waste_type TEXT NOT NULL CHECK(waste_type IN ('Plastic', 'Organic', 'Construction debris', 'E-waste', 'Mixed / Other')),
            date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            description TEXT,
            severity TEXT CHECK(severity IN ('Low', 'Medium', 'High')),
            landmark TEXT,
            report_status TEXT DEFAULT 'Pending' CHECK(report_status IN ('Pending', 'In Progress', 'Cleaned')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Reports database initialized: {DB_PATH}")

def create_report(user_id, username, latitude, longitude, readable_area, photo_path, waste_type, description=None, severity=None, landmark=None):
    """
    Create a new waste report
    
    Args:
        user_id: User ID from session
        username: Username from session
        latitude: Latitude coordinate
        longitude: Longitude coordinate
        readable_area: Optional readable location name
        photo_path: Path to uploaded photo
        waste_type: Type of waste (Plastic, Organic, etc.)
        description: Optional description (max 200 chars)
        severity: Optional severity (Low, Medium, High)
        landmark: Optional landmark information
    
    Returns:
        tuple: (success: bool, message: str, report_id: int or None)
    """
    # Validate required inputs
    if not all([user_id, latitude, longitude, photo_path, waste_type]):
        return False, "Missing required fields", None
    
    # Validate waste_type
    valid_waste_types = ['Plastic', 'Organic', 'Construction debris', 'E-waste', 'Mixed / Other']
    if waste_type not in valid_waste_types:
        return False, f"Invalid waste type. Must be one of: {', '.join(valid_waste_types)}", None
    
    # Validate description length
    if description and len(description) > 200:
        return False, "Description must be 200 characters or less", None
    
    # Validate severity if provided
    if severity and severity not in ['Low', 'Medium', 'High']:
        return False, "Invalid severity. Must be Low, Medium, or High", None
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Insert new report (status defaults to 'Pending')
        cursor.execute('''
            INSERT INTO reports (user_id, username, latitude, longitude, readable_area, 
                               photo_path, waste_type, description, severity, landmark)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, username, latitude, longitude, readable_area, photo_path, 
              waste_type, description, severity, landmark))
        
        report_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return True, "Report created successfully!", report_id
    
    except sqlite3.Error as e:
        conn.close()
        return False, f"Database error: {str(e)}", None

def get_reports_by_user(user_id):
    """
    Get all reports for a specific user
    
    Args:
        user_id: User ID
    
    Returns:
        list: List of report dictionaries
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, user_id, username, latitude, longitude, readable_area,
                   photo_path, waste_type, date_time, description, severity,
                   landmark, report_status, created_at
            FROM reports
            WHERE user_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))
        
        reports = []
        for row in cursor.fetchall():
            reports.append({
                'id': row['id'],
                'user_id': row['user_id'],
                'username': row['username'],
                'latitude': row['latitude'],
                'longitude': row['longitude'],
                'readable_area': row['readable_area'],
                'photo_path': row['photo_path'],
                'waste_type': row['waste_type'],
                'date_time': row['date_time'],
                'description': row['description'],
                'severity': row['severity'],
                'landmark': row['landmark'],
                'report_status': row['report_status'],
                'created_at': row['created_at']
            })
        
        conn.close()
        return reports
    
    except sqlite3.Error as e:
        conn.close()
        return []

def get_all_reports():
    """
    Get all reports (for admin view)
    
    Returns:
        list: List of all report dictionaries
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, user_id, username, latitude, longitude, readable_area,
                   photo_path, waste_type, date_time, description, severity,
                   landmark, report_status, created_at
            FROM reports
            ORDER BY created_at DESC
        ''')
        
        reports = []
        for row in cursor.fetchall():
            reports.append({
                'id': row['id'],
                'user_id': row['user_id'],
                'username': row['username'],
                'latitude': row['latitude'],
                'longitude': row['longitude'],
                'readable_area': row['readable_area'],
                'photo_path': row['photo_path'],
                'waste_type': row['waste_type'],
                'date_time': row['date_time'],
                'description': row['description'],
                'severity': row['severity'],
                'landmark': row['landmark'],
                'report_status': row['report_status'],
                'created_at': row['created_at']
            })
        
        conn.close()
        return reports
    
    except sqlite3.Error as e:
        conn.close()
        return []

def update_report_status(report_id, status):
    """
    Update the status of a report
    
    Args:
        report_id: Report ID
        status: New status (Pending, In Progress, Cleaned)
    
    Returns:
        tuple: (success: bool, message: str)
    """
    valid_statuses = ['Pending', 'In Progress', 'Cleaned']
    if status not in valid_statuses:
        return False, f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            UPDATE reports
            SET report_status = ?
            WHERE id = ?
        ''', (status, report_id))
        
        if cursor.rowcount == 0:
            conn.close()
            return False, "Report not found"
        
        conn.commit()
        conn.close()
        return True, "Report status updated successfully"
    
    except sqlite3.Error as e:
        conn.close()
        return False, f"Database error: {str(e)}"

def get_report_by_id(report_id):
    """
    Get a single report by ID
    
    Args:
        report_id: Report ID
    
    Returns:
        dict or None: Report data if found, None otherwise
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, user_id, username, latitude, longitude, readable_area,
                   photo_path, waste_type, date_time, description, severity,
                   landmark, report_status, created_at
            FROM reports
            WHERE id = ?
        ''', (report_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'id': row['id'],
                'user_id': row['user_id'],
                'username': row['username'],
                'latitude': row['latitude'],
                'longitude': row['longitude'],
                'readable_area': row['readable_area'],
                'photo_path': row['photo_path'],
                'waste_type': row['waste_type'],
                'date_time': row['date_time'],
                'description': row['description'],
                'severity': row['severity'],
                'landmark': row['landmark'],
                'report_status': row['report_status'],
                'created_at': row['created_at']
            }
        return None
    
    except sqlite3.Error as e:
        conn.close()
        return None

