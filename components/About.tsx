
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const aboutImage = new URL('/src/assests/About.jpg', import.meta.url).href;

const About = () => {
  const highlights = [
    "Professional expertise across multiple creative fields.",
    "Cutting-edge equipment and modern techniques.",
    "A team that values creativity, precision, and detail.",
    "Customized solutions for individuals and businesses."
  ];

 return (
    <section id="about" className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src={aboutImage} 
                alt="Our Team" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            <div className="absolute -bottom-10 -right-15 bg-amber-500 p-8 rounded-3xl shadow-2xl max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle2 className="text-green-600 w-8 h-8" />
                </div>
                <div className="text-white font-black text-2xl">100%</div>
              </div>
              <p className="text-indigo-900 font-medium">Commitment to quality and storytelling excellence.</p>
            </div>
            
            <div className="absolute top-10 -left-10 w-20 h-20 bg-indigo-600 rounded-full animate-pulse opacity-20"></div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-indigo-600 font-bold tracking-widest uppercase">About SEF Global</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 league-spartan leading-tight">
                Over <span className="text-indigo-600">10 Years</span> of Digital Excellence.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                SEF Multimedia Global is a full-service creative agency dedicated to capturing, crafting, and showcasing powerful stories.
                From timeless photography and cinematic videography to impactful graphic design and modern websites, we blend creativity with technology to help you stand out in a competitive world.
                  
                <p className="mt-4">
                  Our team of passionate professionals operating under our photography brand, SEF Photography Global brings over 10 years of experience in delivering exceptional quality and storytelling excellence. We work closely with individuals, businesses, and organizations to produce visual experiences that inspire, connect, and endure.

                </p>
                  
                <p className="mt-4">
                  Whether you need compelling visuals, a strong digital presence, or complete creative support, SEF Multimedia Global is committed to transforming your vision into an unforgettable story.

                </p>
                
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((text, i) => (
                <div key={i} className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl shadow-sm">
                  <CheckCircle2 className="text-indigo-600 w-6 h-6 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm leading-tight">{text}</span>
                </div>
              ))}
            </div>
            
            <button className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg">
              Explore Our Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
