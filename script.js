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

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
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
    // EXPANDABLE CARDS (Branded Content Page)
    // ============================================
    const expandableCards = document.querySelectorAll('.expandable-card');

    expandableCards.forEach(card => {
        card.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            
            // Close all other cards
            expandableCards.forEach(c => {
                c.classList.remove('expanded');
            });
            
            // Toggle current card
            if (!isExpanded) {
                this.classList.add('expanded');
                // Reprocess Instagram embeds
                if (window.instgrm) {
                    window.instgrm.Embeds.process();
                }
            }
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
    // INITIALIZE
    // ============================================
    // Trigger initial scroll handler
    handleNavbarScroll();

    console.log('🎨 Massimo Vendola Portfolio loaded');
});
