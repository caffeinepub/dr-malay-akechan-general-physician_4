import React from 'react';
import { useGetAllContent } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

interface ServicesProps {
  onUpdateService?: (id: bigint, data: { title: string; description: string; iconUrl: string; iconBase64: string }) => Promise<void>;
}

export default function Services({ onUpdateService }: ServicesProps) {
  const { data: content, isLoading } = useGetAllContent();
  const services = content?.services ?? [];

  return (
    <section
      id="services"
      className="py-16 sm:py-24 relative"
      style={{ background: 'oklch(0.12 0.020 240)' }}
    >
      {/* Subtle top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.18 195 / 0.40), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
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
              What We Offer
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
            Our Services
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'oklch(0.78 0.012 220)' }}
          >
            Comprehensive medical care tailored to your individual needs.
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-5 sm:p-6 space-y-3">
                <Skeleton className="h-12 w-12 rounded-xl" style={{ background: 'oklch(0.20 0.022 240)' }} />
                <Skeleton className="h-5 w-3/4" style={{ background: 'oklch(0.20 0.022 240)' }} />
                <Skeleton className="h-4 w-full" style={{ background: 'oklch(0.20 0.022 240)' }} />
                <Skeleton className="h-4 w-5/6" style={{ background: 'oklch(0.20 0.022 240)' }} />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: 'oklch(0.65 0.012 230)' }}>
              No services listed yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map(([id, service]) => {
              const iconSrc = service.iconBase64
                ? `data:image/png;base64,${service.iconBase64}`
                : service.iconUrl || null;

              return (
                <div
                  key={id.toString()}
                  className="glass-card p-5 sm:p-6 flex flex-col gap-4 group relative overflow-hidden"
                >
                  {/* Top highlight */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.18 195), transparent)' }}
                  />

                  {/* Icon */}
                  {iconSrc ? (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                      style={{ background: 'oklch(0.72 0.18 195 / 0.12)', border: '1px solid oklch(0.72 0.18 195 / 0.25)' }}
                    >
                      <img src={iconSrc} alt={service.title} className="w-8 h-8 object-contain" />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: 'oklch(0.72 0.18 195 / 0.12)', border: '1px solid oklch(0.72 0.18 195 / 0.25)' }}
                    >
                      ✦
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className="font-heading font-bold text-lg leading-snug"
                    style={{ color: 'oklch(0.95 0.012 220)' }}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  {service.description && (
                    <p
                      className="text-base leading-relaxed flex-1"
                      style={{ color: 'oklch(0.80 0.010 220)' }}
                    >
                      {service.description}
                    </p>
                  )}

                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ background: 'linear-gradient(90deg, oklch(0.72 0.18 195), oklch(0.65 0.185 280))' }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
