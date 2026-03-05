import { ExternalLink } from "lucide-react";
import type React from "react";
import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiLinkedin,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import HoverEditWrapper from "../components/HoverEditWrapper";
import { useGetAllContent } from "../hooks/useQueries";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  twitter: <SiX />,
  x: <SiX />,
  facebook: <SiFacebook />,
  instagram: <SiInstagram />,
  linkedin: <SiLinkedin />,
  youtube: <SiYoutube />,
  github: <SiGithub />,
  tiktok: <SiTiktok />,
  whatsapp: <SiWhatsapp />,
};

function getPlatformIcon(platform: string) {
  return (
    PLATFORM_ICONS[platform.toLowerCase()] ?? (
      <ExternalLink className="w-5 h-5" />
    )
  );
}

export default function SocialMedia() {
  const { data: content } = useGetAllContent();
  const socialLinks = content?.socialLinks ?? [];

  if (socialLinks.length === 0) return null;

  return (
    <section
      id="social"
      className="py-12 sm:py-16 relative"
      style={{ background: "oklch(0.10 0.018 240)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.18 195 / 0.30), transparent)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="h-px w-10"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.72 0.18 195))",
              }}
            />
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "oklch(0.72 0.18 195)" }}
            >
              Follow Us
            </span>
            <div
              className="h-px w-10"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.72 0.18 195), transparent)",
              }}
            />
          </div>
          <h2
            className="font-heading font-bold text-xl sm:text-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.80 0.18 195), oklch(0.70 0.22 270))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Connect With Us
          </h2>
        </div>

        {/* Social links */}
        <HoverEditWrapper
          onEdit={() => {
            window.location.href = "/admin";
          }}
          label="Social Links"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {socialLinks.map(([id, link]) => (
              <a
                key={id.toString()}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 min-h-[44px] hover:scale-105"
                style={{
                  background: "oklch(0.14 0.022 240)",
                  color: "oklch(0.88 0.010 220)",
                  border: "1px solid oklch(0.28 0.025 240)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "oklch(0.72 0.18 195 / 0.12)";
                  el.style.borderColor = "oklch(0.72 0.18 195 / 0.45)";
                  el.style.color = "oklch(0.82 0.18 195)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "oklch(0.14 0.022 240)";
                  el.style.borderColor = "oklch(0.28 0.025 240)";
                  el.style.color = "oklch(0.88 0.010 220)";
                }}
              >
                <span
                  className="text-base sm:text-lg shrink-0 transition-colors duration-200"
                  style={{ color: "oklch(0.72 0.18 195)" }}
                >
                  {getPlatformIcon(link.platform)}
                </span>
                <span className="capitalize">{link.platform}</span>
              </a>
            ))}
          </div>
        </HoverEditWrapper>
      </div>
    </section>
  );
}
