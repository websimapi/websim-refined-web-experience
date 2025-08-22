import { gsap } from 'gsap';

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// App state
const app = {
    isLoading: true,
    currentTheme: localStorage.getItem('theme') || 'light',
    animations: {
        particles: null,
        waves: null,
        morphing: null
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupTheme();
    setupLoading();
    setupNavigation();
    setupCursor();
    setupAnimations();
    setupInteractiveDemo();
    setupScrollAnimations();
    setupFormValidation();
    setupCounters();
}

// Theme system
function setupTheme() {
    document.documentElement.setAttribute('data-theme', app.currentTheme);
    
    const themeToggle = $('.theme-toggle');
    const themeIcon = $('.theme-icon');
    
    updateThemeIcon();
    
    themeToggle?.addEventListener('click', toggleTheme);
    
    function toggleTheme() {
        app.currentTheme = app.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', app.currentTheme);
        localStorage.setItem('theme', app.currentTheme);
        updateThemeIcon();
    }
    
    function updateThemeIcon() {
        if (themeIcon) {
            themeIcon.textContent = app.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }
}

// Loading screen
function setupLoading() {
    const loadingScreen = $('#loading-screen');
    
    // Simulate loading
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
        app.isLoading = false;
    }, 2000);
}

// Navigation
function setupNavigation() {
    const navToggle = $('.nav-toggle');
    const navMenu = $('.nav-menu');
    const navLinks = $$('.nav-link');
    
    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu?.classList.toggle('active');
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = $(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const navbar = $('.navbar');
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 100) {
                navbar.style.background = app.currentTheme === 'light' 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(15, 23, 42, 0.95)';
            } else {
                navbar.style.background = app.currentTheme === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(15, 23, 42, 0.9)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// Custom cursor
function setupCursor() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = $('#cursor');
        const follower = $('#cursor-follower');
        
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (cursor) {
                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
            }
        });
        
        // Smooth follower animation
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            if (follower) {
                follower.style.left = followerX + 'px';
                follower.style.top = followerY + 'px';
            }
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
        
        // Cursor hover effects
        $$('button, a, .feature-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor?.classList.add('hover');
                follower?.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor?.classList.remove('hover');
                follower?.classList.remove('hover');
            });
        });
    }
}

// Animations
function setupAnimations() {
    // Hero animations
    const heroTitle = $('.hero-title');
    const heroSubtitle = $('.hero-subtitle');
    const heroActions = $('.hero-actions');
    
    if (heroTitle && heroSubtitle && heroActions) {
        gsap.timeline()
            .from('.title-line', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            })
            .from(heroSubtitle, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3')
            .from(heroActions, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');
    }
    
    // Button hover animations
    $$('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Interactive demo
function setupInteractiveDemo() {
    const demoButtons = $$('.demo-btn');
    const floatingElements = $('.floating-elements');
    
    if (!floatingElements) return;
    
    // Create floating elements
    function createParticles() {
        floatingElements.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: linear-gradient(45deg, #6366f1, #ec4899);
                border-radius: 50%;
                opacity: 0.7;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            floatingElements.appendChild(particle);
            
            // Animate particle
            gsap.to(particle, {
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
                rotation: Math.random() * 360,
                duration: Math.random() * 3 + 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
    
    function createWaves() {
        floatingElements.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                border: 2px solid #6366f1;
                border-radius: 50%;
                opacity: 0.3;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            floatingElements.appendChild(wave);
            
            gsap.fromTo(wave, {
                scale: 0,
                opacity: 0.8
            }, {
                scale: 3,
                opacity: 0,
                duration: 2,
                delay: i * 0.4,
                repeat: -1,
                ease: 'power2.out'
            });
        }
    }
    
    function createMorphing() {
        floatingElements.innerHTML = '';
        
        const morphShape = document.createElement('div');
        morphShape.className = 'morph-shape';
        morphShape.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: linear-gradient(45deg, #6366f1, #ec4899, #f59e0b);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 20px;
        `;
        
        floatingElements.appendChild(morphShape);
        
        gsap.to(morphShape, {
            borderRadius: '50%',
            rotation: 360,
            scale: 1.5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
    }
    
    // Demo button handlers
    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            demoButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const demo = btn.dataset.demo;
            
            switch (demo) {
                case 'particles':
                    createParticles();
                    break;
                case 'waves':
                    createWaves();
                    break;
                case 'morphing':
                    createMorphing();
                    break;
            }
        });
    });
    
    // Initialize with particles
    demoButtons[0]?.click();
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate feature cards
                if (entry.target.classList.contains('feature-card')) {
                    gsap.fromTo(entry.target, {
                        y: 50,
                        opacity: 0
                    }, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    $$('.feature-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Form validation
function setupFormValidation() {
    const form = $('.contact-form');
    const inputs = $$('.contact-form input, .contact-form textarea');
    
    if (!form) return;
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
    
    form.addEventListener('submit', handleSubmit);
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        removeError(field);
        
        if (!value) {
            showError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && !isValidEmail(value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    function clearErrors(e) {
        removeError(e.target);
    }
    
    function showError(field, message) {
        const formGroup = field.closest('.form-group');
        const existing = formGroup?.querySelector('.error-message');
        
        if (existing) existing.remove();
        
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = `
            position: absolute;
            bottom: -20px;
            left: 0;
            color: #ef4444;
            font-size: 0.8rem;
        `;
        
        formGroup?.appendChild(error);
        field.style.borderBottomColor = '#ef4444';
    }
    
    function removeError(field) {
        const formGroup = field.closest('.form-group');
        const error = formGroup?.querySelector('.error-message');
        
        if (error) error.remove();
        field.style.borderBottomColor = '';
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        if (isValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent;
            
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
            
            // Simulate form submission
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.textContent = 'Message Sent! ✓';
                    submitBtn.style.background = '#10b981';
                }
                
                setTimeout(() => {
                    form.reset();
                    if (submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }
                }, 2000);
            }, 1500);
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// Counter animations
function setupCounters() {
    const counters = $$('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                
                gsap.fromTo(counter, {
                    textContent: 0
                }, {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function() {
                        counter.textContent = Math.ceil(counter.textContent);
                    }
                });
                
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Performance monitoring
function setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    function getCLS(onPerfEntry) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    onPerfEntry(entry.value);
                }
            }
        });
        observer.observe({entryTypes: ['layout-shift']});
    }
    
    function getFID(onPerfEntry) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                onPerfEntry(entry.processingStart - entry.startTime);
            }
        });
        observer.observe({entryTypes: ['first-input'], buffered: true});
    }
    
    function getLCP(onPerfEntry) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            onPerfEntry(lastEntry.startTime);
        });
        observer.observe({entryTypes: ['largest-contentful-paint'], buffered: true});
    }
    
    // Report metrics (in production, send to analytics)
    getCLS(console.log);
    getFID(console.log);
    getLCP(console.log);
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, send to error tracking service
});

// Initialize performance monitoring in production
if (location.hostname !== 'localhost') {
    setupPerformanceMonitoring();
}

// Service worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

