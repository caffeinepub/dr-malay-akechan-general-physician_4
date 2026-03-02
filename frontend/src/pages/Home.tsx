import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import ParticleCanvas from '../components/ParticleCanvas';
import type { ParticleSettings } from '../components/ParticleCanvas';

const DEFAULT_PARTICLE_SETTINGS: ParticleSettings = {
  particleCount: 70,
  particleSpeed: 1.5,
  particleSize: 2.5,
  particleColor: '#90EE90',
  showConnectionLines: true,
  mouseInteraction: true,
  backgroundEffect: 'gradient',
  glassmorphismEnabled: true,
  heroGradientStart: '#40A1FF',
  heroGradientEnd: '#A993FF',
};

export default function Home() {
  const { actor, isFetching } = useActor();

  const { data: content } = useQuery({
    queryKey: ['allContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAllContent();
    },
    enabled: !!actor && !isFetching,
  });

  const siteTitle = content?.siteTitle ?? '';
  const heroBackgroundBase64 = content?.images?.heroBackgroundBase64 ?? '';
  const heroBackgroundUrl = content?.images?.heroBackgroundUrl ?? '';
  const heroSettingsRaw = content?.heroSettings;
  const glowEffect = heroSettingsRaw?.heroGlowEffect;

  // Convert HeroSettings (bigint fields) to ParticleSettings (number fields)
  const particleSettings: ParticleSettings = heroSettingsRaw
    ? {
        particleCount: Number(heroSettingsRaw.particleCount),
        particleSpeed: heroSettingsRaw.particleSpeed,
        particleSize: heroSettingsRaw.particleSize,
        particleColor: heroSettingsRaw.particleColor,
        showConnectionLines: heroSettingsRaw.showConnectionLines,
        mouseInteraction: heroSettingsRaw.mouseInteraction,
        backgroundEffect: heroSettingsRaw.backgroundEffect,
        glassmorphismEnabled: heroSettingsRaw.glassmorphismEnabled,
        heroGradientStart: heroSettingsRaw.heroGradientStart,
        heroGradientEnd: heroSettingsRaw.heroGradientEnd,
      }
    : DEFAULT_PARTICLE_SETTINGS;

  const heroBgStyle: React.CSSProperties = {};
  if (heroBackgroundBase64) {
    heroBgStyle.backgroundImage = `url(data:image/jpeg;base64,${heroBackgroundBase64})`;
    heroBgStyle.backgroundSize = 'cover';
    heroBgStyle.backgroundPosition = 'center';
  } else if (heroBackgroundUrl) {
    heroBgStyle.backgroundImage = `url(${heroBackgroundUrl})`;
    heroBgStyle.backgroundSize = 'cover';
    heroBgStyle.backgroundPosition = 'center';
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg-light"
      style={heroBgStyle}
    >
      {/* Particle canvas background */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas settings={particleSettings} />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-black/50" />

      {/* Glow orb */}
      {glowEffect?.enabled && (
        <div
          className="absolute z-[2] rounded-full blur-[80px] sm:blur-[120px] opacity-25 pointer-events-none"
          style={{
            width: 'min(600px, 90vw)',
            height: 'min(600px, 90vw)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: glowEffect.color,
          }}
        />
      )}

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 max-w-4xl mx-auto w-full">
        {/* Eyebrow label */}
        <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/80">
            Medical Professional
          </span>
        </div>

        {/* Main title */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 text-white drop-shadow-lg leading-tight">
          {siteTitle || 'Dr. Malay Parekh'}
        </h1>

        {/* Decorative accent line */}
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-cyan-400" />
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>

        {/* Tagline / subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed mb-8 sm:mb-10 font-light px-2">
          Dedicated to providing compassionate, evidence-based medical care with a focus on patient well-being and long-term health outcomes.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
          <a
            href="#clinics"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-base text-white transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 hover:scale-105 text-center min-h-[44px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, oklch(0.65 0.18 200), oklch(0.55 0.22 260))',
            }}
          >
            Book an Appointment
          </a>
          <a
            href="#about"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-base border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 text-center min-h-[44px] flex items-center justify-center"
          >
            Learn More
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-lg">
          {[
            { value: '15+', label: 'Years Experience' },
            { value: '10k+', label: 'Patients Treated' },
            { value: '3', label: 'Clinic Locations' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-heading">{stat.value}</span>
              <span className="text-[10px] sm:text-xs text-white/60 mt-1 tracking-wide uppercase text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
