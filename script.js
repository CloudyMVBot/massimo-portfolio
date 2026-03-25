/**
 * Massimo Vendola Portfolio
 * JavaScript for interactions, carousels, and animations
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

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

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
    // VIDEO CAROUSEL (Documentaries)
    // ============================================
    const videoCarousels = document.querySelectorAll('.carousel-container[data-carousel="video"]');
    
    videoCarousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    });

    // ============================================
    // REELS CAROUSEL
    // ============================================
    const reelsCarousels = document.querySelectorAll('.reels-carousel-container');
    
    reelsCarousels.forEach(carousel => {
        const track = carousel.querySelector('.reels-track');
        const slides = carousel.querySelectorAll('.reel-slide');
        const prevBtn = carousel.querySelector('.reels-carousel-btn.prev');
        const nextBtn = carousel.querySelector('.reels-carousel-btn.next');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        let slidesPerView = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
        let maxIndex = Math.max(0, slides.length - slidesPerView);
        
        function getSlideWidth() {
            // Calculate slide width including gap
            const slideStyle = window.getComputedStyle(slides[0]);
            const slideWidth = slides[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(track).gap) || 24;
            return slideWidth + gap;
        }
        
        function updateCarousel() {
            const slideWidth = getSlideWidth();
            const translateX = currentIndex * slideWidth;
            track.style.transform = `translateX(-${translateX}px)`;
        }
        
        function updateSlidesPerView() {
            slidesPerView = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
            maxIndex = Math.max(0, slides.length - slidesPerView);
            // Ensure current index is still valid
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            updateCarousel();
        }
        
        // Add click event listeners with proper handling
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }
        
        // Update on window resize
        window.addEventListener('resize', function() {
            updateSlidesPerView();
        }, { passive: true });
        
        // Initialize carousel
        updateSlidesPerView();
        
        // Re-process Instagram embeds when slide changes
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
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
    // INITIALIZE INSTAGRAM EMBEDS
    // ============================================
    if (window.instgrm) {
        window.instgrm.Embeds.process();
    }

    // ============================================
    // INITIALIZE
    // ============================================
    handleNavbarScroll();

    console.log('🎨 Massimo Vendola Portfolio loaded');
});
