import React, { useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useGetAllContent } from '../hooks/useQueries';

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: content } = useGetAllContent();

  const footerGlow = content?.heroSettings?.footerGlowEffect;
  const glowEnabled  = footerGlow?.enabled  ?? false;
  const glowColor    = footerGlow?.color    ?? '#FF6399';
  const glowIntensity = Number(footerGlow?.intensity ?? 3);

  const footerContent = content?.footerContent ?? '';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COLOR = '#4dd9ff';
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.15,
        color: PARTICLE_COLOR,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'unknown-app'
  );

  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={{ background: 'oklch(0.08 0.018 240)' }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      {/* Glow orbs */}
      {glowEnabled && (
        <>
          <div
            className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor}${Math.round(glowIntensity * 0.06 * 255).toString(16).padStart(2,'0')} 0%, transparent 70%)`,
              filter: `blur(${40 + glowIntensity * 4}px)`,
              transform: 'translateY(-50%)',
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-56 sm:w-80 h-56 sm:h-80 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor}${Math.round(glowIntensity * 0.05 * 255).toString(16).padStart(2,'0')} 0%, transparent 70%)`,
              filter: `blur(${30 + glowIntensity * 3}px)`,
              transform: 'translateY(30%)',
            }}
          />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand column */}
          <div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-gradient-cyan mb-3 sm:mb-4">
              Dr. Malay Akechan
            </h3>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'oklch(0.82 0.010 220)' }}>
              {footerContent || 'Dedicated to providing exceptional medical care with compassion and expertise.'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-sm sm:text-base mb-3 sm:mb-4" style={{ color: 'oklch(0.92 0.010 220)' }}>
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {['About', 'Services', 'Clinics', 'Contact'].map(item => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm sm:text-base transition-colors duration-200 flex items-center py-0.5 min-h-[36px]"
                    style={{ color: 'oklch(0.78 0.012 220)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.82 0.18 195)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.78 0.012 220)')}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="font-heading font-semibold text-sm sm:text-base mb-3 sm:mb-4" style={{ color: 'oklch(0.92 0.010 220)' }}>
              Contact
            </h4>
            <p className="text-sm sm:text-base" style={{ color: 'oklch(0.78 0.012 220)' }}>
              For appointments and inquiries, please visit one of our clinic locations.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t mb-6 sm:mb-8"
          style={{ borderColor: 'oklch(0.28 0.025 240)' }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm" style={{ color: 'oklch(0.65 0.012 230)' }}>
            © {new Date().getFullYear()} Dr. Malay Akechan. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: 'oklch(0.65 0.012 230)' }}>
            Built with{' '}
            <Heart
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0"
              style={{ color: 'oklch(0.65 0.22 25)' }}
            />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors duration-200"
              style={{ color: 'oklch(0.72 0.18 195)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.82 0.18 195)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.72 0.18 195)')}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
