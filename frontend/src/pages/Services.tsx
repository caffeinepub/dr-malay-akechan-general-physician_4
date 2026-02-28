import React from 'react';
import { EditableField } from '../components/EditableField';
import { useGetAllContent } from '../hooks/useQueries';
import { Stethoscope } from 'lucide-react';

interface Props {
  onUpdateServiceTitle?: (id: bigint, title: string) => Promise<void>;
  onUpdateServiceDescription?: (id: bigint, description: string) => Promise<void>;
}

export default function Services({ onUpdateServiceTitle, onUpdateServiceDescription }: Props) {
  const { data: content } = useGetAllContent();
  const services = content?.services || [];

  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold font-heading uppercase tracking-widest text-primary mb-2">Services</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
            What I Offer
          </h2>
          <div className="w-16 h-0.5 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {services.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No services listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(([id, service]) => {
              const iconSrc = service.iconBase64
                ? `data:image/jpeg;base64,${service.iconBase64}`
                : service.iconUrl || null;

              return (
                <div
                  key={id.toString()}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-200"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {iconSrc ? (
                      <img src={iconSrc} alt={service.title} className="w-8 h-8 object-contain" />
                    ) : (
                      <Stethoscope className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                    {onUpdateServiceTitle ? (
                      <EditableField
                        currentValue={service.title}
                        onSave={(val) => onUpdateServiceTitle(id, val)}
                        placeholder="Service title"
                      />
                    ) : (
                      service.title
                    )}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {onUpdateServiceDescription ? (
                      <EditableField
                        currentValue={service.description}
                        onSave={(val) => onUpdateServiceDescription(id, val)}
                        placeholder="Service description"
                        multiline
                      />
                    ) : (
                      service.description
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
