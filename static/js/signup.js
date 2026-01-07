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
    
    // Validate name
    function validateName() {
        const name = nameInput.value.trim();
        if (!name) {
            nameInput.style.borderColor = '#ef4444';
            return false;
        }
        if (name.length < 2) {
            nameInput.style.borderColor = '#ef4444';
            return false;
        }
        nameInput.style.borderColor = '';
        return true;
    }
    
    // Validate phone number
    function validateNumber() {
        const number = numberInput.value.trim();
        if (!number) {
            numberInput.style.borderColor = '#ef4444';
            return false;
        }
        // Basic phone number validation (at least 10 digits)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        const digitsOnly = number.replace(/\D/g, '');
        if (!phoneRegex.test(number) || digitsOnly.length < 10) {
            numberInput.style.borderColor = '#ef4444';
            return false;
        }
        numberInput.style.borderColor = '';
        return true;
    }
    
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
        if (password.length < 6) {
            passwordInput.style.borderColor = '#ef4444';
            return false;
        }
        passwordInput.style.borderColor = '';
        return true;
    }
    
    // Validate confirm password
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (!confirmPassword) {
            confirmPasswordInput.style.borderColor = '#ef4444';
            return false;
        }
        if (password !== confirmPassword) {
            confirmPasswordInput.style.borderColor = '#ef4444';
            return false;
        }
        confirmPasswordInput.style.borderColor = '';
        return true;
    }
    
    // Validate all fields
    function validateForm() {
        const isValid = 
            validateName() &&
            validateNumber() &&
            validateEmail() &&
            validatePassword() &&
            validateConfirmPassword();
        return isValid;
    }
    
    // Add real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', validateName);
        nameInput.addEventListener('input', function() {
            if (this.value.trim().length >= 2) {
                this.style.borderColor = '';
            }
        });
    }
    
    if (numberInput) {
        numberInput.addEventListener('blur', validateNumber);
        numberInput.addEventListener('input', function() {
            const digitsOnly = this.value.replace(/\D/g, '');
            if (digitsOnly.length >= 10) {
                this.style.borderColor = '';
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(this.value.trim())) {
                this.style.borderColor = '';
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
        passwordInput.addEventListener('input', function() {
            if (this.value.length >= 6) {
                this.style.borderColor = '';
            }
            // Validate confirm password when password changes
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validateConfirmPassword();
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value === passwordInput.value && passwordInput.value.length >= 6) {
                this.style.borderColor = '';
            }
        });
    }
    
    // Form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
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

