import React from 'react';
import { MapPin, Phone, ExternalLink, Calendar } from 'lucide-react';

interface ClinicCardProps {
  id: bigint;
  name: string;
  address: string;
  phone: string;
  description: string;
  mapUrl: string;
  bookingUrl: string;
}

export default function ClinicCard({
  name,
  address,
  phone,
  description,
  mapUrl,
  bookingUrl,
}: ClinicCardProps) {
  return (
    <div className="glass-card p-5 sm:p-6 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className="font-heading font-bold text-lg sm:text-xl leading-tight"
          style={{ color: 'oklch(0.95 0.012 220)' }}
        >
          {name}
        </h3>
        <span
          className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border"
          style={{
            color: 'oklch(0.82 0.18 195)',
            borderColor: 'oklch(0.72 0.18 195 / 0.40)',
            background: 'oklch(0.72 0.18 195 / 0.10)',
          }}
        >
          Clinic
        </span>
      </div>

      {/* Description */}
      {description && (
        <p
          className="text-sm sm:text-base leading-relaxed"
          style={{ color: 'oklch(0.82 0.010 220)' }}
        >
          {description}
        </p>
      )}

      {/* Address */}
      {address && (
        <div className="flex items-start gap-2.5">
          <MapPin
            className="w-4 h-4 mt-0.5 shrink-0"
            style={{ color: 'oklch(0.72 0.18 195)' }}
          />
          <span
            className="text-sm leading-relaxed"
            style={{ color: 'oklch(0.80 0.010 220)' }}
          >
            {address}
          </span>
        </div>
      )}

      {/* Phone */}
      {phone && (
        <div className="flex items-center gap-2.5">
          <Phone
            className="w-4 h-4 shrink-0"
            style={{ color: 'oklch(0.72 0.18 195)' }}
          />
          <a
            href={`tel:${phone}`}
            className="text-sm font-medium transition-colors duration-200 min-h-[44px] flex items-center"
            style={{ color: 'oklch(0.80 0.010 220)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.82 0.18 195)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.80 0.010 220)')}
          >
            {phone}
          </a>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 min-h-[44px]"
            style={{
              background: 'linear-gradient(135deg, oklch(0.65 0.185 195), oklch(0.58 0.175 240))',
              color: 'oklch(0.98 0.005 220)',
              boxShadow: '0 4px 16px oklch(0.65 0.185 195 / 0.30)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 24px oklch(0.65 0.185 195 / 0.50)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px oklch(0.65 0.185 195 / 0.30)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </a>
        )}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm border transition-all duration-200 min-h-[44px]"
            style={{
              color: 'oklch(0.82 0.18 195)',
              borderColor: 'oklch(0.72 0.18 195 / 0.35)',
              background: 'oklch(0.72 0.18 195 / 0.08)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'oklch(0.72 0.18 195 / 0.18)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'oklch(0.72 0.18 195 / 0.55)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'oklch(0.72 0.18 195 / 0.08)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'oklch(0.72 0.18 195 / 0.35)';
            }}
          >
            <ExternalLink className="w-4 h-4" />
            View Map
          </a>
        )}
      </div>
    </div>
  );
}
