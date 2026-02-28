import React from 'react';
import { EditableField } from '../components/EditableField';
import { useGetAllContent } from '../hooks/useQueries';
import { Award, BookOpen, Stethoscope, GraduationCap } from 'lucide-react';

interface Props {
  onUpdateAbout?: (text: string, imageUrl: string) => Promise<void>;
}

const CREDENTIALS = [
  { icon: <GraduationCap className="w-5 h-5" />, label: 'Education', value: 'MBBS, MD — Top Medical University' },
  { icon: <Award className="w-5 h-5" />, label: 'Experience', value: '15+ Years Clinical Practice' },
  { icon: <Stethoscope className="w-5 h-5" />, label: 'Specialty', value: 'Internal Medicine & Cardiology' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Research', value: '30+ Published Papers' },
];

export default function About({ onUpdateAbout }: Props) {
  const { data: content } = useGetAllContent();

  const aboutText = content?.aboutSection || 'Dedicated physician with over 15 years of experience providing compassionate, evidence-based care to patients across all walks of life.';
  const aboutImageUrl = content?.aboutImageUrl || '';
  const aboutImageBase64 = content?.aboutImageBase64 || '';

  const displayImage = aboutImageBase64
    ? `data:image/jpeg;base64,${aboutImageBase64}`
    : aboutImageUrl || null;

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold font-heading uppercase tracking-widest text-primary mb-2">About</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
            About Me
          </h2>
          <div className="w-16 h-0.5 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative rounded-2xl overflow-hidden w-64 h-80 sm:w-80 sm:h-96 shadow-2xl border border-border">
              {displayImage ? (
                <img src={displayImage} alt="Doctor" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <GraduationCap className="w-20 h-20 text-primary/30" />
                </div>
              )}
            </div>
            {/* Accent decoration */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-primary/5 border border-primary/10 -z-10" />
          </div>

          {/* Content */}
          <div>
            <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent rounded-full mb-6" />
            <div className="text-foreground/80 leading-relaxed text-base mb-8">
              {onUpdateAbout ? (
                <EditableField
                  currentValue={aboutText}
                  onSave={(text) => onUpdateAbout(text, aboutImageUrl)}
                  placeholder="Write your bio here..."
                  multiline
                />
              ) : (
                <p>{aboutText}</p>
              )}
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CREDENTIALS.map((cred) => (
                <div
                  key={cred.label}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
                >
                  <div className="text-primary mt-0.5 shrink-0">{cred.icon}</div>
                  <div>
                    <p className="text-xs font-semibold font-heading uppercase tracking-wider text-muted-foreground">{cred.label}</p>
                    <p className="text-sm text-foreground mt-0.5">{cred.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
