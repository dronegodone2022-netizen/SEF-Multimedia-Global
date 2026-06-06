
import React from 'react';
import { ExternalLink, Camera, Video, Monitor, LayoutGrid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
const photograpImage = '/src/assests/photograp.jpg';
const videograpImage = '/src/assests/videograp.jpg';
const graphicImage = '/src/assests/graphic.jpg';
const webImage = '/src/assests/webdesign.jpg';

const iconMap: Record<string, React.ElementType> = {
  Photography: Camera,
  Videography: Video,
  'Graphic Design': Monitor,
  'Web Development': LayoutGrid,
};

const Portfolio: React.FC = () => {
  const getCategorySlug = (cat: string) => cat.toLowerCase().replace(/\s+/g, '-');

  const categories = [
    {
      name: 'Videography',
      icon: Video,
      description: 'Professional video production including music videos, documentaries, and corporate content',
      projectCount: PROJECTS.filter(p => p.category === 'Videography').length,
      color: 'bg-teal-500',
      bgImage: videograpImage
    },
    {
      name: 'Photography',
      icon: Camera,
      description: 'High-quality photography services for portraits, events, and brand imagery',
      projectCount: PROJECTS.filter(p => p.category === 'Photography').length,
      color: 'bg-orange-500',
      bgImage: photograpImage
    },
    {
      name: 'Graphic Design',
      icon: Monitor,
      description: 'Creative design solutions including logos, branding, and marketing materials',
      projectCount: PROJECTS.filter(p => p.category === 'Graphic Design').length,
      color: 'bg-rose-500',
      bgImage: graphicImage
    },
    {
      name: 'Web Development',
      icon: LayoutGrid,
      description: 'Modern, responsive websites and web applications with cutting-edge technology',
      projectCount: PROJECTS.filter(p => p.category === 'Web Development').length,
      color: 'bg-blue-500',
      bgImage: webImage
    },
  ];

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 unveil">
          <div className="max-w-xl space-y-4">
            <p className="text-indigo-600 font-bold tracking-widest uppercase unveil">Our Work</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 league-spartan unveil">Showcasing <span className="text-amber-600">Creativity</span> & Impact</h2>
            <p className="text-slate-600 unveil">
              Explore our creative disciplines and discover the projects that define our expertise.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 unveil">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
            >
              View Full Gallery
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                to={`/gallery/${getCategorySlug(category.name)}`}
                className="group relative rounded-3xl overflow-hidden bg-slate-100 aspect-square cursor-pointer block hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 unveil"
              >
                <img
                  src={category.bgImage}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover blur-sm group-hover:blur-none transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 league-spartan drop-shadow-lg">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed mb-4 drop-shadow-md">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/30 group-hover:bg-white/30 transition-colors">
                    {category.projectCount} Projects
                    <ExternalLink size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
