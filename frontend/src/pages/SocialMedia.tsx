import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiLinkedin, SiYoutube, SiTiktok, SiWhatsapp } from 'react-icons/si';
import GlassCard from '../components/GlassCard';
import { EditableField } from '../components/EditableField';

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialMediaProps {
  socialLinks?: Array<[bigint, SocialLink]>;
  onUpdatePlatform?: (id: bigint, platform: string) => void;
  onUpdateUrl?: (id: bigint, url: string) => void;
}

const platformConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  facebook: {
    icon: <SiFacebook className="w-6 h-6" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  instagram: {
    icon: <SiInstagram className="w-6 h-6" />,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
  },
  twitter: {
    icon: <SiX className="w-6 h-6" />,
    color: 'text-slate-300',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
  },
  x: {
    icon: <SiX className="w-6 h-6" />,
    color: 'text-slate-300',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
  },
  linkedin: {
    icon: <SiLinkedin className="w-6 h-6" />,
    color: 'text-blue-300',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
  },
  youtube: {
    icon: <SiYoutube className="w-6 h-6" />,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  tiktok: {
    icon: <SiTiktok className="w-6 h-6" />,
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  whatsapp: {
    icon: <SiWhatsapp className="w-6 h-6" />,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
};

export default function SocialMedia({
  socialLinks = [],
  onUpdatePlatform,
  onUpdateUrl,
}: SocialMediaProps) {
  if (socialLinks.length === 0) return null;

  return (
    <section id="social" className="py-24 bg-navy-900 relative overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-cyan-500/60" />
          <span className="text-cyan-400 text-xs font-body font-medium uppercase tracking-widest">Connect</span>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>

        <div className="mb-12">
          <h2 className="font-display font-bold text-4xl text-white leading-tight">
            Follow <span className="gradient-text-cyan">Our Journey</span>
          </h2>
          <p className="text-slate-400 font-body mt-3 max-w-xl">
            Stay connected and up to date with our latest news and updates.
          </p>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialLinks.map(([id, link]) => {
            const platformKey = link.platform.toLowerCase();
            const config = platformConfig[platformKey] || {
              icon: <ExternalLink className="w-6 h-6" />,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10',
              border: 'border-cyan-500/30',
            };

            return (
              <GlassCard key={id.toString()} accent="cyan" className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-sharp border flex items-center justify-center shrink-0 ${config.bg} ${config.border}`}>
                    <span className={config.color}>{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <EditableField
                      value={link.platform}
                      type="text"
                      label="Platform"
                      onSave={(val) => onUpdatePlatform?.(id, val)}
                    >
                      <p className="font-display font-semibold text-white text-sm capitalize">
                        {link.platform}
                      </p>
                    </EditableField>
                    <EditableField
                      value={link.url}
                      type="text"
                      label="URL"
                      onSave={(val) => onUpdateUrl?.(id, val)}
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-400 text-xs font-body truncate block transition-colors duration-200"
                      >
                        {link.url}
                      </a>
                    </EditableField>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-sharp border border-slate-600 hover:border-cyan-500/50 bg-navy-700 hover:bg-cyan-500/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all duration-200 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
