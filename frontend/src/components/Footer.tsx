import React from 'react';
import { MapPin, Phone, Mail, Heart, ExternalLink } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiLinkedin, SiYoutube } from 'react-icons/si';
import { EditableField } from './EditableField';

interface FooterProps {
  siteTitle?: string;
  footerContent?: string;
  socialLinks?: Array<[bigint, { platform: string; url: string }]>;
  onUpdateFooter?: (text: string) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <SiFacebook className="w-4 h-4" />,
  instagram: <SiInstagram className="w-4 h-4" />,
  twitter: <SiX className="w-4 h-4" />,
  x: <SiX className="w-4 h-4" />,
  linkedin: <SiLinkedin className="w-4 h-4" />,
  youtube: <SiYoutube className="w-4 h-4" />,
};

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Clinics', href: '#clinics' },
  { label: 'Connect', href: '#social' },
];

export default function Footer({
  siteTitle = 'MedClinic',
  footerContent = '',
  socialLinks = [],
  onUpdateFooter,
}: FooterProps) {
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'medical-clinic');

  return (
    <footer className="bg-navy-800 border-t border-cyan-500/15 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 200 / 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sharp bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                <span className="text-cyan-400 font-display font-bold text-sm">M</span>
              </div>
              <span className="font-display font-bold text-xl text-white">{siteTitle}</span>
            </div>
            <div className="text-slate-400 text-sm font-body leading-relaxed">
              {footerContent ? (
                <EditableField
                  value={footerContent}
                  type="textarea"
                  label="Footer Content"
                  onSave={onUpdateFooter || (() => {})}
                >
                  <span>{footerContent}</span>
                </EditableField>
              ) : (
                <span className="text-slate-500 italic">Professional medical care you can trust.</span>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                {socialLinks.map(([id, link]) => {
                  const platformKey = link.platform.toLowerCase();
                  const icon = platformIcons[platformKey];
                  return (
                    <a
                      key={id.toString()}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-sharp border border-slate-600 hover:border-cyan-500/60 bg-navy-700 hover:bg-cyan-500/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all duration-200"
                      aria-label={link.platform}
                    >
                      {icon || <ExternalLink className="w-3 h-3" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-widest">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-sm text-slate-400 hover:text-cyan-400 font-body transition-colors duration-200 flex items-center gap-2 group w-fit"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 transition-colors duration-200" />
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact / Info */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-widest">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-500/60 mt-0.5 shrink-0" />
                <span className="font-body">Visit one of our clinic locations</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-cyan-500/60 mt-0.5 shrink-0" />
                <span className="font-body">Contact us via clinic phone</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-cyan-500/60 mt-0.5 shrink-0" />
                <span className="font-body">Reach out through social media</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-body">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs font-body flex items-center gap-1">
            Built with{' '}
            <Heart className="w-3 h-3 text-cyan-500 fill-cyan-500 mx-0.5" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors ml-0.5"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
