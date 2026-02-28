import React from 'react';
import { MapPin, Phone, ExternalLink, Calendar } from 'lucide-react';
import GlassCard from './GlassCard';
import { EditableField } from './EditableField';
import { cn } from '@/lib/utils';

interface Clinic {
  name: string;
  address: string;
  phone: string;
  description: string;
  mapUrl: string;
  bookingUrl: string;
}

interface ClinicCardProps {
  id: bigint;
  clinic: Clinic;
  accent?: 'cyan' | 'magenta' | 'emerald' | 'amber';
  onUpdateName?: (id: bigint, name: string) => void;
  onUpdateDescription?: (id: bigint, desc: string) => void;
}

const accentColorMap = {
  cyan: {
    icon: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/30',
    btn: 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500',
  },
  magenta: {
    icon: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/30',
    btn: 'border-pink-500/40 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500',
  },
  emerald: {
    icon: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
    btn: 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500',
  },
  amber: {
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    btn: 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500',
  },
};

export default function ClinicCard({
  id,
  clinic,
  accent = 'cyan',
  onUpdateName,
  onUpdateDescription,
}: ClinicCardProps) {
  const colors = accentColorMap[accent];

  return (
    <GlassCard accent={accent} className="p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-sharp border flex items-center justify-center shrink-0', colors.iconBg)}>
          <MapPin className={cn('w-5 h-5', colors.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <EditableField
            value={clinic.name}
            type="text"
            label="Clinic Name"
            onSave={(val) => onUpdateName?.(id, val)}
          >
            <h3 className="font-display font-semibold text-white text-lg leading-tight truncate">
              {clinic.name}
            </h3>
          </EditableField>
        </div>
      </div>

      {/* Description */}
      {clinic.description && (
        <EditableField
          value={clinic.description}
          type="textarea"
          label="Description"
          onSave={(val) => onUpdateDescription?.(id, val)}
        >
          <p className="text-slate-400 text-sm font-body leading-relaxed">
            {clinic.description}
          </p>
        </EditableField>
      )}

      {/* Info */}
      <div className="space-y-2 pt-1">
        {clinic.address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
            <span className="text-slate-400 font-body">{clinic.address}</span>
          </div>
        )}
        {clinic.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <a href={`tel:${clinic.phone}`} className="text-slate-400 font-body hover:text-cyan-400 transition-colors">
              {clinic.phone}
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      {(clinic.mapUrl || clinic.bookingUrl) && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
          {clinic.mapUrl && (
            <a
              href={clinic.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-sharp border text-xs font-medium font-body transition-all duration-200',
                colors.btn
              )}
            >
              <ExternalLink className="w-3 h-3" />
              Open Map
            </a>
          )}
          {clinic.bookingUrl && (
            <a
              href={clinic.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-sharp border text-xs font-medium font-body transition-all duration-200',
                colors.btn
              )}
            >
              <Calendar className="w-3 h-3" />
              Book Now
            </a>
          )}
        </div>
      )}
    </GlassCard>
  );
}
