// PortSwigger Interactive Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeResponsiveFeatures();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navMenuLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navMenuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Run on page load
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    // Add smooth scrolling to navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Global smooth scroll function for buttons
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70; // Account for fixed nav
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Animation and scroll effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections and cards for animations
    const animatedElements = document.querySelectorAll(
        '.challenge-card, .advantage-card, .trust-point, .integration-feature, .oast-feature, .roi-benefit'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Add CSS classes for animations
    const style = document.createElement('style');
    style.textContent = `
        .challenge-card, .advantage-card, .trust-point, 
        .integration-feature, .oast-feature, .roi-benefit {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .animate-in.challenge-card:nth-child(2) { transition-delay: 0.1s; }
        .animate-in.challenge-card:nth-child(3) { transition-delay: 0.2s; }
        .animate-in.advantage-card:nth-child(2) { transition-delay: 0.1s; }
        .animate-in.advantage-card:nth-child(3) { transition-delay: 0.2s; }
        .animate-in.trust-point:nth-child(2) { transition-delay: 0.1s; }
        .animate-in.trust-point:nth-child(3) { transition-delay: 0.2s; }
        .animate-in.trust-point:nth-child(4) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero icons
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.security-icon');
        const speed = 0.5;

        parallaxElements.forEach((element, index) => {
            const yPos = -(scrolled * speed * (index + 1) * 0.1);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Responsive features and mobile optimizations
function initializeResponsiveFeatures() {
    // Handle window resize events
    window.addEventListener('resize', debounce(() => {
        // Close mobile menu on resize
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth > 768) {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        }
        
        // Recalculate any layout-dependent features
        updateCardHeights();
    }, 250));

    // Touch and swipe support for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch-friendly hover effects
        const cards = document.querySelectorAll('.challenge-card, .advantage-card, .trust-point');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 300);
            });
        });
        
        // Add CSS for touch states
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            .touch-device .challenge-card.touch-active,
            .touch-device .advantage-card.touch-active,
            .touch-device .trust-point.touch-active {
                transform: translateY(-5px);
                box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(touchStyle);
    }
}

// Interactive elements and user engagement
function initializeInteractiveElements() {
    // Add click interactions to statistics
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        stat.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Interactive badges in hero section
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Dynamic testimonial interaction
    const testimonialCard = document.querySelector('.customer-testimonial');
    if (testimonialCard) {
        testimonialCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        testimonialCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function updateCardHeights() {
    // Ensure cards in grid layouts have consistent heights
    const cardGroups = [
        '.challenge-grid .challenge-card',
        '.advantage-grid .advantage-card',
        '.trust-points .trust-point'
    ];

    cardGroups.forEach(selector => {
        const cards = document.querySelectorAll(selector);
        if (cards.length > 0) {
            // Reset heights
            cards.forEach(card => card.style.height = 'auto');
            
            // Find max height
            let maxHeight = 0;
            cards.forEach(card => {
                const height = card.offsetHeight;
                if (height > maxHeight) maxHeight = height;
            });
            
            // Apply max height to all cards in group (only on desktop)
            if (window.innerWidth > 768) {
                cards.forEach(card => card.style.height = maxHeight + 'px');
            }
        }
    });
}

// Enhanced scroll effects
function initializeAdvancedScrollEffects() {
    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Progress indicator (optional)
    createProgressIndicator();
}

function createProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--primary-orange);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeResponsiveFeatures();
    initializeInteractiveElements();
    initializeAdvancedScrollEffects();
    
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        updateCardHeights();
    }, 100);
});

// Contact Sales functionality based on slide 13
function showContactInfo() {
    const contactModal = document.createElement('div');
    contactModal.className = 'contact-modal-overlay';
    contactModal.innerHTML = `
        <div class="contact-modal">
            <div class="contact-modal-header">
                <h2>Your Swiggers</h2>
                <button class="close-modal" onclick="closeContactModal()">&times;</button>
            </div>
            <div class="contact-modal-content">
                <p class="contact-intro">Meet your dedicated PortSwigger team ready to help secure your applications:</p>
                
                <div class="swiggers-grid">
                    <div class="swigger-card">
                        <div class="swigger-avatar">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <h3>Micah Brochin</h3>
                        <p class="swigger-title">Enterprise Account Executive - US/Canada</p>
                        <div class="swigger-contact">
                            <a href="mailto:micah.brochin@portswigger.net" class="contact-btn">
                                <i class="fas fa-envelope"></i> Email
                            </a>
                        </div>
                    </div>
                    
                    <div class="swigger-card">
                        <div class="swigger-avatar">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <h3>Cesar Harari</h3>
                        <p class="swigger-title">Solutions Engineer</p>
                        <div class="swigger-contact">
                            <a href="mailto:cesar.harari@portswigger.net" class="contact-btn">
                                <i class="fas fa-envelope"></i> Email
                            </a>
                        </div>
                    </div>
                    
                    <div class="swigger-card">
                        <div class="swigger-avatar">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>Jim DesPres</h3>
                        <p class="swigger-title">VP of Sales</p>
                        <div class="swigger-contact">
                            <a href="mailto:jim.despres@portswigger.net" class="contact-btn">
                                <i class="fas fa-envelope"></i> Email
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="contact-footer">
                    <p><strong>Ready to get started?</strong> Reach out to any of our team members to discuss your security needs and see how PortSwigger can help protect your applications.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(contactModal);
    
    // Add CSS for the modal
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .contact-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        }
        
        .contact-modal {
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: scale(0.8);
            animation: modalSlideIn 0.3s ease forwards;
        }
        
        .contact-modal-header {
            background: var(--primary-orange);
            color: white;
            padding: 20px 30px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .contact-modal-header h2 {
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
        }
        
        .close-modal {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .close-modal:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .contact-modal-content {
            padding: 30px;
        }
        
        .contact-intro {
            font-size: 1.1rem;
            color: var(--light-text);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .swiggers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .swigger-card {
            background: var(--secondary-light);
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 2px solid transparent;
        }
        
        .swigger-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-orange);
        }
        
        .swigger-avatar {
            width: 80px;
            height: 80px;
            background: var(--primary-orange);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            color: white;
            font-size: 2rem;
        }
        
        .swigger-card h3 {
            color: var(--dark-text);
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .swigger-title {
            color: var(--light-text);
            font-size: 0.95rem;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .contact-btn {
            background: var(--primary-orange);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s ease, transform 0.2s ease;
        }
        
        .contact-btn:hover {
            background: #e55a2b;
            transform: translateY(-2px);
        }
        
        .contact-footer {
            background: var(--light-gray);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .contact-footer p {
            margin: 0;
            color: var(--dark-text);
            line-height: 1.6;
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
            to { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
            .contact-modal {
                width: 95%;
                margin: 10px;
            }
            
            .contact-modal-header {
                padding: 15px 20px;
            }
            
            .contact-modal-header h2 {
                font-size: 1.5rem;
            }
            
            .contact-modal-content {
                padding: 20px;
            }
            
            .swiggers-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
        }
    `;
    document.head.appendChild(modalStyle);
    
    // Store references for cleanup
    contactModal.modalStyle = modalStyle;
}

function closeContactModal() {
    const modal = document.querySelector('.contact-modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease forwards';
        const style = document.createElement('style');
        style.textContent = '@keyframes fadeOut { to { opacity: 0; } }';
        document.head.appendChild(style);
        
        setTimeout(() => {
            modal.remove();
            if (modal.modalStyle) {
                modal.modalStyle.remove();
            }
            style.remove();
        }, 300);
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('contact-modal-overlay')) {
        closeContactModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});

// Export scrollToSection function to global scope for HTML onclick handlers
window.scrollToSection = scrollToSection;
window.showContactInfo = showContactInfo;
window.closeContactModal = closeContactModal;