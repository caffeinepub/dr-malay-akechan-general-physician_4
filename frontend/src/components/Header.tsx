import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Shield, Menu, X, Sun, Moon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  siteTitle?: string;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Clinics', href: '#clinics' },
  { label: 'Connect', href: '#social' },
];

export default function Header({ siteTitle = 'MedClinic', isDark = true, onToggleTheme }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section
      const sections = ['hero', 'about', 'services', 'clinics', 'social'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-navy-800/95 backdrop-blur-md border-b border-cyan-500/20 shadow-card-dark'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <button
            onClick={() => handleNavClick('#hero')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-sharp bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center group-hover:bg-cyan-500/30 group-hover:border-cyan-500 transition-all duration-200 glow-cyan-sm">
              <Zap className="w-4 h-4 text-cyan-500" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              {siteTitle || 'MedClinic'}
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium font-body transition-all duration-200 rounded-sm',
                    'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-px after:transition-all after:duration-300',
                    isActive
                      ? 'text-cyan-400 after:w-full after:bg-cyan-400'
                      : 'text-slate-400 hover:text-white after:w-0 hover:after:w-full after:bg-cyan-500/60'
                  )}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-pill border border-slate-600 hover:border-cyan-500/50 bg-navy-600/50 hover:bg-cyan-500/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Admin Link */}
            <Link
              to="/admin"
              className="w-9 h-9 rounded-pill border border-slate-600 hover:border-cyan-500/50 bg-navy-600/50 hover:bg-cyan-500/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all duration-200"
              aria-label="Admin panel"
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-pill border border-slate-600 hover:border-cyan-500/50 bg-navy-600/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-800/98 backdrop-blur-md border-t border-cyan-500/20">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'text-left px-4 py-3 rounded-sm text-sm font-medium font-body transition-all duration-200 border-l-2',
                    isActive
                      ? 'text-cyan-400 border-cyan-400 bg-cyan-500/10'
                      : 'text-slate-400 border-transparent hover:text-white hover:border-cyan-500/50 hover:bg-white/5'
                  )}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
