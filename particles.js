/**
 * Dynamic Flowing Particles
 * Creates an animated particle network background
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
    particleCount: 60,
    connectionDistance: 150,
    moveSpeed: 0.5,
    particleSize: 2,
    particleColor: 'rgba(250, 242, 233, 0.5)',
    lineColor: 'rgba(250, 242, 233, 0.08)',
    lineWidth: 1
  };
  
  // Resize canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.moveSpeed;
      this.vy = (Math.random() - 0.5) * config.moveSpeed;
      this.size = Math.random() * config.particleSize + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      
      // Keep in bounds
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = config.particleColor.replace('0.5', this.alpha.toString());
      ctx.fill();
    }
  }
  
  // Initialize particles
  function initParticles() {
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
          const alpha = (1 - distance / config.connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = config.lineColor.replace('0.08', alpha.toString());
          ctx.lineWidth = config.lineWidth;
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    if (!isActive) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    drawConnections();
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Visibility check - pause when not visible
  function handleVisibility() {
    if (document.hidden) {
      isActive = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else {
      isActive = true;
      animate();
    }
  }
  
  // Initialize
  resize();
  initParticles();
  animate();
  
  // Event listeners
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
  
  document.addEventListener('visibilitychange', handleVisibility);
})();
