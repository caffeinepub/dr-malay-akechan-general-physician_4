import React from 'react';
import ClinicCard from '../components/ClinicCard';
import { useGetAllContent } from '../hooks/useQueries';

export default function Clinics() {
  const { data: content, isLoading } = useGetAllContent();

  if (!isLoading && (!content?.clinics || content.clinics.length === 0)) {
    return null;
  }

  return (
    <section
      id="clinics"
      className="py-16 sm:py-24 relative"
      style={{ background: 'oklch(0.10 0.018 240)' }}
    >
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.18 195 / 0.40), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px w-12"
              style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.18 195))' }}
            />
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: 'oklch(0.72 0.18 195)' }}
            >
              Locations
            </span>
            <div
              className="h-px w-12"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.18 195), transparent)' }}
            />
          </div>
          <h2
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'oklch(0.96 0.012 220)' }}
          >
            Our Clinics
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'oklch(0.78 0.012 220)' }}
          >
            Find a clinic near you and book your appointment today.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="glass-card p-5 sm:p-6 animate-pulse space-y-4"
              >
                <div className="h-6 rounded w-1/2" style={{ background: 'oklch(0.20 0.022 240)' }} />
                <div className="h-4 rounded" style={{ background: 'oklch(0.20 0.022 240)' }} />
                <div className="h-4 rounded w-3/4" style={{ background: 'oklch(0.20 0.022 240)' }} />
                <div className="h-4 rounded w-1/2" style={{ background: 'oklch(0.20 0.022 240)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {content?.clinics.map(([id, clinic]) => (
              <ClinicCard
                key={id.toString()}
                id={id}
                name={clinic.name}
                description={clinic.description}
                address={clinic.address}
                phone={clinic.phone}
                mapUrl={clinic.mapUrl}
                bookingUrl={clinic.bookingUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
