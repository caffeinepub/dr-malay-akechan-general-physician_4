import React, { useEffect, useRef, useState } from 'react';
import { EditableField } from '../components/EditableField';
import ParticleCanvas, { ParticleSettings } from '../components/ParticleCanvas';
import { useGetAllContent, useGetHeroSettings } from '../hooks/useQueries';

interface Props {
  onUpdateSiteTitle?: (title: string) => Promise<void>;
}

export default function Home({ onUpdateSiteTitle }: Props) {
  const { data: content } = useGetAllContent();
  const { data: heroSettings } = useGetHeroSettings();
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const siteTitle = content?.siteTitle || 'Dr. Malay';
  const tagline = 'Compassionate Care · Advanced Medicine · Trusted Expertise';

  // Mouse parallax
  useEffect(() => {
    if (!heroSettings?.mouseParallaxEnabled) return;
    const handleMouseMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setParallaxOffset({ x: dx * 20, y: dy * 20 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [heroSettings?.mouseParallaxEnabled]);

  // Background style
  const bgStyle: React.CSSProperties = heroSettings
    ? {
        background: `linear-gradient(135deg, ${heroSettings.bgGradientStart} 0%, ${heroSettings.bgGradientEnd} 100%)`,
      }
    : {
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 100%)',
      };

  // Overlay style
  const overlayStyle: React.CSSProperties = heroSettings
    ? {
        position: 'absolute',
        inset: 0,
        background: `rgba(0,0,0,${heroSettings.overlayOpacity * 0.4})`,
        backdropFilter: heroSettings.backgroundBlur ? 'blur(1px)' : 'none',
        zIndex: 2,
        pointerEvents: 'none',
      }
    : {};

  // Glass layer
  const glassStyle: React.CSSProperties = heroSettings
    ? {
        position: 'absolute',
        inset: 0,
        background: `rgba(255,255,255,${heroSettings.glassmorphismIntensity * 0.03})`,
        zIndex: 2,
        pointerEvents: 'none',
      }
    : {};

  // Text color
  const textColor = heroSettings?.textColor || '#ffffff';

  // Animation speed
  const animSpeed = heroSettings?.animationSpeed ?? 1.0;

  // Particle settings
  const particleSettings: ParticleSettings | null = heroSettings
    ? {
        particlePreset: heroSettings.particlePreset,
        particleCount: Number(heroSettings.particleCount),
        particleMinSize: heroSettings.particleMinSize,
        particleMaxSize: heroSettings.particleMaxSize,
        particleSpeed: heroSettings.particleSpeed,
        particleColor: heroSettings.particleColor,
        particleOpacity: heroSettings.particleOpacity,
      }
    : null;

  const parallaxStyle: React.CSSProperties = heroSettings?.mouseParallaxEnabled
    ? {
        transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
        transition: 'transform 0.1s ease-out',
      }
    : {};

  const accentColor = heroSettings?.particleColor || '#38F9D7';

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={bgStyle}
    >
      {/* Overlay */}
      {heroSettings && <div style={overlayStyle} />}
      {heroSettings && <div style={glassStyle} />}

      {/* Particle Canvas */}
      {particleSettings && particleSettings.particlePreset !== 'None' && (
        <ParticleCanvas settings={particleSettings} />
      )}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,249,215,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,249,215,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 3,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={parallaxStyle}
      >
        {/* Accent line */}
        <div
          className="w-16 h-0.5 mx-auto mb-6 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            animationDuration: `${2 / animSpeed}s`,
          }}
        />

        {/* Title */}
        <h1
          className="text-5xl md:text-7xl font-bold font-heading mb-4 leading-tight"
          style={{ color: textColor }}
        >
          {onUpdateSiteTitle ? (
            <EditableField
              currentValue={siteTitle}
              onSave={onUpdateSiteTitle}
              className="inline"
            />
          ) : (
            siteTitle
          )}
        </h1>

        {/* Tagline */}
        <p
          className="text-lg md:text-xl font-light tracking-wide mb-10 opacity-80"
          style={{ color: textColor }}
        >
          {tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#clinics"
            className="px-8 py-3 rounded-full font-semibold font-heading text-sm tracking-wide transition-all duration-200 hover:scale-105"
            style={{
              background: accentColor,
              color: '#0a0f1e',
            }}
          >
            Book Appointment
          </a>
          <a
            href="#about"
            className="px-8 py-3 rounded-full font-semibold font-heading text-sm tracking-wide border transition-all duration-200 hover:scale-105"
            style={{
              borderColor: accentColor,
              color: accentColor,
            }}
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-40"
        style={{ color: textColor }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-current animate-pulse" />
      </div>
    </section>
  );
}
