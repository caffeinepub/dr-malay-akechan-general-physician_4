import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import AboutEditor from './admin/AboutEditor';
import ClinicsManager from './admin/ClinicsManager';
import ServicesManager from './admin/ServicesManager';
import SocialLinksManager from './admin/SocialLinksManager';
import FooterEditor from './admin/FooterEditor';
import HeaderEditor from './admin/HeaderEditor';
import HeroSettingsEditor from './admin/HeroSettingsEditor';
import ImagesManager from './admin/ImagesManager';
import {
  LayoutDashboard,
  User,
  Building2,
  Stethoscope,
  Share2,
  FileText,
  Image,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface AdminDashboardProps {
  sessionToken: string;
  onLogout: () => void;
}

type Section =
  | 'overview'
  | 'header'
  | 'hero'
  | 'about'
  | 'services'
  | 'clinics'
  | 'social'
  | 'footer'
  | 'images';

const navItems: { id: Section; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'overview',  label: 'Overview',      icon: <LayoutDashboard size={18} />, description: 'Dashboard overview' },
  { id: 'header',    label: 'Header',         icon: <FileText size={18} />,        description: 'Site title & header image' },
  { id: 'hero',      label: 'Hero Settings',  icon: <Settings size={18} />,        description: 'Particle effects & gradients' },
  { id: 'images',    label: 'Images',         icon: <Image size={18} />,           description: 'Hero background image' },
  { id: 'about',     label: 'About Doctor',   icon: <User size={18} />,            description: 'Bio & profile photo' },
  { id: 'services',  label: 'Services',       icon: <Stethoscope size={18} />,     description: 'Medical services list' },
  { id: 'clinics',   label: 'Clinics',        icon: <Building2 size={18} />,       description: 'Clinic locations' },
  { id: 'social',    label: 'Social Links',   icon: <Share2 size={18} />,          description: 'Social media profiles' },
  { id: 'footer',    label: 'Footer',         icon: <FileText size={18} />,        description: 'Footer content & glow' },
];

export default function AdminDashboard({ sessionToken, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: content } = useQuery({
    queryKey: ['allContent'],
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

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-1">Dashboard Overview</h2>
              <p className="text-muted-foreground text-sm">Manage all aspects of your medical practice website.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {navItems.filter(i => i.id !== 'overview').map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="group text-left p-5 rounded-xl border border-border bg-card hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                      {item.icon}
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </button>
              ))}
            </div>

            {/* Quick stats */}
            {content && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[
                  { label: 'Services',    value: content.services.length },
                  { label: 'Clinics',     value: content.clinics.length },
                  { label: 'Social Links',value: content.socialLinks.length },
                  { label: 'Site Title',  value: content.siteTitle ? '✓' : '—' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl border border-border bg-card text-center">
                    <div className="text-2xl font-bold font-heading text-cyan-400">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'header':
        return (
          <HeaderEditor
            sessionToken={sessionToken}
            currentText={content?.siteTitle ?? ''}
            currentImageUrl={content?.headerImageUrl ?? ''}
            currentImageBase64={content?.headerImageBase64 ?? ''}
          />
        );
      case 'hero':
        return <HeroSettingsEditor sessionToken={sessionToken} />;
      case 'images':
        return <ImagesManager sessionToken={sessionToken} />;
      case 'about':
        return (
          <AboutEditor
            sessionToken={sessionToken}
            currentText={content?.aboutSection ?? ''}
            currentImageUrl={content?.aboutImage?.imageUrl ?? ''}
            currentImageBase64={content?.aboutImage?.imageBase64 ?? ''}
          />
        );
      case 'services':
        return <ServicesManager sessionToken={sessionToken} />;
      case 'clinics':
        return <ClinicsManager sessionToken={sessionToken} />;
      case 'social':
        return <SocialLinksManager sessionToken={sessionToken} />;
      case 'footer':
        return <FooterEditor sessionToken={sessionToken} currentContent={content?.footerContent ?? ''} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        {/* Logo / Brand */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">Admin Panel</p>
              <p className="text-xs text-muted-foreground mt-0.5">Medical Practice</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-muted-foreground'}>{item.icon}</span>
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto text-cyan-400" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">
              {navItems.find(i => i.id === activeSection)?.label ?? 'Overview'}
            </span>
          </div>
        </div>

        {/* Editor area */}
        <div className="px-8 py-8 max-w-4xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
