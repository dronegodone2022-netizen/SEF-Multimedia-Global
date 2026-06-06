
import React from 'react';
import { Facebook, Instagram, Youtube, Play, Send, MapPin, Phone, Mail, ChevronRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Our Services', href: '/#services' },
    { name: 'Recent Work', href: '/#portfolio' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Learning Center', href: '/courses' },
    { name: 'Website Policies', href: '/policy' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl tracking-tighter">SEF</span>
              </div>
              <span className="font-bold text-xl text-amber-500">Multimedia Global</span>
            </Link>
            <p className="leading-relaxed">
              We specialize in combining creativity with technology to help you stand out. Capturing your story, one pixel at a time.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/SEFMultimediaGlobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
             
              <a href="https://youtube.com/@sefmultimediaglobal101?si=B5W6hg6Ac9r6vZhN" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
                <Youtube size={20} />
              </a>
              <a href="https://www.tiktok.com/@sef.multimedia.global?_r=1&_t=ZS-95alsUAATP2" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
                <Play size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-xl mb-8 league-spartan">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link to={link.href} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                      <ChevronRight size={14} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                      <ChevronRight size={14} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-xl mb-8 league-spartan">Contact Info</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-indigo-500 shrink-0 mt-1" size={20} />
                <span>Bo City, Sierra Leone</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-indigo-500 shrink-0" size={20} />
                <a href="tel:+23275510770" className="hover:text-white transition-colors duration-300">+232 75 510 770</a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-indigo-500 shrink-0" size={20} />
                <a href="mailto:hello@sefmultimediaglobal.com" className="hover:text-white transition-colors duration-300">hello@sefmultimediaglobal.com</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-xl mb-8 league-spartan">WhatsSAPP Channel</h4>
            <p className="mb-6 text-sm">Join our creative community and get updates on our latest work.</p>
            <a 
              href="https://whatsapp.com/channel/YOUR_CHANNEL_ID" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-lime-600 hover:bg-green-800 px-6 py-3 rounded-xl text-white font-medium transition-colors"
            >
              <Send size={20} />
              Subscribe to Channel
            </a>
          </div>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium">
          <p>© 2026 SEF Multimedia Global. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link to="/policy" className="hover:text-white transition-colors duration-300 flex items-center gap-1">Privacy & Policies</Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-300 flex items-center gap-1">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
