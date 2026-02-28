import { useEffect, useRef, useCallback } from 'react';

export interface ParticleSettings {
  particleCount: number;
  particleSpeed: number;
  particleSize: number;
  particleColor: string;
  showConnectionLines: boolean;
  mouseInteraction: boolean;
  backgroundEffect: string;
  glassmorphismEnabled: boolean;
  heroGradientStart: string;
  heroGradientEnd: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
}

interface Props {
  settings: ParticleSettings;
  className?: string;
}

export default function ParticleCanvas({ settings, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const settingsRef = useRef(settings);

  // Keep settings ref in sync without restarting animation
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const initParticles = useCallback((width: number, height: number, count: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 0.5 + 0.3);
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    particlesRef.current = initParticles(width, height, settings.particleCount);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        canvas.width = width;
        canvas.height = height;
        particlesRef.current = initParticles(width, height, settingsRef.current.particleCount);
      }
    });
    resizeObserver.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let tick = 0;

    const drawAurora = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, gs: string, ge: string) => {
      const grad = ctx.createLinearGradient(
        w * (0.3 + 0.2 * Math.sin(t * 0.0008)),
        0,
        w * (0.7 + 0.2 * Math.cos(t * 0.0006)),
        h
      );
      grad.addColorStop(0, gs + 'cc');
      grad.addColorStop(0.4, ge + '88');
      grad.addColorStop(0.7, gs + '55');
      grad.addColorStop(1, ge + 'cc');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Second aurora layer
      const grad2 = ctx.createRadialGradient(
        w * (0.5 + 0.3 * Math.sin(t * 0.0005)),
        h * (0.4 + 0.2 * Math.cos(t * 0.0007)),
        0,
        w * 0.5,
        h * 0.5,
        w * 0.7
      );
      grad2.addColorStop(0, ge + '44');
      grad2.addColorStop(0.5, gs + '22');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);
    };

    const drawGradientMesh = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, gs: string, ge: string) => {
      const grad = ctx.createLinearGradient(
        w * (0.5 + 0.5 * Math.sin(t * 0.0004)),
        h * (0.5 + 0.5 * Math.cos(t * 0.0003)),
        w * (0.5 - 0.5 * Math.sin(t * 0.0004)),
        h * (0.5 - 0.5 * Math.cos(t * 0.0003))
      );
      grad.addColorStop(0, gs + 'bb');
      grad.addColorStop(0.5, ge + '77');
      grad.addColorStop(1, gs + 'bb');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      tick++;
      const s = settingsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const speedMult = s.particleSpeed;
      const maxDist = 120;
      const mouseRadius = 100;

      ctx.clearRect(0, 0, width, height);

      // Background effects
      if (s.backgroundEffect === 'aurora') {
        drawAurora(ctx, width, height, tick, s.heroGradientStart, s.heroGradientEnd);
      } else if (s.backgroundEffect === 'gradient-mesh' || s.backgroundEffect === 'gradient') {
        drawGradientMesh(ctx, width, height, tick, s.heroGradientStart, s.heroGradientEnd);
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction
        if (s.mouseInteraction) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius && dist > 0) {
            const force = (mouseRadius - dist) / mouseRadius;
            p.vx -= (dx / dist) * force * 0.3;
            p.vy -= (dy / dist) * force * 0.3;
          }
        }

        // Apply speed multiplier and damping
        p.vx *= 0.99;
        p.vy *= 0.99;
        const baseSpeed = 0.4 * speedMult;
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed < baseSpeed) {
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
        }
        if (currentSpeed > baseSpeed * 3) {
          p.vx *= 0.95;
          p.vy *= 0.95;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulsing opacity
        p.pulsePhase += 0.02;
        const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulsePhase));

        // Draw particle
        const particleSize = s.particleSize * p.size;
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = s.particleColor + Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Connection lines
        if (s.showConnectionLines) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              const lineOpacity = (1 - dist / maxDist) * 0.35;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = s.particleColor + Math.floor(lineOpacity * 255).toString(16).padStart(2, '0');
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initParticles, settings.particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'auto' }}
    />
  );
}
