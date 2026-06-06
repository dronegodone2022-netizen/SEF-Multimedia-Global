
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PROJECTS } from '../constants';
import Header from './Header';
import Footer from './Footer';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = PROJECTS.filter(
    (p) => p.category.toLowerCase().replace(/\s+/g, '-') === categoryName
  );

  const isVideography = categoryName === 'videography';
  const isPhotography = categoryName === 'photography';
  const isGraphicDesign = categoryName === 'graphic-design';
  
  // Get subcategories for Graphic Design
  const graphicDesignSubcategories = [
    'Logo Design',
    'Flyers/Posters',
    'Cloth Branding',
    'Certificate/Invitation'
  ] as const;
  
  const selectedSubcategoryProjects = selectedSubcategory
    ? filteredProjects.filter(p => p.subcategory === selectedSubcategory)
    : [];

  const graphicDesignSubcategoryCards = graphicDesignSubcategories.map((subcategory) => {
    const projects = filteredProjects.filter((p) => p.subcategory === subcategory);
    return {
      subcategory,
      count: projects.length,
      preview: projects.slice(0, 2),
      projects,
    };
  });

  const youtubeChannelUrl = 'https://www.youtube.com/@SEFMultimediaGlobal';
  const youtubeVideos = [
    {
      id: 'DaEN_WnQiwI',
      title: 'BANJE_ NATASHA _OFFICIAL 4K Video_ X_Sageman+Kin Dawish +Margin+XPLUS+Dopo',
      description: 'Watch our flagship videography project showcase on YouTube.',
    },
    {
      id: 'uTNuCJJNqTw',
      title: 'Your Love_ SL_BIG STATE ft. LIAM _OFFICIAL MUSIC VIDEO',
      description: 'Watch a videography project SL_BIG STATE ft. LIAM on YouTube.',
    },
    {
      id: '7QN1PIEljzk',
      title: 'Fadah cross_ x_ Internet Man_AAAa',
      description: 'Watch our videography project for FADAH CROSS_ x_ Internet Man showcase on YouTube.',
    },
     {
      id: 'PLbEOYxe1TU',
      title: 'LADY NANCY_NA GOD_official video',
      description: 'Watch our videography project With LADY NANCY on YouTube.',
    },
    {
      id: 'B0NasuLh5gw',
      title: 'Fadah Cross_ INSIE SALONE_official Video',
      description: 'Watch our flagship videography project with FADA CROSS  showcase on YouTube.',
    },
    {
      id: 'Mt4Oa7ADQQ0',
      title: 'SHAWARMA DANCE_STUNT MAN_official Video',
      description: 'Watch a flagship videography project for STUNT MAN SHAWARMA DANCE showcase on YouTube.',
    },
  ];

  const displayCategory = PROJECTS.find(
    (p) => p.category.toLowerCase().replace(/\s+/g, '-') === categoryName
  )?.category || categoryName?.replace(/-/g, ' ');

  // Modal state for photography gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Determine which projects array to use for modal
  const modalProjects = selectedSubcategory ? selectedSubcategoryProjects : filteredProjects;

  // Modal navigation functions
  const openModal = (index: number) => setSelectedImageIndex(index);
  const closeModal = () => setSelectedImageIndex(null);
  const nextImage = () => {
    if (selectedImageIndex !== null && modalProjects.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % modalProjects.length);
    }
  };
  const prevImage = () => {
    if (selectedImageIndex !== null && modalProjects.length > 0) {
      setSelectedImageIndex(selectedImageIndex === 0 ? modalProjects.length - 1 : selectedImageIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageIndex]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <Link 
            to="/gallery" 
            className="inline-flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:text-indigo-700 transition-colors"
           
          >
            <ArrowLeft size={20} />
            Back to Gallery
          </Link>

          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 league-spartan">
              {displayCategory} <span className="text-amber-600">Projects</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              {isPhotography 
                ? 'Browse our complete photography portfolio. Click on any image to view it in full detail.'
                : isGraphicDesign
                ? 'Explore our graphic design work across different specializations. Select a category to view projects.'
                : `Explore our full collection of ${displayCategory?.toLowerCase()} work, crafted with passion and precision.`
              }
            </p>
          </div>

          {isPhotography ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                    onClick={() => openModal(index)}
                   
                   
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white font-semibold text-sm truncate">{project.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal/Lightbox */}
              {selectedImageIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-6">
                  <div className="relative w-full max-w-[90vw] sm:max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-slate-950/90 p-4 sm:p-6">
                    {/* Close button */}
                    <button
                      onClick={closeModal}
                      title="Close"
                      className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                    >
                      <X size={28} />
                    </button>

                    {/* Main image */}
                    <div className="relative flex items-center justify-center">
                      <img
                        src={filteredProjects[selectedImageIndex].imageUrl}
                        alt={filteredProjects[selectedImageIndex].title}
                        className="block mx-auto max-w-full max-h-[70vh] object-contain rounded-lg"
                        referrerPolicy="no-referrer"
                      />

                      {/* Navigation buttons */}
                      {filteredProjects.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            title="Previous image"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextImage}
                            title="Next image"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Image info */}
                    <div className="mt-4 text-center unveil">
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {filteredProjects[selectedImageIndex].title}
                      </h3>
                      <p className="text-gray-300">
                        {filteredProjects[selectedImageIndex].description}
                      </p>
                      <div className="mt-4 text-sm text-gray-400">
                        {selectedImageIndex + 1} of {filteredProjects.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : isVideography ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {youtubeVideos.map((video, index) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-3xl bg-slate-100 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl"
                   
                   
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent opacity-70"></div>
                      <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm">
                        <PlayCircle size={16} />
                        Watch on YouTube
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 league-spartan">
                        {video.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-10 text-center unveil">
                <a
                  href="https://www.youtube.com/@SEFMULTIMEDIAglobal101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-white font-bold shadow-xl shadow-indigo-700/20 transition-all hover:bg-indigo-500"
                >
                  View Full YouTube Channel
                  <ExternalLink size={16} />
                </a>
              </div>
            </>
          ) : isGraphicDesign ? (
            <>
              {selectedSubcategory ? (
                <>
                  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
                    <div>
                      <span className="text-sm uppercase tracking-[0.35em] text-indigo-600">
                        {selectedSubcategory}
                      </span>
                      <h2 className="mt-4 text-4xl font-black text-slate-900 league-spartan">
                        {selectedSubcategory} Gallery
                      </h2>
                      <p className="mt-3 text-slate-600">
                        {selectedSubcategoryProjects.length} image{selectedSubcategoryProjects.length === 1 ? '' : 's'} in this collection.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setSelectedSubcategory(null)}
                        className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Back to categories
                      </button>
                    </div>
                  </div>

                  {selectedSubcategoryProjects.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedSubcategoryProjects.map((project, index) => (
                          <div
                            key={project.id}
                            className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                            onClick={() => openModal(index)}
                          >
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                          </div>
                        ))}
                      </div>

                      {/* Modal/Lightbox for Graphic Design */}
                      {selectedImageIndex !== null && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-6">
                          <div className="relative w-full max-w-[90vw] sm:max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-slate-950/90 p-4 sm:p-6">
                            {/* Close button */}
                            <button
                              onClick={closeModal}
                              title="Close"
                              className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                            >
                              <X size={28} />
                            </button>

                            {/* Main image */}
                            <div className="relative flex items-center justify-center">
                              <img
                                src={selectedSubcategoryProjects[selectedImageIndex].imageUrl}
                                alt={selectedSubcategoryProjects[selectedImageIndex].title}
                                className="block mx-auto max-w-full max-h-[70vh] object-contain rounded-lg"
                                referrerPolicy="no-referrer"
                              />

                              {/* Navigation buttons */}
                              {selectedSubcategoryProjects.length > 1 && (
                                <>
                                  <button
                                    onClick={prevImage}
                                    title="Previous image"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                                  >
                                    <ChevronLeft size={24} />
                                  </button>
                                  <button
                                    onClick={nextImage}
                                    title="Next image"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                                  >
                                    <ChevronRight size={24} />
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Image counter */}
                            <div className="mt-4 text-center">
                              <div className="text-sm text-gray-400">
                                {selectedImageIndex + 1} of {selectedSubcategoryProjects.length}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-24 bg-slate-50 rounded-3xl unveil">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">No images found</h3>
                      <p className="text-slate-600">There are no images in this category yet.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                  {graphicDesignSubcategoryCards.map((card) => (
                    <button
                      key={card.subcategory}
                      onClick={() => setSelectedSubcategory(card.subcategory)}
                      className="group relative rounded-3xl overflow-hidden bg-slate-900 text-left shadow-2xl shadow-slate-200/10 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="p-8">
                        <span className="text-sm uppercase tracking-[0.25em] text-slate-300">
                          {card.subcategory}
                        </span>
                        <p className="mt-3 text-2xl font-bold text-white league-spartan">
                          {card.count} Images
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">
                          Tap to view the full {card.subcategory} gallery.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-1 p-4 bg-slate-950/95">
                        {card.preview.map((project) => (
                          <img
                            key={project.id}
                            src={project.imageUrl}
                            alt={project.title}
                            className="h-40 w-full object-cover rounded-2xl transition-all duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                        {card.preview.length === 0 && (
                          <div className="col-span-2 flex items-center justify-center rounded-2xl bg-slate-800 text-slate-300 text-sm">
                            No preview images available
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link 
                  to={`/project/${project.id}`}
                  key={project.id} 
                  className="group relative rounded-3xl overflow-hidden bg-slate-100 aspect-square cursor-pointer block"
                >
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-2 block">
                        {project.category}
                      </span>
                      <h3 className={`text-2xl font-bold text-white mb-4 league-spartan ${project.category === 'Web Development' ? 'group-hover:text-blue-800' : ''}`}>
                        {project.title}
                      </h3>
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-bold">
                        View Project
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-600">We haven't added any projects to this category yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;


