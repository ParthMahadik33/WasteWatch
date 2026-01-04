"""
============================================
WASTESNAP - AUTH.PY
Authentication module with SQLite database
============================================
"""

import sqlite3
import hashlib
import os
from datetime import datetime

# Database file path
DB_PATH = 'auth.db'

def get_db_connection():
    """Create and return a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database and create users table if it doesn't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            number TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized: {DB_PATH}")

def hash_password(password):
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def signup(name, number, email, password):
    """
    Register a new user
    
    Args:
        name: User's full name
        number: User's phone number
        email: User's email address
        password: User's password (will be hashed)
    
    Returns:
        tuple: (success: bool, message: str, user_id: int or None)
    """
    # Validate inputs
    if not all([name, number, email, password]):
        return False, "All fields are required", None
    
    # Basic email validation
    if '@' not in email or '.' not in email:
        return False, "Invalid email format", None
    
    # Basic password validation (minimum 6 characters)
    if len(password) < 6:
        return False, "Password must be at least 6 characters long", None
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if email already exists
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            conn.close()
            return False, "Email already registered. Please sign in instead.", None
        
        # Hash the password
        hashed_password = hash_password(password)
        
        # Insert new user
        cursor.execute('''
            INSERT INTO users (name, number, email, password)
            VALUES (?, ?, ?, ?)
        ''', (name, number, email, hashed_password))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return True, "Account created successfully!", user_id
    
    except sqlite3.Error as e:
        conn.close()
        return False, f"Database error: {str(e)}", None

def signin(email, password):
    """
    Authenticate a user
    
    Args:
        email: User's email address
        password: User's password
    
    Returns:
        tuple: (success: bool, message: str, user_data: dict or None)
    """
    # Validate inputs
    if not email or not password:
        return False, "Email and password are required", None
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Hash the provided password
        hashed_password = hash_password(password)
        
        # Check if user exists and password matches
        cursor.execute('''
            SELECT id, name, number, email, created_at
            FROM users
            WHERE email = ? AND password = ?
        ''', (email, hashed_password))
        
        user = cursor.fetchone()
        conn.close()
        
        if user:
            user_data = {
                'id': user['id'],
                'name': user['name'],
                'number': user['number'],
                'email': user['email'],
                'created_at': user['created_at']
            }
            return True, "Logged in successfully!", user_data
        else:
            return False, "Invalid email or password", None
    
    except sqlite3.Error as e:
        conn.close()
        return False, f"Database error: {str(e)}", None

def get_user_by_id(user_id):
    """
    Get user information by ID
    
    Args:
        user_id: User's ID
    
    Returns:
        dict or None: User data if found, None otherwise
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, name, number, email, created_at
            FROM users
            WHERE id = ?
        ''', (user_id,))
        
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return {
                'id': user['id'],
                'name': user['name'],
                'number': user['number'],
                'email': user['email'],
                'created_at': user['created_at']
            }
        return None
    
    except sqlite3.Error as e:
        conn.close()
        return None

