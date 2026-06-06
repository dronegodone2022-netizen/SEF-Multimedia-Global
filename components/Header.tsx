
import React, { useState, useEffect } from 'react';
import { Menu, X, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const logoSrc = new URL('../src/assests/LOGO.png', import.meta.url).href;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: isHome ? '#' : '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: isHome ? '#services' : '/#services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'SEF ACADEMY', href: '/courses' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50  transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-xl border-b border-slate-200/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative flex-none rounded-3xl bg-gradient-to-br from-amber-400 via-indigo-500 to-blue-600 p-1 shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:-translate-y-0.5">
              <img src={logoSrc} alt="SEF Multimedia Global logo" className="w-12 h-12 rounded-2xl bg-white p-1 object-contain" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className={`text-lg sm:text-xl font-semibold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-amber-400' : 'text-slate-950'}`}>
                SEF Multimedia
              </span>
              <span className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${isScrolled ? 'text-amber-500' : 'text-slate-600'}`}>
                Global
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="group relative px-4 py-2 text-sm font-semibold text-blue-700 rounded-2xl transition duration-300 hover:text-slate-950 hover:bg-amber-50">
                {link.name}
                <span className="absolute inset-x-4 bottom-2 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 opacity-0 transition duration-300 group-hover:opacity-100" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a href="https://wa.me/+23275510770" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              <MessageSquare className="w-4 h-4" />
              Book Session
            </a>
          </div>

          <button type="button" aria-expanded={isMenuOpen} aria-controls="mobile-menu" onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 text-slate-900 shadow-sm shadow-slate-200/60 transition hover:bg-slate-50">
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="sr-only">Toggle mobile menu</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`lg:hidden fixed inset-x-0 top-20 z-40 transition-all duration-300 ${isMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="mx-4 overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-6">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="SEF Multimedia Global" className="w-11 h-11 rounded-2xl bg-slate-100 p-1" />
              <div>
                <p className="text-base font-semibold text-slate-950">SEF Multimedia</p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-amber-500">Global</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsMenuOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition hover:bg-slate-200">
              <X size={24} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <div className="space-y-2 px-5 pb-7">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="block rounded-3xl px-5 py-4 text-base font-semibold text-slate-800 transition duration-300 hover:bg-slate-100 hover:text-slate-950">
                {link.name}
              </a>
            ))}
          </div>

          <div className="border-t border-slate-200 px-5 py-6">
            <a href="https://wa.me/+23275510770" target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-0.5">
              <MessageSquare className="w-5 h-5" />
              Book a Session
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
