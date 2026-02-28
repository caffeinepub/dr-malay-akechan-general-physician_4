import React from 'react';
import { useGetAllContent } from '../hooks/useQueries';
import ClinicCard from '../components/ClinicCard';
import { MapPin } from 'lucide-react';

interface Props {
  onUpdateClinicName?: (id: bigint, name: string) => Promise<void>;
  onUpdateClinicDescription?: (id: bigint, description: string) => Promise<void>;
}

export default function Clinics({ onUpdateClinicName, onUpdateClinicDescription }: Props) {
  const { data: content } = useGetAllContent();
  const clinics = content?.clinics || [];

  return (
    <section id="clinics" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold font-heading uppercase tracking-widest text-primary mb-2">Locations</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
            Our Clinics
          </h2>
          <div className="w-16 h-0.5 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {clinics.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No clinics listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.map(([id, clinic]) => (
              <ClinicCard
                key={id.toString()}
                id={id}
                name={clinic.name}
                description={clinic.description}
                address={clinic.address}
                phone={clinic.phone}
                mapUrl={clinic.mapUrl}
                bookingUrl={clinic.bookingUrl}
                onUpdateName={onUpdateClinicName}
                onUpdateDescription={onUpdateClinicDescription}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
