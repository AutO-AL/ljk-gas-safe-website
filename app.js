// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            
            // Change button icon
            if (mobileNav.classList.contains('active')) {
                mobileMenuBtn.textContent = '✕'; // Close icon
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenuBtn.textContent = '☰'; // Menu icon
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileNav && mobileNav.classList.contains('active') && !mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target)) {
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
                    
                    // Dynamically calculate the offset for sticky headers
                    const header = document.querySelector('header');
                    const emergencyBanner = document.querySelector('.emergency-banner');
                    let headerOffset = 0;
                    if (header) {
                        headerOffset += header.offsetHeight;
                    }
                    if (emergencyBanner) {
                        headerOffset += emergencyBanner.offsetHeight;
                    }

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

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications to prevent stacking
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert'); // For accessibility
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    // Add notification styles (inline for simplicity, consider moving to CSS file)
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#DC2626' : type === 'success' ? '#059669' : '#1B3A4B'}; /* Theme colors */
        color: white;
        padding: 16px 20px;
        border-radius: 8px; /* Consistent with site's border-radius */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Softer shadow */
        z-index: 2000; /* High z-index */
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-family: var(--font-family-base); /* Use site font */
    `;
    
    // Add CSS animation if not already present
    if (!document.querySelector('#notification-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-animation-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 18px; /* Slightly larger */
                padding: 0;
                width: 24px; /* Slightly larger touch target */
                height: 24px; /* Slightly larger touch target */
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
            }
            .notification-close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 7 seconds (longer for readability)
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
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
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (sections.length === 0 || navLinks.length === 0) {
        return; // No sections or nav links to work with
    }

    function highlightCurrentSection() {
        // Determine the trigger point for highlighting, including a buffer
        const header = document.querySelector('header.header');
        const emergencyBanner = document.querySelector('.emergency-banner');
        let triggerPoint = (header?.offsetHeight || 0) + (emergencyBanner?.offsetHeight || 0) + 15; // 15px buffer

        let activeSectionId = '';

        // Check if user has scrolled to the bottom of the page
        const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2;

        if (atBottom) {
            activeSectionId = sections[sections.length - 1].getAttribute('id');
        } else {
            // Find the last section that has scrolled past the trigger point
            const passedSections = [...sections].filter(section => section.getBoundingClientRect().top <= triggerPoint);
            if (passedSections.length > 0) {
                activeSectionId = passedSections[passedSections.length - 1].getAttribute('id');
            }
        }

        // Apply the 'active'/'highlighted' class
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${activeSectionId}`;
            link.classList.toggle('active', isActive && activeSectionId !== 'services');
            link.classList.toggle('highlighted', isActive && activeSectionId === 'services');
        });
    }

    // Only run scroll-based highlighting on the main page
    const isIndexPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
    if (isIndexPage) {
        // Use a throttled scroll handler for performance
        let scrollTimeout;
        const throttledHighlight = () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    highlightCurrentSection();
                    scrollTimeout = null;
                }, 100); // Throttle to run at most every 100ms
            }
        };
        
        window.addEventListener('scroll', throttledHighlight);
        // Initial check on load
        highlightCurrentSection();
    } else {
        // On other pages, remove any active classes
        navLinks.forEach(link => {
            link.classList.remove('active', 'highlighted');
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
