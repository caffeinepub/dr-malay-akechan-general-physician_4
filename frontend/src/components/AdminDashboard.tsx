import React, { useState } from 'react';
import {
  LayoutDashboard,
  Image,
  Type,
  User,
  MapPin,
  Wrench,
  Share2,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetAllContent } from '../hooks/useQueries';
import HeroSettingsEditor from './admin/HeroSettingsEditor';
import ImagesManager from './admin/ImagesManager';
import HeaderEditor from './admin/HeaderEditor';
import AboutEditor from './admin/AboutEditor';
import ClinicsManager from './admin/ClinicsManager';
import ServicesManager from './admin/ServicesManager';
import SocialLinksManager from './admin/SocialLinksManager';
import FooterEditor from './admin/FooterEditor';

interface AdminDashboardProps {
  sessionToken: string;
  onLogout: () => void;
}

type Section =
  | 'hero'
  | 'images'
  | 'header'
  | 'about'
  | 'clinics'
  | 'services'
  | 'social'
  | 'footer';

const navItems: { id: Section; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'hero', label: 'Hero Settings', icon: <Settings className="w-4 h-4" />, description: 'Particle effects & background' },
  { id: 'images', label: 'Images', icon: <Image className="w-4 h-4" />, description: 'Hero background image' },
  { id: 'header', label: 'Header', icon: <Type className="w-4 h-4" />, description: 'Site title & header image' },
  { id: 'about', label: 'About', icon: <User className="w-4 h-4" />, description: 'Bio text & profile photo' },
  { id: 'clinics', label: 'Clinics', icon: <MapPin className="w-4 h-4" />, description: 'Manage clinic locations' },
  { id: 'services', label: 'Services', icon: <Wrench className="w-4 h-4" />, description: 'Medical services offered' },
  { id: 'social', label: 'Social Links', icon: <Share2 className="w-4 h-4" />, description: 'Social media profiles' },
  { id: 'footer', label: 'Footer', icon: <FileText className="w-4 h-4" />, description: 'Footer content text' },
];

export default function AdminDashboard({ sessionToken, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const { data: content, isLoading } = useGetAllContent();

  const renderEditor = () => {
    // Sections that don't need content data
    if (activeSection === 'hero') {
      return <HeroSettingsEditor sessionToken={sessionToken} />;
    }
    if (activeSection === 'images') {
      return <ImagesManager sessionToken={sessionToken} />;
    }
    if (activeSection === 'clinics') {
      return <ClinicsManager sessionToken={sessionToken} />;
    }
    if (activeSection === 'services') {
      return <ServicesManager sessionToken={sessionToken} />;
    }
    if (activeSection === 'social') {
      return <SocialLinksManager sessionToken={sessionToken} />;
    }

    // Sections that need content data
    if (isLoading || !content) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <span className="font-body text-sm">Loading content...</span>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'header':
        return (
          <HeaderEditor
            sessionToken={sessionToken}
            currentTitle={content.siteTitle}
            currentHeaderImageBase64={content.headerImageBase64}
            currentHeaderImageUrl={content.headerImageUrl}
          />
        );
      case 'about':
        return (
          <AboutEditor
            sessionToken={sessionToken}
            currentText={content.aboutSection}
            currentImageUrl={content.aboutImageUrl}
            currentImageBase64={content.aboutImageBase64}
          />
        );
      case 'footer':
        return (
          <FooterEditor
            sessionToken={sessionToken}
            currentContent={content.footerContent}
          />
        );
      default:
        return null;
    }
  };

  const activeItem = navItems.find((item) => item.id === activeSection);

  return (
    <div className="min-h-screen bg-navy-800 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-navy-900 border-r border-cyan-500/15 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-cyan-500/15">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sharp bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Admin Panel</p>
              <p className="text-slate-500 text-xs font-body">Content Management</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-sharp text-left transition-all duration-200 group',
                activeSection === item.id
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              <span className={cn(
                'shrink-0 transition-colors duration-200',
                activeSection === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
              )}>
                {item.icon}
              </span>
              <span className="font-body text-sm font-medium truncate">{item.label}</span>
              {activeSection === item.id && (
                <ChevronRight className="w-3 h-3 ml-auto text-cyan-400 shrink-0" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-cyan-500/15">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sharp text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="font-body text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-14 border-b border-cyan-500/15 bg-navy-800/80 backdrop-blur-sm flex items-center px-6 gap-3">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-body">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <span className="text-white text-sm font-body font-medium">{activeItem?.label}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
            <span className="text-slate-500 text-xs font-body">Session active</span>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Section Header */}
          {activeItem && (
            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl text-white">{activeItem.label}</h1>
              <p className="text-slate-400 text-sm font-body mt-1">{activeItem.description}</p>
            </div>
          )}

          {/* Editor Content */}
          <div className="bg-navy-700 border border-cyan-500/15 rounded-card shadow-card-dark p-6">
            {renderEditor()}
          </div>
        </div>
      </main>
    </div>
  );
}
