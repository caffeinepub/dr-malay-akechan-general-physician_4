import React from 'react';
import { MapPin, Phone, ExternalLink, Calendar } from 'lucide-react';
import { EditableField } from './EditableField';

interface ClinicCardProps {
  id: bigint;
  name: string;
  description: string;
  address: string;
  phone: string;
  mapUrl: string;
  bookingUrl: string;
  onUpdateName?: (id: bigint, value: string) => Promise<void>;
  onUpdateDescription?: (id: bigint, value: string) => Promise<void>;
}

export default function ClinicCard({
  id,
  name,
  description,
  address,
  phone,
  mapUrl,
  bookingUrl,
  onUpdateName,
  onUpdateDescription,
}: ClinicCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover transition-shadow duration-200 p-6 flex flex-col gap-4">
      <div>
        <h3 className="font-display font-semibold text-lg text-foreground mb-1">
          {onUpdateName ? (
            <EditableField
              currentValue={name}
              onSave={(val) => onUpdateName(id, val)}
              placeholder="Clinic name"
            />
          ) : (
            name
          )}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {onUpdateDescription ? (
            <EditableField
              currentValue={description}
              onSave={(val) => onUpdateDescription(id, val)}
              placeholder="Clinic description"
              multiline
            />
          ) : (
            description
          )}
        </p>
      </div>

      <div className="space-y-2">
        {address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
            <span>{address}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
            <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
              {phone}
            </a>
          </div>
        )}
      </div>

      {(mapUrl || bookingUrl) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View on Map
            </a>
          )}
          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Appointment
            </a>
          )}
        </div>
      )}
    </div>
  );
}
