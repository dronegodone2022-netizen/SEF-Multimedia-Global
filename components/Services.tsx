
import React from 'react';
import { Camera, Video, Monitor, PenTool } from 'lucide-react';
import { SERVICES } from '../constants';

const IconMap: Record<string, any> = {
  Camera: Camera,
  Video: Video,
  Monitor: Monitor,
  PenTool: PenTool,
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 unveil">
          <p className="text-indigo-600 font-bold tracking-widest uppercase unveil">Our Expertise</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 league-spartan unveil">
            Bringing <span className="text-amber-600">Your Vision</span> to Life.
          </h2>
          <p className="text-slate-600 text-lg unveil">
            At SEF Multimedia Global, we specialize in Computer training, repairing, and delivering high-quality multimedia solutions that elevate your brand and capture your story.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = IconMap[service.icon];
            return (
              <div 
                key={service.id}
                className="group relative bg-amber-50 p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all hover:-translate-y-2 duration-300 unveil"
              >
                <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 league-spartan">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
