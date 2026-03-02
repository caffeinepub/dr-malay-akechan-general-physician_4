import React from 'react';
import { useGetAllContent } from '../hooks/useQueries';
import { ExternalLink } from 'lucide-react';
import {
  SiX, SiFacebook, SiInstagram, SiLinkedin,
  SiYoutube, SiGithub, SiTiktok, SiWhatsapp,
} from 'react-icons/si';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  twitter:   <SiX />,
  x:         <SiX />,
  facebook:  <SiFacebook />,
  instagram: <SiInstagram />,
  linkedin:  <SiLinkedin />,
  youtube:   <SiYoutube />,
  github:    <SiGithub />,
  tiktok:    <SiTiktok />,
  whatsapp:  <SiWhatsapp />,
};

function getPlatformIcon(platform: string) {
  return PLATFORM_ICONS[platform.toLowerCase()] ?? <ExternalLink className="w-5 h-5" />;
}

export default function SocialMedia() {
  const { data: content } = useGetAllContent();
  const socialLinks = content?.socialLinks ?? [];

  if (socialLinks.length === 0) return null;

  return (
    <section
      className="py-12 sm:py-16 relative"
      style={{ background: 'oklch(0.10 0.018 240)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.18 195 / 0.30), transparent)' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2
            className="font-heading font-bold text-xl sm:text-2xl mb-2"
            style={{ color: 'oklch(0.96 0.012 220)' }}
          >
            Connect With Us
          </h2>
          <p
            className="text-sm sm:text-base"
            style={{ color: 'oklch(0.75 0.012 220)' }}
          >
            Follow us on social media for health tips and updates.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {socialLinks.map(([id, link]) => (
            <a
              key={id.toString()}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-3 rounded-xl font-medium text-sm border transition-all duration-200 min-h-[44px]"
              style={{
                background: 'oklch(0.14 0.022 240)',
                color: 'oklch(0.88 0.010 220)',
                borderColor: 'oklch(0.28 0.025 240)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'oklch(0.72 0.18 195 / 0.12)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'oklch(0.72 0.18 195 / 0.45)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'oklch(0.82 0.18 195)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'oklch(0.14 0.022 240)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'oklch(0.28 0.025 240)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'oklch(0.88 0.010 220)';
              }}
            >
              <span className="text-base sm:text-lg shrink-0" style={{ color: 'oklch(0.72 0.18 195)' }}>
                {getPlatformIcon(link.platform)}
              </span>
              <span>{link.platform}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
