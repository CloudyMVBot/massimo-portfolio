/**
 * Main JavaScript for Massimo Vendola Portfolio
 * Handles navigation, scroll reveal, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // NAVIGATION
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ============================================
    // PROJECT CARD INTERACTIONS
    // ============================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Could open a modal or navigate to case study
            // For now, just a subtle feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (rate < window.innerHeight) {
                heroContent.style.transform = `translateY(${rate * 0.2}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
        }, { passive: true });
    }

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink, { passive: true });

    // ============================================
    // MAGNETIC BUTTON EFFECT
    // ============================================
    const buttons = document.querySelectorAll('.btn');

    if (!window.matchMedia('(pointer: coarse)').matches) {
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // ============================================
    // PERFORMANCE: Pause animations when tab hidden
    // ============================================
    let ticking = false;

    function requestTick(callback) {
        if (!ticking) {
            requestAnimationFrame(() => {
                callback();
                ticking = false;
            });
            ticking = true;
        }
    }

    // ============================================
    // COMING SOON TOAST (for project clicks)
    // ============================================
    function showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 1rem 2rem;
            border-radius: 8px;
            border: 1px solid var(--border);
            font-size: 0.9rem;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // Add click handler for project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            showToast('Case study coming soon');
        });
    });

    // ============================================
    // INITIALIZE
    // ============================================
    // Trigger initial scroll handler
    handleNavbarScroll();
    highlightActiveLink();

    console.log('🎨 Massimo Vendola Portfolio loaded');
});
