import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#about',    label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#clinics',  label: 'Clinics' },
  { href: '#contact',  label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[oklch(0.10_0.018_240/0.97)] backdrop-blur-xl shadow-lg border-b border-[oklch(0.72_0.18_195/0.20)]'
          : 'bg-[oklch(0.10_0.018_240/0.75)] backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a
            href="#"
            className="font-heading font-bold text-lg sm:text-xl tracking-tight text-gradient-cyan hover:opacity-90 transition-opacity shrink-0"
            onClick={handleNavClick}
          >
            Dr. Malay Akechan
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[oklch(0.88_0.010_220)] hover:text-[oklch(0.96_0.010_220)] hover:bg-[oklch(0.72_0.18_195/0.12)] transition-all duration-200"
              >
                {label}
              </a>
            ))}
            <Link
              to="/admin"
              className="ml-3 px-4 py-2 rounded-lg text-sm font-semibold bg-[oklch(0.72_0.18_195/0.15)] text-[oklch(0.82_0.18_195)] border border-[oklch(0.72_0.18_195/0.35)] hover:bg-[oklch(0.72_0.18_195/0.25)] hover:border-[oklch(0.72_0.18_195/0.55)] transition-all duration-200"
            >
              Login
            </Link>
          </nav>

          {/* Mobile hamburger button */}
          <button
            className="flex md:hidden items-center justify-center w-11 h-11 rounded-lg text-[oklch(0.88_0.010_220)] hover:bg-[oklch(0.72_0.18_195/0.12)] transition-colors"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-[oklch(0.72_0.18_195/0.15)]"
          style={{ background: 'oklch(0.10 0.018 240 / 0.98)' }}
        >
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={handleNavClick}
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-[oklch(0.88_0.010_220)] hover:text-[oklch(0.96_0.010_220)] hover:bg-[oklch(0.72_0.18_195/0.12)] transition-all duration-200 min-h-[44px]"
              >
                {label}
              </a>
            ))}
            <Link
              to="/admin"
              onClick={handleNavClick}
              className="flex items-center justify-center mt-2 px-4 py-3 rounded-lg text-base font-semibold bg-[oklch(0.72_0.18_195/0.15)] text-[oklch(0.82_0.18_195)] border border-[oklch(0.72_0.18_195/0.35)] hover:bg-[oklch(0.72_0.18_195/0.25)] transition-all duration-200 min-h-[44px]"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
