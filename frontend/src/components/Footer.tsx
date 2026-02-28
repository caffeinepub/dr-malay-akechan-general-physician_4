import React from 'react';
import { useGetAllContent } from '../hooks/useQueries';
import {
  Mail, Phone, MapPin, Heart, ExternalLink,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Globe
} from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Clinics', href: '#clinics' },
  { label: 'Connect', href: '#social' },
];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  facebook: <SiFacebook className="w-4 h-4" />,
  twitter: <SiX className="w-4 h-4" />,
  x: <SiX className="w-4 h-4" />,
  instagram: <SiInstagram className="w-4 h-4" />,
  linkedin: <SiLinkedin className="w-4 h-4" />,
  youtube: <SiYoutube className="w-4 h-4" />,
};

function getPlatformIcon(platform: string) {
  const key = platform.toLowerCase();
  return PLATFORM_ICONS[key] || <Globe className="w-4 h-4" />;
}

export default function Footer() {
  const { data: content } = useGetAllContent();

  const siteTitle = content?.siteTitle || 'Dr. Malay';
  const footerContent = content?.footerContent || 'Dedicated to providing exceptional medical care with compassion and expertise.';
  const socialLinks = content?.socialLinks || [];
  const clinics = content?.clinics || [];
  const primaryClinic = clinics[0]?.[1];

  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'unknown-app'
  );

  return (
    <footer className="bg-footer-bg border-t border-footer-border">
      {/* Top gradient accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white font-bold text-sm font-heading">
                {siteTitle.charAt(0)}
              </div>
              <h3 className="text-lg font-bold font-heading text-footer-heading tracking-wide">
                {siteTitle}
              </h3>
            </div>
            <p className="text-sm text-footer-muted leading-relaxed mb-5">
              {footerContent}
            </p>
            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(([id, link]) => (
                  <a
                    key={id.toString()}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="w-8 h-8 rounded-lg bg-footer-icon-bg border border-footer-border flex items-center justify-center text-footer-muted hover:text-accent hover:border-accent hover:bg-footer-icon-hover transition-all duration-200"
                  >
                    {getPlatformIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2 — Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-widest text-accent mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-footer-muted hover:text-footer-heading transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact / Clinic */}
          <div>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-widest text-accent mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              {primaryClinic?.phone && (
                <li className="flex items-start gap-2.5 text-sm text-footer-muted">
                  <Phone className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                  <span>{primaryClinic.phone}</span>
                </li>
              )}
              {primaryClinic?.address && (
                <li className="flex items-start gap-2.5 text-sm text-footer-muted">
                  <MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                  <span>{primaryClinic.address}</span>
                </li>
              )}
              {!primaryClinic && (
                <li className="text-sm text-footer-muted italic">
                  Contact details coming soon.
                </li>
              )}
            </ul>
          </div>

          {/* Column 4 — Clinics */}
          <div>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-widest text-accent mb-5">
              Our Clinics
            </h4>
            {clinics.length > 0 ? (
              <ul className="space-y-3">
                {clinics.slice(0, 4).map(([id, clinic]) => (
                  <li key={id.toString()}>
                    <p className="text-sm font-medium text-footer-heading">{clinic.name}</p>
                    {clinic.address && (
                      <p className="text-xs text-footer-muted mt-0.5">{clinic.address}</p>
                    )}
                    {clinic.bookingUrl && (
                      <a
                        href={clinic.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1"
                      >
                        Book Appointment <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-footer-muted italic">Clinic info coming soon.</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-footer-border mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-footer-muted">
          <p>
            &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{' '}
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
