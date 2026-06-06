
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, ExternalLink, Calendar, Tag, User } from 'lucide-react';
import { PROJECTS } from '../constants';
import Header from './Header';
import Footer from './Footer';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const project = PROJECTS.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 text-center unveil">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Project Not Found</h1>
            <p className="text-slate-600 mb-8">The project you are looking for does not exist or has been moved.</p>
            <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all">
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-amber-500"
          >
            <ArrowLeft size={20} />
            Back to categories
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Project Image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-100 unveil">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Project Details */}
            <div className="space-y-8">
              <div>
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-2 block">
                  {project.category}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 league-spartan leading-tight">
                  {project.title}
                </h1>
              </div>

              <div className="prose prose-lg text-slate-600">
                <p className="text-xl leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 py-8 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Category</p>
                    <p className="font-bold text-slate-900">{project.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Client</p>
                    <p className="font-bold text-slate-900">Premium Partner</p>
                  </div>
                </div>
              </div>

             
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetailPage;


