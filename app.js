// Utility Function: Toggle Class
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function () {
            toggleClass(mobileNav, 'active');
            const isExpanded = mobileNav.classList.contains('active');
            mobileMenuBtn.textContent = isExpanded ? '✕' : '☰';
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded.toString());
        });

        // Event Delegation for Mobile Nav Links
        mobileNav.addEventListener('click', function (event) {
            if (event.target.classList.contains('mobile-nav-link')) {
                mobileNav.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close Mobile Menu on Outside Click
        document.addEventListener('click', function (event) {
            if (!mobileNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mobileNav.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// Smooth Scrolling for Navigation Links (for same-page anchors)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]'); // Targets same-page links
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Ensure it's a valid ID selector and not just "#"
            if (targetId.length > 1) { 
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); // Prevent default only if target is found for smooth scroll
                    // Calculate offset for sticky headers
                    const headerOffset = 80; // Adjust based on combined height of sticky emergency banner and header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Validate required fields
            if (!name || !email || !phone || !service) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Create mailto link with form data
            const subject = encodeURIComponent(`Service Request: ${service} from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone}\n` +
                `Service Required: ${service}\n` +
                `Message: ${message || 'No additional message'}`
            );
            
            const mailtoLink = `mailto:luis@ljkgassafe.com?subject=${subject}&body=${body}`;
            
            // Attempt to open email client
            window.location.href = mailtoLink;
            
            // Show success message (user will need to manually send the email)
            showNotification('Your email client should now open. Please review and send your message. We\'ll respond within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
});

// REMOVED: Obsolete Privacy Policy Link Click Handler, as privacy_policy.html now exists.

// Notification System: Support Multiple Notifications
function showNotification(message, type = 'info') {
    const notificationId = `notification-${Date.now()}`;
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification" onclick="document.getElementById('${notificationId}').remove()">✕</button>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        const element = document.getElementById(notificationId);
        if (element) {
            element.remove();
        }
    }, 7000);
}

// Phone Number Click Tracking (Example - can be expanded for analytics)
document.addEventListener('DOMContentLoaded', function() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Example: Log to console. Replace with actual analytics if needed.
            console.log('Phone number clicked:', this.href);
            // if (typeof gtag === 'function') { // Example for Google Analytics
            //     gtag('event', 'click', {
            //         'event_category': 'Phone Link',
            //         'event_label': this.href
            //     });
            // }
        });
    });
});

// Active Navigation Highlighting (Conditional based on page)
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]'); // Sections to track for highlighting
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link'); // All main navigation links
    
    function highlightCurrentSection() {
        let currentSectionId = '';
        const headerOffset = 100; // Offset for sticky header height

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            // Check if section is within the viewport, considering the offset
            if (sectionTop <= headerOffset && (sectionTop + section.offsetHeight) > headerOffset) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section ID (e.g., href="#about" for section id="about")
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Only run scroll-based highlighting on pages that have the sections (typically index.html)
    const isIndexPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
    if (sections.length > 0 && isIndexPage) {
        // Add CSS for active state if not already present
        if (!document.querySelector('#nav-active-styles')) {
            const style = document.createElement('style');
            style.id = 'nav-active-styles';
            style.textContent = `
                .nav-link.active,
                .mobile-nav-link.active {
                    background: rgba(255, 215, 0, 0.2) !important; /* Gold highlight */
                    color: #FFD700 !important; /* Gold text */
                    font-weight: var(--font-weight-bold); /* Make active link bolder */
                }
            `;
            document.head.appendChild(style);
        }
        
        // Initial highlight check
        highlightCurrentSection();
        // Highlight on scroll
        window.addEventListener('scroll', highlightCurrentSection);
    } else {
        // On other pages (e.g., privacy policy), remove any 'active' class from main nav links
        // as they generally point to homepage sections.
        navLinks.forEach(link => {
            link.classList.remove('active');
            // If a specific link should be active on a non-index page (e.g., a "Privacy" link in nav), handle it here.
            // For this site, the main nav doesn't have a direct "Privacy Policy" link.
        });
    }
});

