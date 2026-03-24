/**
 * Massimo Vendola Portfolio - Organic Particle System
 * Flowing, breathing particle animation with mouse interaction
 */

(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;
  let mouse = { x: null, y: null, radius: 150 };
  let time = 0;

  // Configuration for organic feel
  const config = {
    particleCount: window.innerWidth < 768 ? 40 : 80,
    connectionDistance: 150,
    mouseRepelDistance: 200,
    mouseRepelForce: 0.8,
    baseSpeed: 0.3,
    speedVariation: 0.4,
    sizeMin: 1.5,
    sizeMax: 3.5,
    opacityMin: 0.2,
    opacityMax: 0.6,
    // Sine wave motion parameters for organic flow
    waveAmplitude: 0.5,
    waveFrequency: 0.002,
    waveSpeed: 0.001
  };

  // Resize canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    config.particleCount = window.innerWidth < 768 ? 40 : 80;
  }

  // Particle class with organic motion
  class Particle {
    constructor() {
      this.reset();
      // Random start time for wave offset (each particle has unique phase)
      this.wavePhase = Math.random() * Math.PI * 2;
      this.waveOffset = Math.random() * 1000;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      
      // Varied base velocities for organic feel
      const angle = Math.random() * Math.PI * 2;
      const speed = config.baseSpeed + Math.random() * config.speedVariation;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      
      // Individual particle characteristics
      this.size = config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin);
      this.opacity = config.opacityMin + Math.random() * (config.opacityMax - config.opacityMin);
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
      // Organic sine wave motion - creates flowing current effect
      const waveX = Math.sin(time * config.waveSpeed + this.wavePhase + this.y * config.waveFrequency) * config.waveAmplitude;
      const waveY = Math.cos(time * config.waveSpeed + this.wavePhase + this.x * config.waveFrequency) * config.waveAmplitude;
      
      // Apply base velocity + wave motion
      this.x += this.vx + waveX * 0.3;
      this.y += this.vy + waveY * 0.3;

      // Mouse repulsion - gentle avoidance
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseRepelDistance) {
          const force = (config.mouseRepelDistance - distance) / config.mouseRepelDistance;
          const angle = Math.atan2(dy, dx);
          const repelX = Math.cos(angle) * force * config.mouseRepelForce;
          const repelY = Math.sin(angle) * force * config.mouseRepelForce;
          this.x += repelX;
          this.y += repelY;
        }
      }

      // Breathing opacity effect
      this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.15;
      this.currentOpacity = Math.max(0.1, Math.min(0.8, this.currentOpacity));

      // Wrap around edges for continuous flow
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(250, 242, 233, ${this.currentOpacity})`;
      ctx.fill();
    }
  }

  // Initialize particles
  function init() {
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

        if (distance < config.connectionDistance) {
          // Fade connection based on distance
          const opacity = (1 - distance / config.connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(250, 242, 233, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop with requestAnimationFrame for 60fps
  function animate() {
    time += 16; // Approximate ms per frame at 60fps
    
    // Clear with slight trail effect for smoother motion
    ctx.fillStyle = 'rgba(20, 19, 17, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connections
    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  // Mouse event handlers
  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function handleMouseLeave() {
    mouse.x = null;
    mouse.y = null;
  }

  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }

  function handleTouchEnd() {
    mouse.x = null;
    mouse.y = null;
  }

  // Visibility handling - pause when tab hidden
  function handleVisibilityChange() {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  }

  // Initialize
  resize();
  init();
  animate();

  // Event listeners
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  window.addEventListener('touchend', handleTouchEnd);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
})();
