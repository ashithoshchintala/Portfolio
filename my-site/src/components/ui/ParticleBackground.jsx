import React, { useRef, useEffect, useState } from 'react';

/**
 * Reusable animated particle/plexus background canvas.
 * Only animates when the section is in the viewport (IntersectionObserver).
 * Removes expensive radial gradients for smoother scroll performance.
 */
const ParticleBackground = ({ 
  particleColor = 'rgba(139, 92, 246, 0.6)',
  lineColor = 'rgba(139, 92, 246, 0.12)',
  particleCount = 40,
  connectDistance = 140,
  speed = 0.3,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only animate when in viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    observer.observe(canvas.parentElement || canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let width, height;
    let running = true;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 1.5); // Cap DPR for perf
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    function initParticles() {
      particles = [];
      const count = Math.min(particleCount, Math.floor((width * height) / 18000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: Math.random() * 1.8 + 0.5,
        });
      }
    }

    function draw() {
      if (!running) return;
      if (!isVisible) {
        // Still schedule but skip actual work when offscreen
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Update & draw particles — no radial gradients (huge perf gain)
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }

      // Draw connections — batch by single strokeStyle
      const distSq = connectDistance * connectDistance;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy;
          if (d < distSq) {
            ctx.moveTo(particles[i].x | 0, particles[i].y | 0);
            ctx.lineTo(particles[j].x | 0, particles[j].y | 0);
          }
        }
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [particleColor, lineColor, particleCount, connectDistance, speed, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default ParticleBackground;
