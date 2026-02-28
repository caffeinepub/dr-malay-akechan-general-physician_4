import React from 'react';
import ClinicCard from '../components/ClinicCard';

interface Clinic {
  name: string;
  address: string;
  phone: string;
  description: string;
  mapUrl: string;
  bookingUrl: string;
}

interface ClinicsProps {
  clinics?: Array<[bigint, Clinic]>;
  onUpdateName?: (id: bigint, name: string) => void;
  onUpdateDescription?: (id: bigint, desc: string) => void;
}

const accentCycle: Array<'cyan' | 'magenta' | 'emerald' | 'amber'> = ['cyan', 'magenta', 'emerald', 'amber'];

export default function Clinics({
  clinics = [],
  onUpdateName,
  onUpdateDescription,
}: ClinicsProps) {
  if (clinics.length === 0) return null;

  return (
    <section id="clinics" className="py-24 bg-navy-800 relative overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-cyan-500/60" />
          <span className="text-cyan-400 text-xs font-body font-medium uppercase tracking-widest">Locations</span>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>

        <div className="mb-12">
          <h2 className="font-display font-bold text-4xl text-white leading-tight">
            Our <span className="gradient-text-cyan">Clinic Locations</span>
          </h2>
          <p className="text-slate-400 font-body mt-3 max-w-xl">
            Find a clinic near you and book your appointment today.
          </p>
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clinics.map(([id, clinic], index) => (
            <ClinicCard
              key={id.toString()}
              id={id}
              clinic={clinic}
              accent={accentCycle[index % accentCycle.length]}
              onUpdateName={onUpdateName}
              onUpdateDescription={onUpdateDescription}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
