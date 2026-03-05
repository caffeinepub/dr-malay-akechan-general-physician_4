import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Share2,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import AboutEditor from "./admin/AboutEditor";
import ClinicsManager from "./admin/ClinicsManager";
import FooterEditor from "./admin/FooterEditor";
import HeaderEditor from "./admin/HeaderEditor";
import HeroSettingsEditor from "./admin/HeroSettingsEditor";
import ImagesManager from "./admin/ImagesManager";
import ServicesManager from "./admin/ServicesManager";
import SocialLinksManager from "./admin/SocialLinksManager";

interface AdminDashboardProps {
  sessionToken: string;
  onLogout: () => void;
}

type Section =
  | "overview"
  | "header"
  | "hero"
  | "about"
  | "services"
  | "clinics"
  | "social"
  | "footer"
  | "images";

const navItems: {
  id: Section;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard size={18} />,
    description: "Dashboard overview",
  },
  {
    id: "header",
    label: "Header",
    icon: <FileText size={18} />,
    description: "Site title & header",
  },
  {
    id: "hero",
    label: "Hero Settings",
    icon: <Settings size={18} />,
    description: "Particle effects & gradients",
  },
  {
    id: "images",
    label: "Images",
    icon: <Image size={18} />,
    description: "Hero background image",
  },
  {
    id: "about",
    label: "About Doctor",
    icon: <User size={18} />,
    description: "Bio & profile photo",
  },
  {
    id: "services",
    label: "Services",
    icon: <Stethoscope size={18} />,
    description: "Medical services list",
  },
  {
    id: "clinics",
    label: "Clinics",
    icon: <Building2 size={18} />,
    description: "Clinic locations",
  },
  {
    id: "social",
    label: "Social Links",
    icon: <Share2 size={18} />,
    description: "Social media profiles",
  },
  {
    id: "footer",
    label: "Footer",
    icon: <FileText size={18} />,
    description: "Footer content & glow",
  },
];

