/* ============================================
   WASTESNAP - INDEX.JS
   Minimal JavaScript for home page
   ============================================ */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    
    // Console log to confirm JS is loaded
    console.log('WasteSnap - Home page loaded successfully');
    
    // Get CTA button
    const ctaButton = document.querySelector('.cta-button');
    
    // Add click event listener to CTA button
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            console.log('Get Started button clicked');
            // Note: Navigation will happen automatically via href
            // This is just for tracking/debugging purposes
        });
    }
    
    // Get Sign In and Sign Up buttons
    const signInButton = document.querySelector('.nav-link');
    const signUpButton = document.querySelector('.nav-button');
    
    // Track Sign In clicks
    if (signInButton) {
        signInButton.addEventListener('click', function(e) {
            console.log('Sign In button clicked');
        });
    }
    
    // Track Sign Up clicks
    if (signUpButton) {
        signUpButton.addEventListener('click', function(e) {
            console.log('Sign Up button clicked');
        });
    }
    
    // Optional: Smooth scroll for any internal anchor links
    // (Currently not used, but useful for future sections)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll if it's an anchor link
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Optional: Add active state visual feedback on button click
    const allButtons = document.querySelectorAll('.cta-button, .nav-button');
    
    allButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
    });

    // User Dropdown Menu Functionality
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    const dropdownMenu = document.getElementById('user-dropdown-menu');
    
    if (userMenuBtn && userDropdown && dropdownMenu) {
        // Toggle dropdown on button click
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking on a dropdown item
        const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                userDropdown.classList.remove('active');
            });
        });
    }

});

// Optional: Log when user leaves the page
window.addEventListener('beforeunload', function() {
    console.log('User leaving WasteSnap home page');
});