import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetAllContent } from '../hooks/useQueries';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Clinics', href: '#clinics' },
  { label: 'Connect', href: '#social' },
];

export default function Header() {
  const { data: content } = useGetAllContent();
  const siteTitle = content?.siteTitle || 'Dr. Malay';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Title */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center text-white font-bold text-sm font-heading">
            {siteTitle.charAt(0)}
          </div>
          <span className="text-base font-bold font-heading text-foreground group-hover:text-primary transition-colors">
            {siteTitle}
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/admin"
            className="px-4 py-1.5 rounded-full text-sm font-semibold font-heading border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150"
          >
            Admin
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-b border-border px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/admin"
            className="block px-4 py-2 rounded-full text-sm font-semibold font-heading border border-primary text-primary text-center"
            onClick={() => setMobileOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