// Form Field Enhancements (Focus/Blur animations)
document.addEventListener('DOMContentLoaded', function() {
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px var(--color-focus-ring)'; // Use existing focus ring variable
            this.style.borderColor = 'var(--color-primary)'; // Use existing primary color for border
        });
        
        control.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
            this.style.borderColor = 'var(--color-border)'; // Reset to default border color
        });
        
        // Optional: Basic phone number formatting guidance (can be improved)
        if (control.type === 'tel') {
            control.addEventListener('input', function(e) {
                // This is a very basic example and might interfere with user input.
                // Consider a dedicated library for robust phone number formatting/validation if needed.
                // let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                // Example: e.target.value = value; // Re-assign formatted value
            });
        }
    });
});

// Emergency Banner Animation (Pulse effect for phone number)
document.addEventListener('DOMContentLoaded', function() {
    const emergencyBanner = document.querySelector('.emergency-banner');
    
    if (emergencyBanner) {
        const emergencyPhone = emergencyBanner.querySelector('.emergency-phone');
        if (emergencyPhone) {
            // Add pulse animation CSS if not already present
            if (!document.querySelector('#pulse-animation-style')) {
                const style = document.createElement('style');
                style.id = 'pulse-animation-style';
                style.textContent = `
                    @keyframes pulseAnimation {
                        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                        70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
                        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                    }
                    .emergency-phone-pulsing {
                        animation: pulseAnimation 2s infinite;
                    }
                `;
                document.head.appendChild(style);
            }
            // Apply pulsing class
            emergencyPhone.classList.add('emergency-phone-pulsing');
        }
    }
});

// Accessibility Enhancements: Skip to Content Link
document.addEventListener('DOMContentLoaded', function() {
    // Check if a skip link with class 'sr-only' and an href starting with '#' already exists.
    // The privacy_policy.html page has its own static skip link.
    if (!document.querySelector('a.sr-only[href^="#"]')) {
        const skipLink = document.createElement('a');
        
        // Determine target: #main-content if exists, otherwise #home, fallback to first <main> or <section>
        let targetId = 'main-content'; // Default target
        const mainContentEl = document.getElementById('main-content');
        const homeEl = document.getElementById('home');
        
        if (homeEl) { // Priority for #home on index page
            targetId = 'home';
        } else if (!mainContentEl) { // If #main-content also doesn't exist
            const firstMainTag = document.querySelector('main');
            if (firstMainTag) {
                if (!firstMainTag.id) firstMainTag.id = 'main-content-generated'; // Assign ID if missing
                targetId = firstMainTag.id;
            } else {
                 const firstSectionWithId = document.querySelector('section[id]');
                 if (firstSectionWithId) targetId = firstSectionWithId.id;
                 // else, targetId remains 'main-content', user should ensure such an element exists.
            }
        }
        // If targetId is still 'main-content' but the element doesn't exist, this won't break,
        // but the link won't go anywhere useful. The current site structure (index.html has #home, privacy.html has #main-content) is handled.

        skipLink.href = '#' + targetId;
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only'; // Class for screen readers and specific styling
        
        // Styling for the skip link (visible on focus)
        skipLink.style.cssText = `
            position: absolute;
            top: -100px; /* Visually hidden off-screen */
            left: 6px;
            background: #1B3A4B; /* Dark blue, consistent with header */
            color: white;
            padding: 10px 15px; /* Generous padding */
            text-decoration: none;
            z-index: 3000; /* Highest z-index */
            border-radius: var(--radius-base); /* Use CSS variable for radius */
            transition: top 0.3s ease-in-out; /* Smooth transition */
            font-weight: var(--font-weight-medium);
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px'; /* Bring into view on focus */
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-100px'; /* Hide again on blur */
        });
        
        // Prepend to body
        if (document.body) { // Ensure body exists
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
    }
});
