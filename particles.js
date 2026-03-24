/**
 * Massimo Vendola Portfolio - Particle System
 * Organic sine-wave flowing particles
 */

(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;
  let isActive = true;
  
  // Configuration
  const config = {
    particleCount: 40,
    connectionDistance: 150,
    maxConnections: 3,
    speed: 0.3,
    particleSize: 2,
    opacity: 0.4
  };
  
  // Handle resize
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  // Particle class
  class Particle {
    constructor() {
      this.reset();
      // Start at random positions
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * config.particleSize + 1;
      this.speedY = Math.random() * config.speed + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * config.opacity + 0.1;
      this.phase = Math.random() * Math.PI * 2;
      this.frequency = Math.random() * 0.01 + 0.005;
      this.amplitude = Math.random() * 30 + 20;
    }
    
    update() {
      // Sine wave motion
      this.phase += this.frequency;
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.phase) * 0.3;
      
      // Reset if off screen
      if (this.y < -10 || this.x < -50 || this.x > canvas.width + 50) {
        this.reset();
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(250, 242, 233, ${this.opacity})`;
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
      let connections = 0;
      
      for (let j = i + 1; j < particles.length; j++) {
        if (connections >= config.maxConnections) break;
        
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.connectionDistance) {
          const opacity = (1 - distance / config.connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(250, 242, 233, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          connections++;
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
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    } else {
      isActive = true;
      animate();
    }
  });
  
  // Initialize and start
  init();
  animate();
})();
