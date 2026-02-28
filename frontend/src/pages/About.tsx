import React from 'react';
import { User, Award, Clock } from 'lucide-react';
import { EditableField } from '../components/EditableField';

interface AboutProps {
  aboutSection?: string;
  aboutImageUrl?: string;
  aboutImageBase64?: string;
  onUpdateAbout?: (text: string) => void;
}

export default function About({
  aboutSection = '',
  aboutImageUrl = '',
  aboutImageBase64 = '',
  onUpdateAbout,
}: AboutProps) {
  const imageSrc = aboutImageBase64
    ? `data:image/jpeg;base64,${aboutImageBase64}`
    : aboutImageUrl || null;

  if (!aboutSection && !imageSrc) return null;

  return (
    <section id="about" className="py-24 bg-navy-800 relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-cyan-500/60" />
          <span className="text-cyan-400 text-xs font-body font-medium uppercase tracking-widest">About</span>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          {imageSrc && (
            <div className="relative">
              <div className="relative rounded-card overflow-hidden border border-cyan-500/30 glow-cyan-sm">
                <img
                  src={imageSrc}
                  alt="Doctor profile"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-800/60 to-transparent" />
              </div>
              {/* Decorative corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-500/60" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-500/60" />
            </div>
          )}

          {/* Text Column */}
          <div className={`space-y-6 ${!imageSrc ? 'lg:col-span-2 max-w-3xl' : ''}`}>
            <h2 className="font-display font-bold text-4xl text-white leading-tight">
              Meet Your <span className="gradient-text-cyan">Doctor</span>
            </h2>

            {/* Accent bar + bio */}
            <div className="flex gap-4">
              <div className="w-0.5 bg-gradient-to-b from-cyan-500 to-cyan-500/10 rounded-full shrink-0" />
              <div className="flex-1">
                <EditableField
                  value={aboutSection}
                  type="textarea"
                  label="About Section"
                  onSave={onUpdateAbout || (() => {})}
                >
                  <p className="text-slate-300 font-body leading-relaxed text-base whitespace-pre-wrap">
                    {aboutSection}
                  </p>
                </EditableField>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: <Award className="w-4 h-4" />, label: 'Certified', value: 'Expert' },
                { icon: <Clock className="w-4 h-4" />, label: 'Experience', value: 'Years' },
                { icon: <User className="w-4 h-4" />, label: 'Patients', value: 'Served' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-navy-700 border border-slate-700/50 rounded-sharp p-3 text-center"
                >
                  <div className="flex justify-center text-cyan-400 mb-1">{stat.icon}</div>
                  <div className="text-white font-display font-semibold text-sm">{stat.value}</div>
                  <div className="text-slate-500 text-xs font-body">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
