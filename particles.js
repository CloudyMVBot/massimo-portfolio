/**
 * Interactive Particle Network for Point Cloud Background
 * Creates an organic, flowing point cloud effect with mouse interaction
 * Now with stable resizing and click explosion effect
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
        mouseRepelForce: 2.5,
        returnToBaseSpeed: 0.02,
        // Explosion effect config
        explosionRadius: 150,
        explosionForce: 15,
        explosionBrightnessDuration: 30 // frames
    };

    let particles = [];
    let animationId = null;
    let isActive = true;
    let isVisible = true;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    
    // Mouse state
    const mouse = {
        x: null,
        y: null,
        isActive: false
    };

    // Resize handling - preserve particle positions relative to screen
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Calculate scale factors
        const scaleX = width / lastWidth;
        const scaleY = height / lastHeight;
        
        // Update canvas size
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        ctx.scale(dpr, dpr);
        
        // Scale particle positions to maintain relative positions
        particles.forEach(p => {
            p.x *= scaleX;
            p.y *= scaleY;
            p.baseX *= scaleX;
            p.baseY *= scaleY;
            
            // Keep particles within bounds
            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));
            p.baseX = Math.max(0, Math.min(width, p.baseX));
            p.baseY = Math.max(0, Math.min(height, p.baseY));
        });
        
        lastWidth = width;
        lastHeight = height;
    }

    // Particle class with mouse interaction and explosion effect
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
            // Explosion effect properties
            this.brightness = 0; // 0 = normal, 1 = fully bright
            this.brightnessDecay = 0;
            this.explosionVx = 0;
            this.explosionVy = 0;
        }

        reset() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.x = Math.random() * width;
            this.y = Math.random() * height;
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
            this.brightness = 0;
            this.brightnessDecay = 0;
            this.explosionVx = 0;
            this.explosionVy = 0;
        }

        explode(clickX, clickY) {
            const dx = this.x - clickX;
            const dy = this.y - clickY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.explosionRadius) {
                // Calculate explosion force based on distance
                const force = (1 - distance / config.explosionRadius) * config.explosionForce;
                const angle = Math.atan2(dy, dx);
                
                // Apply explosion velocity
                this.explosionVx = Math.cos(angle) * force;
                this.explosionVy = Math.sin(angle) * force;
                
                // Set brightness
                this.brightness = 1;
                this.brightnessDecay = 1 / config.explosionBrightnessDuration;
            }
        }

        update() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Handle explosion brightness decay
            if (this.brightness > 0) {
                this.brightness -= this.brightnessDecay;
                if (this.brightness < 0) this.brightness = 0;
            }
            
            // Handle explosion velocity decay
            this.explosionVx *= 0.95;
            this.explosionVy *= 0.95;
            
            // Apply explosion movement
            this.x += this.explosionVx;
            this.y += this.explosionVy;
            this.baseX += this.explosionVx;
            this.baseY += this.explosionVy;
            
            // Organic movement with sine wave
            this.phase += this.phaseSpeed;
            this.baseX += this.vx + Math.sin(this.phase) * 0.2;
            this.baseY += this.vy + Math.cos(this.phase * 0.7) * 0.2;

            // Wrap around edges for base position
            if (this.baseX < 0) {
                this.baseX = width;
                this.x = width;
            }
            if (this.baseX > width) {
                this.baseX = 0;
                this.x = 0;
            }
            if (this.baseY < 0) {
                this.baseY = height;
                this.y = height;
            }
            if (this.baseY > height) {
                this.baseY = 0;
                this.y = 0;
            }

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

            // Smoothly return to base position
            const returnX = (this.baseX - this.x) * config.returnToBaseSpeed;
            const returnY = (this.baseY - this.y) * config.returnToBaseSpeed;
            
            this.x += returnX;
            this.y += returnY;

            this.connections = 0;
        }

        draw() {
            // Calculate color based on brightness
            const baseGray = 200;
            const brightGray = 255;
            const gray = baseGray + (brightGray - baseGray) * this.brightness;
            const alpha = this.opacity + (1 - this.opacity) * this.brightness * 0.5;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;
            ctx.fill();
            
            // Enhanced glow effect when bright
            const glowSize = this.size * (2 + this.brightness * 2);
            const glowAlpha = (this.opacity * 0.2) + (this.brightness * 0.4);
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${glowAlpha})`;
            ctx.fill();
        }
    }

    // Initialize particles
    function init() {
        lastWidth = window.innerWidth;
        lastHeight = window.innerHeight;
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
                    // Brighter connections when particles are bright
                    const brightnessBoost = (particles[i].brightness + particles[j].brightness) * 0.3;
                    const finalOpacity = Math.min(1, opacity + brightnessBoost);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${200 + brightnessBoost * 55}, ${200 + brightnessBoost * 55}, ${200 + brightnessBoost * 55}, ${finalOpacity})`;
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

    // Handle click explosion
    function handleClick(e) {
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        // Trigger explosion on all particles within radius
        particles.forEach(particle => {
            particle.explode(clickX, clickY);
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
    window.addEventListener('resize', resize); // Now preserves positions
    document.addEventListener('visibilitychange', handleVisibility);
    
    // Mouse interaction events
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    // Click explosion effect
    document.addEventListener('click', handleClick, { passive: true });
    
    // Touch support for mobile
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            mouse.isActive = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', handleMouseLeave, { passive: true });
    
    // Touch click for mobile
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            handleClick(e.touches[0]);
        }
    }, { passive: true });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        isActive = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });

})();