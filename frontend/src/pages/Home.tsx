import React from 'react';
import { ChevronDown, Calendar, Info } from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';
import { EditableField } from '../components/EditableField';
import type { HeroSettings } from '../backend';
import type { ParticleSettings } from '../components/ParticleCanvas';

interface HomeProps {
  siteTitle?: string;
  heroSettings?: HeroSettings;
  heroBackgroundUrl?: string;
  heroBackgroundBase64?: string;
  onUpdateTitle?: (title: string) => void;
}

export default function Home({
  siteTitle = 'Medical Excellence',
  heroSettings,
  heroBackgroundUrl,
  heroBackgroundBase64,
  onUpdateTitle,
}: HomeProps) {
  const heroImageSrc = heroBackgroundBase64
    ? `data:image/jpeg;base64,${heroBackgroundBase64}`
    : heroBackgroundUrl || '/assets/generated/hero-bg-hightech.dim_1920x1080.png';

  // Convert HeroSettings (bigint) to ParticleSettings (number)
  const particleSettings: ParticleSettings = {
    particleCount: heroSettings ? Number(heroSettings.particleCount) : 70,
    particleSpeed: heroSettings?.particleSpeed ?? 1.5,
    particleSize: heroSettings?.particleSize ?? 2.5,
    particleColor: heroSettings?.particleColor ?? '#00d9ff',
    showConnectionLines: heroSettings?.showConnectionLines ?? true,
    mouseInteraction: heroSettings?.mouseInteraction ?? true,
    backgroundEffect: (heroSettings?.backgroundEffect ?? 'gradient') as ParticleSettings['backgroundEffect'],
    glassmorphismEnabled: heroSettings?.glassmorphismEnabled ?? false,
    heroGradientStart: heroSettings?.heroGradientStart ?? '#0a0e27',
    heroGradientEnd: heroSettings?.heroGradientEnd ?? '#0f1729',
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-800"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageSrc})` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy-800/75" />

      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.75 0.18 200 / 0.06) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 200 / 0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Particle Canvas */}
      <div className="absolute inset-0">
        <ParticleCanvas settings={particleSettings} />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-body font-medium mb-6 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
          Advanced Medical Care
        </div>

        {/* Title */}
        <EditableField
          value={siteTitle}
          type="text"
          label="Site Title"
          onSave={onUpdateTitle || (() => {})}
        >
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white mb-4 leading-tight tracking-tight">
            <span className="gradient-text-cyan text-glow-cyan">{siteTitle}</span>
          </h1>
        </EditableField>

        {/* Subtitle */}
        <p className="text-slate-300 text-lg sm:text-xl font-body font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Precision healthcare powered by cutting-edge technology and compassionate expertise.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('clinics')}
            className="flex items-center gap-2 px-8 py-3.5 rounded-sharp bg-cyan-500 hover:bg-cyan-400 text-navy-800 font-display font-semibold text-sm transition-all duration-200 glow-cyan-sm hover:glow-cyan"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="flex items-center gap-2 px-8 py-3.5 rounded-sharp border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-display font-semibold text-sm transition-all duration-200 hover:bg-cyan-500/10 backdrop-blur-sm"
          >
            <Info className="w-4 h-4" />
            Learn More
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 animate-float"
        aria-label="Scroll down"
      >
        <span className="text-xs font-body uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    </section>
  );
}
