/**
 * Particle System for Point Cloud Background
 * Creates an organic, flowing point cloud effect
 */

(function() {
    'use strict';

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Configuration
    const config = {
        particleCount: 150,
        connectionDistance: 120,
        maxConnections: 4,
        particleSpeed: 0.3,
        particleSize: { min: 1, max: 3 },
        opacity: { min: 0.2, max: 0.6 }
    };

    let particles = [];
    let animationId = null;
    let isActive = true;

    // Resize handling
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        ctx.scale(dpr, dpr);
    }

    // Particle class
    class Particle {
        constructor() {
            this.reset();
            // Start at random positions
            this.x = Math.random() * canvas.width / (window.devicePixelRatio || 1);
            this.y = Math.random() * canvas.height / (window.devicePixelRatio || 1);
        }

        reset() {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
            this.size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
            this.opacity = Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min;
            this.connections = 0;
        }

        update() {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            this.connections = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74, 124, 89, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize particles
    function init() {
        resize();
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance && 
                    particles[i].connections < config.maxConnections &&
                    particles[j].connections < config.maxConnections) {
                    
                    const opacity = (1 - distance / config.connectionDistance) * 0.3;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(74, 124, 89, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    
                    particles[i].connections++;
                    particles[j].connections++;
                }
            }
        }
    }

    // Animation loop
    function animate() {
        if (!isActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }

    // Visibility handling
    function handleVisibility() {
        if (document.hidden) {
            isActive = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        } else {
            isActive = true;
            animate();
        }
    }

    // Initialize
    init();
    animate();

    // Event listeners
    window.addEventListener('resize', () => {
        resize();
        init();
    });

    document.addEventListener('visibilitychange', handleVisibility);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        isActive = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });

})();