export default function AdminDashboard({
  sessionToken,
  onLogout,
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: content } = useQuery({
    queryKey: ["allContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAllContent();
    },
    enabled: !!actor && !isFetching,
  });

  const handleLogout = () => {
    queryClient.clear();
    onLogout();
  };

  const handleNavClick = (section: Section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Page title */}
            <div>
              <h2
                className="font-heading font-bold text-2xl sm:text-3xl mb-1"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.88 0.12 195), oklch(0.78 0.18 270))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Dashboard Overview
              </h2>
              <p className="text-sm" style={{ color: "oklch(0.62 0.012 230)" }}>
                Manage all aspects of your medical practice website.
              </p>
            </div>

            {/* Stats bar */}
            {content && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  {
                    label: "Services",
                    value: content.services.length,
                    color: "oklch(0.72 0.18 195)",
                  },
                  {
                    label: "Clinics",
                    value: content.clinics.length,
                    color: "oklch(0.65 0.22 260)",
                  },
                  {
                    label: "Social Links",
                    value: content.socialLinks.length,
                    color: "oklch(0.70 0.20 220)",
                  },
                  {
                    label: "Site Title",
                    value: content.siteTitle ? "✓" : "—",
                    color: content.siteTitle
                      ? "oklch(0.65 0.18 145)"
                      : "oklch(0.55 0.015 240)",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 sm:p-5 rounded-2xl relative overflow-hidden"
                    style={{
                      background: "oklch(0.14 0.018 240 / 0.80)",
                      border: "1px solid oklch(0.28 0.018 240)",
                    }}
                  >
                    <div
                      className="text-2xl sm:text-3xl font-bold font-heading mb-1"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs sm:text-sm"
                      style={{ color: "oklch(0.60 0.012 230)" }}
                    >
                      {stat.label}
                    </div>
                    {/* Corner accent */}
                    <div
                      className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl opacity-5"
                      style={{ background: stat.color }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Section cards */}
            <div>
              <h3
                className="text-sm font-semibold tracking-widest uppercase mb-4"
                style={{ color: "oklch(0.55 0.015 240)" }}
              >
                Manage Sections
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {navItems
                  .filter((i) => i.id !== "overview")
                  .map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      data-ocid="admin.overview_button"
                      onClick={() => handleNavClick(item.id)}
                      className="group text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        background: "oklch(0.14 0.018 240 / 0.80)",
                        border: "1px solid oklch(0.26 0.018 240)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = "oklch(0.72 0.18 195 / 0.50)";
                        el.style.background = "oklch(0.72 0.18 195 / 0.06)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = "oklch(0.26 0.018 240)";
                        el.style.background = "oklch(0.14 0.018 240 / 0.80)";
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="p-2 rounded-lg transition-colors duration-200"
                          style={{
                            background: "oklch(0.72 0.18 195 / 0.10)",
                            color: "oklch(0.72 0.18 195)",
                          }}
                        >
                          {item.icon}
                        </div>
                        <ChevronRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                          style={{ color: "oklch(0.45 0.012 240)" }}
                        />
                      </div>
                      <h3
                        className="font-semibold text-sm mb-1"
                        style={{ color: "oklch(0.88 0.010 220)" }}
                      >
                        {item.label}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.012 230)" }}
                      >
                        {item.description}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );

      case "header":
        return (
          <HeaderEditor
            sessionToken={sessionToken}
            currentText={content?.siteTitle ?? ""}
            currentImageUrl={content?.headerImageUrl ?? ""}
            currentImageBase64={content?.headerImageBase64 ?? ""}
          />
        );
      case "hero":
        return <HeroSettingsEditor sessionToken={sessionToken} />;
      case "images":
        return <ImagesManager sessionToken={sessionToken} />;
      case "about":
        return (
          <AboutEditor
            sessionToken={sessionToken}
            currentText={content?.aboutSection ?? ""}
            currentImageUrl={content?.aboutImage?.imageUrl ?? ""}
            currentImageBase64={content?.aboutImage?.imageBase64 ?? ""}
          />
        );
      case "services":
        return <ServicesManager sessionToken={sessionToken} />;
      case "clinics":
        return <ClinicsManager sessionToken={sessionToken} />;
      case "social":
        return <SocialLinksManager sessionToken={sessionToken} />;
      case "footer":
        return (
          <FooterEditor
            sessionToken={sessionToken}
            currentContent={content?.footerContent ?? ""}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.09 0.015 240)" }}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "oklch(0.05 0.010 240 / 0.80)" }}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSidebarOpen(false);
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "256px",
          background: "oklch(0.12 0.018 240)",
          borderRight: "1px solid oklch(0.22 0.018 240)",
        }}
      >
        {/* Brand area */}
        <div
          className="px-5 py-5 shrink-0"
          style={{ borderBottom: "1px solid oklch(0.20 0.018 240)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.18 195), oklch(0.55 0.22 270))",
                boxShadow: "0 2px 12px oklch(0.65 0.18 195 / 0.30)",
              }}
            >
              <Stethoscope size={18} className="text-white" />
            </div>
            <div>
              <p
                className="text-sm font-bold font-heading leading-none"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.88 0.10 195), oklch(0.78 0.16 265))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Admin Panel
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.55 0.012 230)" }}
              >
                Dr. Malay Akechan
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={`admin.nav.${item.id}.tab`}
                onClick={() => handleNavClick(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative"
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(90deg, oklch(0.68 0.18 200 / 0.15), oklch(0.60 0.22 280 / 0.10))",
                        color: "oklch(0.78 0.18 195)",
                        borderLeft: "2px solid oklch(0.72 0.18 195)",
                        paddingLeft: "10px",
                      }
                    : {
                        color: "oklch(0.58 0.012 230)",
                        borderLeft: "2px solid transparent",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.color = "oklch(0.82 0.010 220)";
                    el.style.background = "oklch(0.16 0.018 240)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.color = "oklch(0.58 0.012 230)";
                    el.style.background = "transparent";
                  }
                }}
              >
                <span>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <ChevronRight
                    size={14}
                    style={{ color: "oklch(0.72 0.18 195)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div
          className="px-3 py-4 space-y-1 shrink-0"
          style={{ borderTop: "1px solid oklch(0.20 0.018 240)" }}
        >
          {/* Return to site */}
          <a
            href="/"
            data-ocid="admin.return_site.button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{ color: "oklch(0.58 0.012 230)" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "oklch(0.78 0.18 195)";
              el.style.background = "oklch(0.72 0.18 195 / 0.08)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "oklch(0.58 0.012 230)";
              el.style.background = "transparent";
            }}
          >
            <ArrowLeft size={18} />
            Return to Site
          </a>

          {/* Logout */}
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{ color: "oklch(0.58 0.012 230)" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = "oklch(0.65 0.22 25)";
              el.style.background = "oklch(0.55 0.22 25 / 0.10)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = "oklch(0.58 0.012 230)";
              el.style.background = "transparent";
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-8 py-4 backdrop-blur-xl shrink-0"
          style={{
            background: "oklch(0.12 0.018 240 / 0.95)",
            borderBottom: "1px solid oklch(0.22 0.018 240)",
            boxShadow: "0 1px 0 oklch(0.72 0.18 195 / 0.08)",
          }}
        >
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg transition-colors"
            onClick={() => setSidebarOpen((v) => !v)}
            style={{ color: "oklch(0.65 0.012 230)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.20 0.018 240)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm">
            <span style={{ color: "oklch(0.50 0.012 230)" }}>Admin</span>
            <ChevronRight
              size={14}
              style={{ color: "oklch(0.40 0.012 230)" }}
            />
            <span
              className="font-semibold"
              style={{ color: "oklch(0.85 0.010 220)" }}
            >
              {navItems.find((i) => i.id === activeSection)?.label ??
                "Overview"}
            </span>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-4xl">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
