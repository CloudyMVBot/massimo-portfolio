/**
 * Interactive Particle Network for Point Cloud Background
 * Creates an organic, flowing point cloud effect with mouse interaction
 */

(function() {
    'use strict';

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Configuration for interactive particle network
    const config = {
        particleCount: 80,
        connectionDistance: 150,
        maxConnections: 3,
        particleSpeed: 0.4,
        particleSize: { min: 3, max: 7 },
        opacity: { min: 0.3, max: 0.8 },
        mouseInteractionDistance: 200,
        mouseRepelForce: 0.8,
        returnToBaseSpeed: 0.02
    };

    let particles = [];
    let animationId = null;
    let isActive = true;
    let isVisible = true;
    
    // Mouse state
    const mouse = {
        x: null,
        y: null,
        isActive: false
    };

    // Resize handling
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        ctx.scale(dpr, dpr);
    }

    // Particle class with mouse interaction
    class Particle {
        constructor() {
            this.reset();
            // Start at random positions
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            // Store original position for return behavior
            this.baseX = this.x;
            this.baseY = this.y;
            // Random phase for organic movement
            this.phase = Math.random() * Math.PI * 2;
            this.phaseSpeed = 0.01 + Math.random() * 0.02;
        }

        reset() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.x = Math.random() * width;
            this.y = Math.random() * window.innerHeight;
            this.baseX = this.x;
            this.baseY = this.y;
            
            // Organic drift velocity
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
            
            this.size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
            this.opacity = Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min;
            this.connections = 0;
            this.phase = Math.random() * Math.PI * 2;
            this.phaseSpeed = 0.01 + Math.random() * 0.02;
        }

        update() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Organic movement with sine wave
            this.phase += this.phaseSpeed;
            this.baseX += this.vx + Math.sin(this.phase) * 0.2;
            this.baseY += this.vy + Math.cos(this.phase * 0.7) * 0.2;

            // Wrap around edges for base position
            if (this.baseX < 0) this.baseX = width;
            if (this.baseX > width) this.baseX = 0;
            if (this.baseY < 0) this.baseY = height;
            if (this.baseY > height) this.baseY = 0;

            // Mouse interaction - gentle repulsion
            if (mouse.isActive && mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseInteractionDistance) {
                    const force = (config.mouseInteractionDistance - distance) / config.mouseInteractionDistance;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * config.mouseRepelForce;
                    const pushY = Math.sin(angle) * force * config.mouseRepelForce;
                    
                    this.x += pushX;
                    this.y += pushY;
                }
            }

            // Smoothly return to base position (organic flow back)
            const returnX = (this.baseX - this.x) * config.returnToBaseSpeed;
            const returnY = (this.baseY - this.y) * config.returnToBaseSpeed;
            
            this.x += returnX;
            this.y += returnY;

            this.connections = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Grayscale particles for visibility on dark background
            ctx.fillStyle = `rgba(200, 200, 200, ${this.opacity})`;
            ctx.fill();
            
            // Subtle glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 200, 200, ${this.opacity * 0.2})`;
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

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance && 
                    particles[i].connections < config.maxConnections &&
                    particles[j].connections < config.maxConnections) {
                    
                    const opacity = (1 - distance / config.connectionDistance) * 0.4;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    // Grayscale connection lines
                    ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                    
                    particles[i].connections++;
                    particles[j].connections++;
                }
            }
        }
    }

    // Draw connections from particles to mouse cursor
    function drawMouseConnections() {
        if (!mouse.isActive || mouse.x === null || mouse.y === null) return;
        
        particles.forEach(particle => {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseInteractionDistance) {
                const opacity = (1 - distance / config.mouseInteractionDistance) * 0.3;
                
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(220, 220, 220, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    }

    // Animation loop with 60fps target
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime) {
        if (!isActive || !isVisible) return;
        
        animationId = requestAnimationFrame(animate);
        
        const deltaTime = currentTime - lastTime;
        if (deltaTime < frameInterval) return;
        
        lastTime = currentTime - (deltaTime % frameInterval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections between particles
        drawConnections();
        
        // Draw mouse connections
        drawMouseConnections();
    }

    // Mouse event handlers
    function handleMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.isActive = true;
    }

    function handleMouseLeave() {
        mouse.isActive = false;
        mouse.x = null;
        mouse.y = null;
    }

    function handleMouseEnter(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.isActive = true;
    }

    // Visibility handling
    function handleVisibility() {
        if (document.hidden) {
            isVisible = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        } else {
            isVisible = true;
            animate(0);
        }
    }

    // Initialize
    init();
    animate(0);

    // Event listeners
    window.addEventListener('resize', () => {
        resize();
        init();
    });

    document.addEventListener('visibilitychange', handleVisibility);
    
    // Mouse interaction events
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    canvas.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    
    // Touch support for mobile
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            mouse.isActive = true;
        }
    }, { passive: true });
    
    canvas.addEventListener('touchend', handleMouseLeave, { passive: true });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        isActive = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });

})();
