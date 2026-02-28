import React from 'react';
import { useGetAllContent } from '../hooks/useQueries';
import { Globe } from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';

const PLATFORM_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  facebook: { icon: <SiFacebook className="w-6 h-6" />, color: '#1877F2', bg: 'rgba(24,119,242,0.1)' },
  twitter: { icon: <SiX className="w-6 h-6" />, color: '#000000', bg: 'rgba(0,0,0,0.1)' },
  x: { icon: <SiX className="w-6 h-6" />, color: '#000000', bg: 'rgba(0,0,0,0.1)' },
  instagram: { icon: <SiInstagram className="w-6 h-6" />, color: '#E4405F', bg: 'rgba(228,64,95,0.1)' },
  linkedin: { icon: <SiLinkedin className="w-6 h-6" />, color: '#0A66C2', bg: 'rgba(10,102,194,0.1)' },
  youtube: { icon: <SiYoutube className="w-6 h-6" />, color: '#FF0000', bg: 'rgba(255,0,0,0.1)' },
};

export default function SocialMedia() {
  const { data: content } = useGetAllContent();
  const socialLinks = content?.socialLinks || [];

  return (
    <section id="social" className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold font-heading uppercase tracking-widest text-primary mb-2">Social</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
            Follow & Connect
          </h2>
          <div className="w-16 h-0.5 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Stay connected for health tips, updates, and medical insights.
          </p>
        </div>

        {socialLinks.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No social links added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {socialLinks.map(([id, link]) => {
              const key = link.platform.toLowerCase();
              const config = PLATFORM_CONFIG[key];
              return (
                <a
                  key={id.toString()}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-200 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: config?.bg || 'rgba(128,128,128,0.1)',
                      color: config?.color || '#888',
                    }}
                  >
                    {config?.icon || <Globe className="w-6 h-6" />}
                  </div>
                  <span className="text-sm font-semibold font-heading text-foreground capitalize">
                    {link.platform}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
