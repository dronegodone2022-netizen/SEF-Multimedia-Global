
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQS } from '../constants';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16 space-y-4 unveil">
          <p className="text-indigo-600 font-bold tracking-widest uppercase unveil">Support</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 league-spartan unveil">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              className={`border-2 rounded-2xl transition-all ${
                activeIndex === index ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                <div className={`p-1 rounded-full transition-colors ${activeIndex === index ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
