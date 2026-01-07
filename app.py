"""
============================================
WASTESNAP - APP.PY
Flask application for WasteSnap
============================================
"""

from flask import Flask, render_template, request, redirect, url_for, flash, session
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename
from auth import init_db, signup as auth_signup, signin as auth_signin
from reports_db import init_reports_db, create_report, get_all_reports, get_reports_by_user

# Initialize Flask app
app = Flask(__name__)

# Secret key for session management (change this in production!)
app.secret_key = 'your-secret-key-change-in-production'

# Configure upload folder (for future image uploads)
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size


# ============================================
# HELPER FUNCTIONS
# ============================================

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    """
    Save uploaded file with unique filename
    
    Args:
        file: Flask file object
    
    Returns:
        str: Relative path to saved file, or None if error
    """
    if file and allowed_file(file.filename):
        # Generate unique filename
        file_ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Save file
        file.save(filepath)
        
        # Return relative path for database storage
        return f"static/uploads/{unique_filename}"
    return None


# ============================================
# ROUTES
# ============================================

@app.route('/')
def index():
    """Home page / Landing page"""
    return render_template('index.html')


@app.route('/get-started')
def get_started():
    """Get Started page - redirects to signup or dashboard"""
    # Check if user is logged in (session-based check)
    if 'user_id' in session:
        # User is logged in, redirect to dashboard
        return redirect(url_for('dashboard'))
    else:
        # User is not logged in, redirect to signup
        return redirect(url_for('signup'))


@app.route('/signin', methods=['GET', 'POST'])
def signin():
    """Sign In page"""
    if request.method == 'POST':
        # Get form data
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Validate credentials using auth module
        success, message, user_data = auth_signin(email, password)
        
        if success and user_data:
            # Set session
            session['user_id'] = user_data['id']
            session['user_email'] = user_data['email']
            session['user_name'] = user_data['name']
            flash(message, 'success')
            return redirect(url_for('index'))
        else:
            flash(message, 'error')
    
    return render_template('signin.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Sign Up page"""
    if request.method == 'POST':
        # Get form data
        name = request.form.get('name')
        number = request.form.get('number')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        # Basic validation
        if not all([name, number, email, password, confirm_password]):
            flash('All fields are required', 'error')
        elif password != confirm_password:
            flash('Passwords do not match', 'error')
        else:
            # Register user using auth module
            success, message, user_id = auth_signup(name, number, email, password)
            
            if success and user_id:
                # Don't set session - user needs to sign in
                # Redirect to signin page with success message
                flash('Signup successful! Please sign in to continue.', 'success')
                return redirect(url_for('signin'))
            else:
                flash(message, 'error')
    
    return render_template('signup.html')


@app.route('/dashboard')
def dashboard():
    """User dashboard - requires login"""
    # Check if user is logged in
    if 'user_id' not in session:
        flash('Please log in to access the dashboard', 'warning')
        return redirect(url_for('signin'))
    
    # Fetch user's reports from database
    user_id = session['user_id']
    user_reports = get_reports_by_user(user_id)
    
    return render_template('dashboard.html', reports=user_reports)


@app.route('/snap', methods=['GET', 'POST'])
def snap():
    """Snap waste page - upload photo and location"""
    # Check if user is logged in
    if 'user_id' not in session:
        flash('Please log in to report waste', 'warning')
        return redirect(url_for('signin'))
    
    if request.method == 'POST':
        # Get form data
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')
        readable_area = request.form.get('readable_area', '')
        waste_type = request.form.get('waste_type')
        description = request.form.get('description', '')
        severity = request.form.get('severity', '')
        landmark = request.form.get('landmark', '')
        
        # Validate required fields
        if not latitude or not longitude:
            flash('Location is required. Please enable geolocation.', 'error')
            return redirect(request.url)
        
        if not waste_type:
            flash('Waste type is required', 'error')
            return redirect(request.url)
        
        # Check if file was uploaded
        if 'photo' not in request.files:
            flash('No photo uploaded', 'error')
            return redirect(request.url)
        
        file = request.files['photo']
        
        if file.filename == '':
            flash('No photo selected', 'error')
            return redirect(request.url)
        
        # Save uploaded file
        photo_path = save_uploaded_file(file)
        
        if not photo_path:
            flash('Invalid file type. Please upload a JPG, JPEG, or PNG image.', 'error')
            return redirect(request.url)
        
        # Get user info from session
        user_id = session['user_id']
        username = session.get('user_name', '')
        
        # Create report in database
        try:
            latitude_float = float(latitude)
            longitude_float = float(longitude)
        except ValueError:
            flash('Invalid coordinates', 'error')
            return redirect(request.url)
        
        # Use empty string for optional fields if not provided
        description = description.strip() if description else None
        severity = severity if severity else None
        landmark = landmark.strip() if landmark else None
        readable_area = readable_area.strip() if readable_area else None
        
        success, message, report_id = create_report(
            user_id=user_id,
            username=username,
            latitude=latitude_float,
            longitude=longitude_float,
            readable_area=readable_area,
            photo_path=photo_path,
            waste_type=waste_type,
            description=description,
            severity=severity,
            landmark=landmark
        )
        
        if success:
            flash('Waste report submitted successfully!', 'success')
            return redirect(url_for('index'))
        else:
            flash(f'Error submitting report: {message}', 'error')
    
    return render_template('snap.html')

@app.route('/find-waste')
def find_waste():
    """Find waste location page - shows all waste reports"""
    # Check if user is logged in
    if 'user_id' not in session:
        flash('Please log in to view waste locations', 'warning')
        return redirect(url_for('signin'))
    
    # Get all reports
    reports = get_all_reports()
    
    return render_template('reports.html', reports=reports)


@app.route('/logout')
def logout():
    """Logout user"""
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('index'))


@app.route('/about')
def about():
    """About page - information about WasteSnap"""
    return render_template('about.html')


# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def page_not_found(e):
    """404 error handler"""
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    """500 error handler"""
    return render_template('500.html'), 500


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    init_db()  # Initialize auth database
    init_reports_db()  # Initialize reports database
    # Run the Flask app
    # Debug mode is ON - turn OFF in production!
    app.run(debug=True, host='0.0.0.0')