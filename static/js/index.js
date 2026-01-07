/* ============================================
   WASTEWATCH - INDEX.JS
   JavaScript for home page with new design
   ============================================ */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('WasteWatch - Home page loaded successfully');
    
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

    // Track button clicks for analytics/debugging
    const ctaButtons = document.querySelectorAll('.cta, .secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('CTA button clicked:', this.textContent.trim());
        });
    });

    // Optional: Add active state visual feedback on button click
    ctaButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
    });

});

// Optional: Log when user leaves the page
window.addEventListener('beforeunload', function() {
    console.log('User leaving WasteWatch home page');
});
