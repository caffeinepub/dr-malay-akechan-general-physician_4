import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { UserCircle } from 'lucide-react';
import type { AboutImage } from '../backend';

function getImageSrc(aboutImage: AboutImage | undefined): string | null {
  if (!aboutImage) return null;
  if (aboutImage.imageType === 'base64' && aboutImage.imageBase64) {
    const base64 = aboutImage.imageBase64;
    if (base64.startsWith('data:')) return base64;
    return `data:image/jpeg;base64,${base64}`;
  }
  if (aboutImage.imageType === 'url' && aboutImage.imageUrl) {
    return aboutImage.imageUrl;
  }
  // Fallback: try either field
  if (aboutImage.imageBase64) {
    const base64 = aboutImage.imageBase64;
    if (base64.startsWith('data:')) return base64;
    return `data:image/jpeg;base64,${base64}`;
  }
  if (aboutImage.imageUrl) return aboutImage.imageUrl;
  return null;
}

export default function About() {
  const { actor, isFetching } = useActor();

  const { data: content } = useQuery({
    queryKey: ['allContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAllContent();
    },
    enabled: !!actor && !isFetching,
  });

  const aboutText = content?.aboutSection ?? '';
  const aboutImage = content?.aboutImage;
  const imageSrc = getImageSrc(aboutImage);

  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-16">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/50" />
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight text-center">
            About the Doctor
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Profile image */}
          <div className="flex justify-center">
            <div className="relative">
              {imageSrc ? (
                <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
                  <img
                    src={imageSrc}
                    alt="Doctor profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl border-2 border-dashed border-cyan-500/30 flex flex-col items-center justify-center bg-card/50">
                  <UserCircle className="w-16 h-16 sm:w-24 sm:h-24 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground mt-3">No photo uploaded</p>
                </div>
              )}
              {/* Decorative corner accents */}
              <div className="absolute -bottom-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-r-2 border-cyan-500/40 rounded-br-xl pointer-events-none" />
              <div className="absolute -top-3 -left-3 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl pointer-events-none" />
            </div>
          </div>

          {/* Bio text */}
          <div className="space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-medium text-cyan-400 tracking-widest uppercase">Biography</span>
            </div>

            {aboutText ? (
              <div className="text-foreground/85 leading-[1.85] text-base space-y-4">
                {aboutText.split('\n').filter(p => p.trim()).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded bg-muted/50 animate-pulse"
                    style={{ width: `${85 - i * 10}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
