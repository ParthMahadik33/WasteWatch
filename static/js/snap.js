/**
 * ============================================
 * WASTEWATCH - SNAP.JS
 * JavaScript for waste reporting form
 * ============================================
 */

// DOM Elements
const getLocationBtn = document.getElementById('get-location-btn');
const locationBtnText = document.getElementById('location-btn-text');
const locationLoading = document.getElementById('location-loading');
const locationStatus = document.getElementById('location-status');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const readableAreaInput = document.getElementById('readable_area');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photo-preview');
const photoPreviewContainer = document.getElementById('photo-preview-container');
const removePhotoBtn = document.getElementById('remove-photo');
const fileInfo = document.getElementById('file-info');
const descriptionTextarea = document.getElementById('description');
const charCount = document.getElementById('char-count');
const wasteForm = document.getElementById('waste-form');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const submitLoading = document.getElementById('submit-loading');

// State
let locationCaptured = false;

/**
 * Get user's current location using Geolocation API
 */
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showLocationError('Geolocation is not supported by your browser.');
        return;
    }

    // Show loading state
    locationBtnText.textContent = 'Getting location...';
    locationLoading.style.display = 'inline-block';
    getLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Success - capture coordinates
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            latitudeInput.value = lat.toFixed(6);
            longitudeInput.value = lng.toFixed(6);
            locationCaptured = true;

            // Update UI
            locationBtnText.textContent = 'Location Captured ✓';
            locationLoading.style.display = 'none';
            getLocationBtn.disabled = false;
            getLocationBtn.classList.add('success');
            locationStatus.innerHTML = `<span class="status-success">✓ Location captured successfully</span>`;

            // Try to get readable area (optional)
            getReadableArea(lat, lng);

            // Enable submit button if form is valid
            validateForm();
        },
        (error) => {
            // Error handling
            locationBtnText.textContent = 'Find My Location';
            locationLoading.style.display = 'none';
            getLocationBtn.disabled = false;
            getLocationBtn.classList.remove('success');

            let errorMessage = 'Unable to get your location. ';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please allow location access and try again.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
                    break;
            }
            showLocationError(errorMessage);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

/**
 * Show location error message
 */
function showLocationError(message) {
    locationStatus.innerHTML = `<span class="status-error">✗ ${message}</span>`;
}

/**
 * Try to get readable area from coordinates (optional)
 * This is a placeholder - you can integrate with a reverse geocoding API
 */
function getReadableArea(lat, lng) {
    // Optional: You can integrate with a reverse geocoding service here
    // For now, we'll leave it empty and let the user fill it manually
    // Example: You could use OpenStreetMap Nominatim API or Google Geocoding API
}

/**
 * Handle photo file selection
 */
function handlePhotoSelect(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        fileInfo.innerHTML = '<span class="file-error">Please select a JPG, JPEG, or PNG image.</span>';
        photoInput.value = '';
        return;
    }

    // Validate file size (16MB max)
    const maxSize = 16 * 1024 * 1024; // 16MB
    if (file.size > maxSize) {
        fileInfo.innerHTML = '<span class="file-error">File size must be less than 16MB.</span>';
        photoInput.value = '';
        return;
    }

    // Show file info
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    fileInfo.innerHTML = `<span class="file-success">✓ ${file.name} (${fileSizeMB} MB)</span>`;

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        photoPreview.src = e.target.result;
        photoPreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Enable submit button if form is valid
    validateForm();
}

/**
 * Remove photo preview
 */
function removePhoto() {
    photoInput.value = '';
    photoPreviewContainer.style.display = 'none';
    fileInfo.innerHTML = '';
    validateForm();
}

/**
 * Update character count for description
 */
function updateCharCount() {
    const count = descriptionTextarea.value.length;
    charCount.textContent = count;
    
    if (count > 200) {
        charCount.classList.add('char-count-warning');
    } else {
        charCount.classList.remove('char-count-warning');
    }
}

/**
 * Validate form and enable/disable submit button
 */
function validateForm() {
    const hasLocation = latitudeInput.value && longitudeInput.value;
    const hasPhoto = photoInput.files.length > 0;
    const hasWasteType = document.getElementById('waste_type').value !== '';

    if (hasLocation && hasPhoto && hasWasteType) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    // Final validation
    if (!locationCaptured) {
        event.preventDefault();
        alert('Please capture your location first.');
        getLocationBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }

    if (!photoInput.files || photoInput.files.length === 0) {
        event.preventDefault();
        alert('Please upload a photo.');
        photoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }

    const wasteType = document.getElementById('waste_type').value;
    if (!wasteType) {
        event.preventDefault();
        alert('Please select a waste type.');
        document.getElementById('waste_type').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-block';

    // Form will submit normally
    return true;
}

// Event Listeners
getLocationBtn.addEventListener('click', getCurrentLocation);
photoInput.addEventListener('change', handlePhotoSelect);
removePhotoBtn.addEventListener('click', removePhoto);
descriptionTextarea.addEventListener('input', updateCharCount);
document.getElementById('waste_type').addEventListener('change', validateForm);
wasteForm.addEventListener('submit', handleFormSubmit);

// User dropdown menu (if exists)
const userMenuBtn = document.getElementById('user-menu-btn');
const userDropdown = document.querySelector('.user-dropdown');
const dropdownMenu = document.getElementById('user-dropdown-menu');

if (userMenuBtn && userDropdown && dropdownMenu) {
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
}

// Initial validation
validateForm();

