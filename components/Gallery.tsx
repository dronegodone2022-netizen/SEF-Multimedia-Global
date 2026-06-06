import * as React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Video, Monitor, LayoutGrid, ArrowRight, Mail } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// @ts-ignore
import 'swiper/css/bundle';
import { PROJECTS } from '../constants';
import Header from './Header';
import Footer from './Footer';
const galleryHero1 = '/src/assests/heroBg1.jpg';
const galleryHero2 = '/src/assests/heroBg2.jpg';
const galleryHero3 = '/src/assests/heroBg3.jpg';
const galleryHero4 = '/src/assests/heroBg4.jpg';
const galleryHero5 = '/src/assests/heroBg5.jpg';
const photograpImage = '/src/assests/photograp.jpg';
const videograpImage = '/src/assests/videograp.jpg';
const graphicImage = '/src/assests/graphic.jpg';
const webImage = '/src/assests/webdesign.jpg';

 type InputEvent = { target: { value: string } };
type FormSubmitEvent = { preventDefault: () => void };
type ClickEvent = { stopPropagation: () => void };

const Gallery = () => {
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
    }
  ];

  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = React.useState(false);
  const [contactName, setContactName] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [contactMessage, setContactMessage] = React.useState('');
  const [contactError, setContactError] = React.useState('');

  const handleWhatsAppSubmit = (e: FormSubmitEvent) => {
    e.preventDefault();

    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim() || !selectedCategory || !contactMessage.trim()) {
      setContactError('All fields are required.');
      return;
    }

    const message = `Hello SEF Multimedia Global, I would like to discuss a project.\n\nName: ${contactName}\nEmail: ${contactEmail}\nPhone: ${contactPhone}\nService: ${selectedCategory}\nMessage: ${contactMessage}`;
    const whatsappUrl = `https://wa.me/+23275510770?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setIsWhatsAppFormOpen(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setSelectedCategory('');
    setContactMessage('');
    setContactError('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: none;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.6);
          color: white;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 24px;
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
        }
        .swiper-pagination-bullet-active {
          background: #fbbf24;
        }
      `}</style>
      <Header />
      <main className="pt-0 pb-24">
        <section className="relative h-125 md:h-150 overflow-hidden">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{ enabled: true }}
            pagination={{ clickable: true }}
            loop={true}
            speed={1000}
            className="w-full h-full"
          >
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={galleryHero1} alt="Gallery Hero 1" className="w-full h-full object-cover blur-md" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-700 to-indigo-900/30" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={galleryHero2} alt="Gallery Hero 2" className="w-full h-full object-cover blur-md" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-700 to-indigo-900/30" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={galleryHero3} alt="Gallery Hero 3" className="w-full h-full object-cover blur-md" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-700 to-indigo-900/30" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={galleryHero4} alt="Gallery Hero 4" className="w-full h-full object-cover blur-md" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-700 to-indigo-900/30" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={galleryHero5} alt="Gallery Hero 5" className="w-full h-full object-cover blur-md" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-slate-700 to-indigo-700/30" />
              </div>
            </SwiperSlide>
          </Swiper>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
            <p className="text-amber-400 uppercase tracking-[0.35em] text-sm font-bold mb-4 unveil">Multimedia Gallery</p>
            <h1 className="text-4xl md:text-6xl font-black  leading-tight max-w-4xl mx-auto text-white unveil">
              Explore our visual portfolio of photography, video, design, and digital campaigns.
            </h1>
            <p className="mt-6 text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed unveil">
              Every project is crafted with cinematic precision, bold storytelling, and polished delivery. Browse the gallery to see how we turn ideas into unforgettable visual experiences.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 unveil">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-slate-950 font-bold shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1"
              >
                Back to Home
                <ArrowRight size={18} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsWhatsAppFormOpen(true);
                  setContactError('');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-white font-bold transition-all duration-300 hover:bg-white/20"
              >
                <Mail size={18} />
                Book a Creative Session
              </button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 mt-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/gallery/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative overflow-hidden rounded-4xl border border-slate-200 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:blur-sm"
                    style={{ backgroundImage: `url(${category.bgImage})` }}
                  />
                  <div className="absolute inset-0 bg-slate-950/45 transition-colors duration-500 group-hover:bg-slate-950/55"></div>
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 rounded-2xl ${category.color} text-white shadow-lg`}>
                        <Icon size={32} />
                      </div>
                      <span className="bg-white/10 text-white/90 border border-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                        {category.projectCount} Projects
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-amber-400 mb-4 league-spartan">
                      {category.name}
                    </h2>
                    <p className="text-slate-200 leading-relaxed mr-12 mb-6">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-amber-600 font-semibold group-hover:text-amber-400 transition-colors">
                      <span>View Projects</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-br from-amber-500 to-amber-800 rounded-tl-[4rem] opacity-50 group-hover:opacity-30 transition-opacity"></div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-24 bg-blue-950 text-white rounded-[3rem] py-20 px-8 md:px-16 mx-6 md:mx-12 shadow-2xl shadow-slate-950/20">
          <div className="container mx-auto text-center unveil">
            <p className="text-indigo-300 uppercase tracking-[0.35em] text-sm font-bold mb-4">Still looking for inspiration?</p>
            <h2 className="text-4xl md:text-5xl font-black max-w-4xl mx-auto leading-tight">
              Let us design your next multimedia campaign with premium visuals and strategic impact.
            </h2>
            <p className="mt-6 text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
              From brand films to social media content and immersive websites, we produce work that stands out and converts.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsWhatsAppFormOpen(true);
                  setContactError('');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-4 py-4 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400"
              >
                <Mail size={18} />
                Start a Project
              </button>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-white font-semibold transition-all hover:bg-white/15"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </section>

        {isWhatsAppFormOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
            onClick={() => setIsWhatsAppFormOpen(false)}
          >
            <div
              className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden"
              onClick={(e: ClickEvent) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">Contact via WhatsApp</p>
                  <h2 className="text-2xl font-black text-slate-900">BOOK A SESSION NOW</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWhatsAppFormOpen(false)}
                  className="text-slate-500 hover:text-amber-700 font-bold"
                >
                  Close
                </button>
              </div>
              <form onSubmit={handleWhatsAppSubmit} className="p-6 space-y-6">
                {contactError && (
                  <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">
                    {contactError}
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-blue-700">Name</span>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e: InputEvent) => setContactName(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Your name"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-blue-700">Email</span>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e: InputEvent) => setContactEmail(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Your email"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-blue-700">Phone</span>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e: InputEvent) => setContactPhone(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Your phone number"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-blue-700">Service Category</span>
                    <select
                      value={selectedCategory}
                      onChange={(e: InputEvent) => setSelectedCategory(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    >
                      <option value="">Select a service...</option>
                      <option value="Photography">Photography</option>
                      <option value="Videography">Videography</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-semibold text-blue-700">Message</span>
                  <textarea
                    value={contactMessage}
                    onChange={(e: InputEvent) => setContactMessage(e.target.value)}
                    placeholder="Tell us about your project or ask a question"
                    required
                  />
                </label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm mr-12 text-slate-500">
                    When you submit, we'll open WhatsApp with your message ready to send.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex w-60 items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-white font-bold hover:bg-green-700 transition-all"
                  >
                    Send to WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;


