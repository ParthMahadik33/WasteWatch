/* ============================================
   WASTESNAP - SIGNUP.JS
   Client-side validation and form handling for Sign Up
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');
    
    // Get form inputs
    const nameInput = document.getElementById('name');
    const numberInput = document.getElementById('number');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    
    // Get error message elements
    const nameError = document.getElementById('name-error');
    const numberError = document.getElementById('number-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    // Clear error messages
    function clearErrors() {
        nameError.textContent = '';
        numberError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        
        // Remove error styling
        nameInput.style.borderColor = '';
        numberInput.style.borderColor = '';
        emailInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
        confirmPasswordInput.style.borderColor = '';
    }
    
    // Show error message
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.style.borderColor = '#ef4444';
    }
    
    // Validate name
    function validateName() {
        const name = nameInput.value.trim();
        if (!name) {
            showError(nameInput, nameError, 'Name is required');
            return false;
        }
        if (name.length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters');
            return false;
        }
        nameError.textContent = '';
        nameInput.style.borderColor = '';
        return true;
    }
    
    // Validate phone number
    function validateNumber() {
        const number = numberInput.value.trim();
        if (!number) {
            showError(numberInput, numberError, 'Phone number is required');
            return false;
        }
        // Basic phone number validation (at least 10 digits)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        const digitsOnly = number.replace(/\D/g, '');
        if (!phoneRegex.test(number) || digitsOnly.length < 10) {
            showError(numberInput, numberError, 'Please enter a valid phone number');
            return false;
        }
        numberError.textContent = '';
        numberInput.style.borderColor = '';
        return true;
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
        if (password.length < 6) {
            showError(passwordInput, passwordError, 'Password must be at least 6 characters');
            return false;
        }
        passwordError.textContent = '';
        passwordInput.style.borderColor = '';
        return true;
    }
    
    // Validate confirm password
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (!confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
            return false;
        }
        if (password !== confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
            return false;
        }
        confirmPasswordError.textContent = '';
        confirmPasswordInput.style.borderColor = '';
        return true;
    }
    
    // Validate all fields
    function validateForm() {
        clearErrors();
        const isValid = 
            validateName() &&
            validateNumber() &&
            validateEmail() &&
            validatePassword() &&
            validateConfirmPassword();
        return isValid;
    }
    
    // Add real-time validation
    nameInput.addEventListener('blur', validateName);
    numberInput.addEventListener('blur', validateNumber);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    
    // Validate confirm password when password changes
    passwordInput.addEventListener('input', function() {
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
    });
    
    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';
        
        // Submit the form
        signupForm.submit();
    });
    
    // Clear errors on input
    [nameInput, numberInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(input.id + '-error');
            if (errorElement) {
                errorElement.textContent = '';
                input.style.borderColor = '';
            }
        });
    });
});

