import React, { useEffect, useRef, useCallback } from 'react';

export interface ParticleSettings {
  particlePreset: string;
  particleCount: number;
  particleMinSize: number;
  particleMaxSize: number;
  particleSpeed: number;
  particleColor: string;
  particleOpacity: number;
}

interface Props {
  settings: ParticleSettings;
  width?: number;
  height?: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ParticleCanvas({ settings }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const {
    particlePreset,
    particleCount,
    particleMinSize,
    particleMaxSize,
    particleSpeed,
    particleColor,
    particleOpacity,
  } = settings;

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const W = canvas.width;
    const H = canvas.height;
    const count = Math.min(particleCount, 500);
    const particles: any[] = [];

    for (let i = 0; i < count; i++) {
      const size = particleMinSize + Math.random() * (particleMaxSize - particleMinSize);
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.2 + Math.random() * 0.8) * particleSpeed;

      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        opacity: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.01 + Math.random() * 0.03,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        color: particleColor,
        life: Math.random(),
        lifeDir: Math.random() > 0.5 ? 1 : -1,
        // For DNA helix
        helixIndex: i,
        helixOffset: (i / count) * Math.PI * 8,
        // For confetti
        confettiColor: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff'][Math.floor(Math.random() * 5)],
        // For snow
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, particleMinSize, particleMaxSize, particleSpeed, particleColor]);

  const drawFrame = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, time: number) => {
    const W = canvas.width;
    const H = canvas.height;
    const particles = particlesRef.current;
    const alpha = particleOpacity;
    const col = particleColor;

    ctx.clearRect(0, 0, W, H);

    if (particlePreset === 'None' || particlePreset === 'none') return;

    switch (particlePreset) {
      case 'Floating Dots': {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          p.phase += p.phaseSpeed;
          const a = alpha * (0.5 + 0.5 * Math.sin(p.phase));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = rgba(col, a);
          ctx.fill();
        }
        break;
      }

      case 'Stars': {
        for (const p of particles) {
          p.phase += p.phaseSpeed * 0.5;
          const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(p.phase));
          const a = alpha * twinkle;
          const s = p.size;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillStyle = rgba(col, a);
          // 4-point star
          ctx.beginPath();
          for (let k = 0; k < 4; k++) {
            const angle = (k / 4) * Math.PI * 2;
            const r = k % 2 === 0 ? s * 2 : s * 0.5;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        break;
      }

      case 'Snow': {
        for (const p of particles) {
          p.y += p.size * 0.3 * particleSpeed;
          p.wobble += p.wobbleSpeed;
          p.x += Math.sin(p.wobble) * 0.5;
          if (p.y > H + p.size) {
            p.y = -p.size;
            p.x = Math.random() * W;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = rgba(col, alpha * 0.8);
          ctx.fill();
        }
        break;
      }

      case 'Bubbles': {
        for (const p of particles) {
          p.y -= p.size * 0.2 * particleSpeed;
          p.x += Math.sin(p.phase) * 0.5;
          p.phase += p.phaseSpeed;
          if (p.y < -p.size) {
            p.y = H + p.size;
            p.x = Math.random() * W;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(col, alpha * 0.7);
          ctx.lineWidth = 1;
          ctx.stroke();
          // Highlight
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = rgba('#ffffff', 0.3);
          ctx.fill();
        }
        break;
      }

      case 'Geometric Shapes': {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotSpeed;
          if (p.x < -50) p.x = W + 50;
          if (p.x > W + 50) p.x = -50;
          if (p.y < -50) p.y = H + 50;
          if (p.y > H + 50) p.y = -50;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.strokeStyle = rgba(col, alpha * 0.6);
          ctx.lineWidth = 1;
          const s = p.size * 3;
          // Alternate triangle / square
          if (p.helixIndex % 2 === 0) {
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.866, s * 0.5);
            ctx.lineTo(-s * 0.866, s * 0.5);
            ctx.closePath();
            ctx.stroke();
          } else {
            ctx.strokeRect(-s / 2, -s / 2, s, s);
          }
          ctx.restore();
        }
        break;
      }

      case 'DNA Helix': {
        const t = time * 0.001 * particleSpeed;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const progress = (i / particles.length + t * 0.1) % 1;
          const x1 = W * 0.3 + Math.sin(progress * Math.PI * 6 + t) * W * 0.15;
          const x2 = W * 0.7 + Math.sin(progress * Math.PI * 6 + t + Math.PI) * W * 0.15;
          const y = progress * H;
          ctx.beginPath();
          ctx.arc(x1, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = rgba(col, alpha);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x2, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = rgba(col, alpha * 0.6);
          ctx.fill();
          // Connecting rungs every few particles
          if (i % 8 === 0) {
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = rgba(col, alpha * 0.2);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        break;
      }

      case 'Medical Pulse': {
        const t = time * 0.001 * particleSpeed;
        for (const p of particles) {
          p.phase += p.phaseSpeed;
          const pulse = Math.abs(Math.sin(p.phase));
          const a = alpha * pulse;
          const s = p.size * (1 + pulse * 0.5);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillStyle = rgba(col, a);
          // Plus / cross shape
          ctx.fillRect(-s * 0.5, -s * 1.5, s, s * 3);
          ctx.fillRect(-s * 1.5, -s * 0.5, s * 3, s);
          ctx.restore();
          // Slow drift
          p.x += p.vx * 0.3;
          p.y += p.vy * 0.3;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
        }
        break;
      }

      case 'Confetti': {
        for (const p of particles) {
          p.y += p.size * 0.4 * particleSpeed;
          p.x += Math.sin(p.wobble) * 1.5;
          p.wobble += p.wobbleSpeed;
          p.rotation += p.rotSpeed;
          if (p.y > H + 10) {
            p.y = -10;
            p.x = Math.random() * W;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.confettiColor;
          ctx.globalAlpha = alpha;
          ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
          ctx.globalAlpha = 1;
          ctx.restore();
        }
        break;
      }

      case 'Fireflies': {
        for (const p of particles) {
          p.x += p.vx * 0.5;
          p.y += p.vy * 0.5;
          p.phase += p.phaseSpeed;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          const glow = 0.2 + 0.8 * Math.abs(Math.sin(p.phase));
          const a = alpha * glow;
          // Glow effect
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          grad.addColorStop(0, rgba(col, a));
          grad.addColorStop(1, rgba(col, 0));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = rgba('#ffffff', a * 0.8);
          ctx.fill();
        }
        break;
      }

      case 'Network': {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = rgba(col, alpha);
          ctx.fill();
        }
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = rgba(col, alpha * (1 - dist / 100) * 0.4);
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        break;
      }

      default:
        break;
    }
  }, [particlePreset, particleColor, particleOpacity, particleSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        initParticles(canvas);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let startTime = performance.now();

    const loop = (now: number) => {
      drawFrame(canvas, ctx, now - startTime);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initParticles, drawFrame]);

  if (particlePreset === 'None' || particlePreset === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
