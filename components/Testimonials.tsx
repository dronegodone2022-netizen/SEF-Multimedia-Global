
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4 unveil">
          <p className="text-indigo-400 font-bold tracking-widest uppercase unveil">Feedback</p>
          <h2 className="text-4xl md:text-5xl font-black league-spartan unveil">What Our Clients Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <div key={t.id} className="bg-amber-600/10 backdrop-blur-sm p-10 rounded-[40px] border border-amber-400/30 relative group hover:bg-amber-600/15 transition-colors unveil">
              <Quote className="absolute top-8 right-8 text-amber-400 opacity-20 w-12 h-12" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-slate-300 italic mb-8 relative z-10">
                "{t.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-600" />
                <div>
                  <h4 className="font-bold text-white text-lg">{t.name}</h4>
                  <p className="text-indigo-400 text-sm font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
