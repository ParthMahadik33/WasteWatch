/* ============================================
   WASTEWATCH - SIGNIN.JS
   Client-side validation and form handling for Sign In
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signin-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');
    
    // Get form inputs
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Validate email
    function validateEmail() {
        const email = emailInput.value.trim();
        if (!email) {
            emailInput.style.borderColor = '#ef4444';
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailInput.style.borderColor = '#ef4444';
            return false;
        }
        emailInput.style.borderColor = '';
        return true;
    }
    
    // Validate password
    function validatePassword() {
        const password = passwordInput.value;
        if (!password) {
            passwordInput.style.borderColor = '#ef4444';
            return false;
        }
        passwordInput.style.borderColor = '';
        return true;
    }
    
    // Validate all fields
    function validateForm() {
        const isValid = validateEmail() && validatePassword();
        return isValid;
    }
    
    // Add real-time validation
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
        passwordInput.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = '';
            }
        });
    }
    
    // Form submission
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            // Basic validation - let HTML5 validation handle required fields
            if (!validateForm()) {
                e.preventDefault();
                return false;
            }
            
            // Disable submit button and show loading
            if (submitBtn) {
                submitBtn.disabled = true;
            }
            if (submitText) {
                submitText.style.display = 'none';
            }
            if (submitLoading) {
                submitLoading.style.display = 'inline';
            }
            
            // Form will submit normally
            return true;
        });
    }
});

