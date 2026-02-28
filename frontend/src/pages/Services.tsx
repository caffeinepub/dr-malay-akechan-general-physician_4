import React from 'react';
import { Stethoscope } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { EditableField } from '../components/EditableField';

interface Service {
  title: string;
  description: string;
  iconUrl: string;
  iconBase64: string;
}

interface ServicesProps {
  services?: Array<[bigint, Service]>;
  onUpdateTitle?: (id: bigint, title: string) => void;
  onUpdateDescription?: (id: bigint, desc: string) => void;
}

export default function Services({
  services = [],
  onUpdateTitle,
  onUpdateDescription,
}: ServicesProps) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 bg-navy-900 relative overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-cyan-500/60" />
          <span className="text-cyan-400 text-xs font-body font-medium uppercase tracking-widest">Services</span>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>

        <div className="mb-12">
          <h2 className="font-display font-bold text-4xl text-white leading-tight">
            Our <span className="gradient-text-cyan">Medical Services</span>
          </h2>
          <p className="text-slate-400 font-body mt-3 max-w-xl">
            Comprehensive healthcare solutions tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(([id, service]) => {
            const iconSrc = service.iconBase64
              ? `data:image/jpeg;base64,${service.iconBase64}`
              : service.iconUrl || null;

            return (
              <GlassCard key={id.toString()} accent="cyan" className="p-6 flex flex-col gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-sharp bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center glow-cyan-sm">
                  {iconSrc ? (
                    <img src={iconSrc} alt={service.title} className="w-7 h-7 object-contain" />
                  ) : (
                    <Stethoscope className="w-6 h-6 text-cyan-400" />
                  )}
                </div>

                {/* Title */}
                <EditableField
                  value={service.title}
                  type="text"
                  label="Service Title"
                  onSave={(val) => onUpdateTitle?.(id, val)}
                >
                  <h3 className="font-display font-semibold text-white text-lg leading-tight">
                    {service.title}
                  </h3>
                </EditableField>

                {/* Description */}
                <EditableField
                  value={service.description}
                  type="textarea"
                  label="Service Description"
                  onSave={(val) => onUpdateDescription?.(id, val)}
                >
                  <p className="text-slate-400 text-sm font-body leading-relaxed flex-1">
                    {service.description}
                  </p>
                </EditableField>

                {/* Bottom accent line */}
                <div className="h-px bg-gradient-to-r from-cyan-500/40 to-transparent mt-auto" />
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
