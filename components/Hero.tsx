
import React from 'react';
import { Play, ArrowRight, MessageCircle } from 'lucide-react';

const heroImage1 = new URL('../src/assests/heroBg3.jpg', import.meta.url).href;
const heroImage2 = new URL('../src/assests/hero-banner-1.jpg', import.meta.url).href;

// Safe static list of client images in src/assests
const clientImages: string[] = [
  new URL('../src/assests/client211.png', import.meta.url).href,
  new URL('../src/assests/client212.png', import.meta.url).href,
  new URL('../src/assests/client213.jpg', import.meta.url).href,
  new URL('../src/assests/client214.png', import.meta.url).href,
];

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-400 via-slate-200 to-white">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-indigo-100 via-slate-100 to-white rounded-l-[100px] -z-10 hidden lg:block"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-200 via-sky-100 to-white rounded-full blur-[100px] opacity-70 -z-10"></div>
      
      <div className="container mx-auto px-6 grid lg:grid-cols-2 mt-12 gap-12 items-center">
        <div className="space-y-8 unveil">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold tracking-wide uppercase unveil">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Top Creative Agency 2024
          </div>
          
          <h1 className="text-4xl md:text-6xl  font-extrabold text-slate-900 league-spartan leading-[1.1] unveil">
            Capturing Moments. <br />
            <span className="text-amber-600">Creating Stories.</span> <br />
            Building Brands.
          </h1>
          
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed unveil">
            We bring your vision to life through innovation, photography, videography, cutting-edge graphic design, and web solutions. Experiences that inspire, connect, and last.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 unveil">
            <a 
              href="https://wa.me/+23275510770" target='_blank'
              className="w-full sm:w-auto bg-indigo-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <a 
              href="#portfolio" 
              className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-amber-500 text-slate-900 hover:text-amber-500 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              View Our Work
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          
          <div className="flex items-center gap-6 pt-4 pb-12">
              <div className="flex -space-x-3 flex-wrap">
              {clientImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Client ${i + 1}`}
                  className="w-12 h-12 rounded-full border-4 border-white shadow-sm m-1"
                  loading="lazy"
                />
              ))}
            </div>
            <div>
              <p className="font-bold text-slate-900">500+ Happy Clients</p>
              <p className="text-sm text-slate-500">Across 12 countries worldwide</p>
            </div>
          </div>
        </div>
        
        <div className="relative unveil-right">
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-500 unveil">
                <img src={heroImage1} alt="Hero 1" className="w-full h-80 object-cover" />
              </div>
              <div className="bg-amber-600 rounded-[15px] p-8 text-white shadow-2xl unveil">
                <div className="text-4xl font-black mb-1">10+</div>
                <div className="text-indigo-100 font-medium">Years of Creative Excellence</div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
             <div className="hover:scale-105 duration-500 rounded-[10px] h-60 flex items-center justify-center shadow-2xl unveil-scale">
              <iframe
                className="w-full h-full rounded-[10px]"
                src="https://www.youtube.com/embed/DaEN_WnQiwI?autoplay=1&mute=1&loop=1&playlist=DaEN_WnQiwI"
                title="YouTube video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
          </div>
              <div className="rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-500 unveil">
                <img src={heroImage2} alt="Hero 2" className="w-full h-80 object-cover" />
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full -z-10 animate-bounce-slow"></div>
          <div className="absolute -top-10 -left-10 w-24 h-24 border-8 border-indigo-200 rounded-full -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
