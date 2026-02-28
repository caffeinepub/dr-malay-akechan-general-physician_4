import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, Stethoscope, MapPin, Share2,
  Image, Settings, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import AboutEditor from './admin/AboutEditor';
import ClinicsManager from './admin/ClinicsManager';
import ServicesManager from './admin/ServicesManager';
import SocialLinksManager from './admin/SocialLinksManager';
import FooterEditor from './admin/FooterEditor';
import HeaderEditor from './admin/HeaderEditor';
import HeroSettingsEditor from './admin/HeroSettingsEditor';
import ImagesManager from './admin/ImagesManager';
import { useGetAllContent } from '../hooks/useQueries';

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

interface AdminDashboardProps {
  sessionToken: string;
  onLogout: () => void;
}

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'header', label: 'Site Title', icon: <FileText className="w-4 h-4" /> },
  { id: 'hero', label: 'Hero Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'about', label: 'About', icon: <FileText className="w-4 h-4" /> },
  { id: 'services', label: 'Services', icon: <Stethoscope className="w-4 h-4" /> },
  { id: 'clinics', label: 'Clinics', icon: <MapPin className="w-4 h-4" /> },
  { id: 'social', label: 'Social Links', icon: <Share2 className="w-4 h-4" /> },
  { id: 'footer', label: 'Footer', icon: <FileText className="w-4 h-4" /> },
  { id: 'images', label: 'Images', icon: <Image className="w-4 h-4" /> },
];

export default function AdminDashboard({ sessionToken, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: content } = useGetAllContent();

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Dashboard Overview</h2>
              <p className="text-muted-foreground text-sm">Manage your medical profile content.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Services', count: content?.services?.length ?? 0, color: 'bg-teal-50 text-teal-700 border-teal-200' },
                { label: 'Clinics', count: content?.clinics?.length ?? 0, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: 'Social Links', count: content?.socialLinks?.length ?? 0, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { label: 'Sections', count: 5, color: 'bg-amber-50 text-amber-700 border-amber-200' },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
                  <p className="text-2xl font-bold font-display">{item.count}</p>
                  <p className="text-sm font-medium mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-muted/50 rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {navItems.slice(1).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium text-foreground"
                  >
                    <span className="text-primary">{item.icon}</span>
                    {item.label}
                    <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'header':
        return <HeaderEditor sessionToken={sessionToken} currentText={content?.siteTitle || ''} currentImageUrl={content?.headerImageUrl || ''} currentImageBase64={content?.headerImageBase64 || ''} />;
      case 'hero':
        return <HeroSettingsEditor sessionToken={sessionToken} />;
      case 'about':
        return <AboutEditor sessionToken={sessionToken} currentText={content?.aboutSection || ''} currentImageUrl={content?.aboutImageUrl || ''} currentImageBase64={content?.aboutImageBase64 || ''} />;
      case 'services':
        return <ServicesManager sessionToken={sessionToken} />;
      case 'clinics':
        return <ClinicsManager sessionToken={sessionToken} />;
      case 'social':
        return <SocialLinksManager sessionToken={sessionToken} />;
      case 'footer':
        return <FooterEditor sessionToken={sessionToken} currentContent={content?.footerContent || ''} />;
      case 'images':
        return <ImagesManager sessionToken={sessionToken} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-display font-semibold">
            <Stethoscope className="w-5 h-5" />
            <span>Admin Panel</span>
          </div>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-semibold text-foreground">
              {navItems.find((n) => n.id === activeSection)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
