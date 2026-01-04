/* ============================================
   WASTESNAP - SIGNIN.JS
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
    
    // Get error message elements
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    
    // Clear error messages
    function clearErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        
        // Remove error styling
        emailInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
    }
    
    // Show error message
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.style.borderColor = '#ef4444';
    }
    
    // Validate email
    function validateEmail() {
        const email = emailInput.value.trim();
        if (!email) {
            showError(emailInput, emailError, 'Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        emailError.textContent = '';
        emailInput.style.borderColor = '';
        return true;
    }
    
    // Validate password
    function validatePassword() {
        const password = passwordInput.value;
        if (!password) {
            showError(passwordInput, passwordError, 'Password is required');
            return false;
        }
        passwordError.textContent = '';
        passwordInput.style.borderColor = '';
        return true;
    }
    
    // Validate all fields
    function validateForm() {
        clearErrors();
        const isValid = validateEmail() && validatePassword();
        return isValid;
    }
    
    // Add real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    
    // Form submission
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';
        
        // Submit the form
        signinForm.submit();
    });
    
    // Clear errors on input
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(input.id + '-error');
            if (errorElement) {
                errorElement.textContent = '';
                input.style.borderColor = '';
            }
        });
    });
});

