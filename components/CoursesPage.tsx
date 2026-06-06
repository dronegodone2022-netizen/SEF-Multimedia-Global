
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart, ArrowRight, MessageSquare, Plus, Minus, X } from 'lucide-react';
import { COURSES, LEARNING_FAQS } from '../constants';
import Header from './Header';
import Footer from './Footer';
const computer = new URL('../src/assests/computer.jpg', import.meta.url).href;

const CoursesPage: React.FC = () => {
  const [enrolledCourse, setEnrolledCourse] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const [isConsultantFormOpen, setIsConsultantFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [consultantFormData, setConsultantFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formError, setFormError] = useState('');
  const [consultantFormError, setConsultantFormError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEnroll = (courseTitle: string) => {
    setSelectedCourse(courseTitle);
    setIsEnrollFormOpen(true);
    setFormError('');
  };

  const handleConsultantChat = () => {
    setIsConsultantFormOpen(true);
    setConsultantFormError('');
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFormError('All fields are required.');
      return;
    }

    const message = `Hello SEF Multimedia Global, I would like to enroll in the "${selectedCourse}" course.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nPlease provide more details.`;
    const whatsappUrl = `https://wa.me/+23275510770?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setIsEnrollFormOpen(false);
    setFormData({ name: '', email: '', phone: '' });
    setFormError('');
  };

  const handleConsultantFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!consultantFormData.name.trim() || !consultantFormData.email.trim() || !consultantFormData.phone.trim()) {
      setConsultantFormError('Name, email, and phone are required.');
      return;
    }

    const message = `Hello SEF Multimedia Global, I would like to chat with a consultant.\n\nName: ${consultantFormData.name}\nEmail: ${consultantFormData.email}\nPhone: ${consultantFormData.phone}\n\nMessage: ${consultantFormData.message || 'Please provide career guidance and course recommendations.'}`;
    const whatsappUrl = `https://wa.me/+23275510770?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setIsConsultantFormOpen(false);
    setConsultantFormData({ name: '', email: '', phone: '', message: '' });
    setConsultantFormError('');
  };

  return (
    <div className="min-h-screen bg-slate-200">
      <Header />
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-6">
          {/* Hero Section with Background */}
          <section className="relative rounded-3xl overflow-hidden mb-24">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={computer}
                alt="Courses background"
                className="w-full h-full object-cover scale-105 blur-4xl opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-700 to-indigo-900/30"></div>
            </div>
            <div className="relative z-10 py-24 px-6 md:px-12">
              <div className="max-w-3xl">
                <p className="text-amber-300 font-bold tracking-widest uppercase mb-4">Learning Center</p>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 league-spartan leading-tight">
                  Master New <span className="text-amber-400">Creative Skills</span>
                </h1>
                <p className="text-xl text-slate-200 leading-relaxed">
                  Join our professional training programs designed to take you from beginner to pro in <span className="text-amber-500">photography,</span>  videography, <span className="text-amber-500 text-bol">Graphic design</span>, and Web development.
                </p>
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-2 gap-8 mb-24">
            {COURSES.map((course) => (
              <div 
                key={course.id} 
                className="bg-amber-300 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="md:w-2/5 relative overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="md:w-3/5 p-8 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-indigo-500 text-sm font-medium">
                      <Clock size={16} className="text-indigo-700" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-500 text-sm font-medium">
                      <BarChart size={16} className="text-indigo-700" />
                      {course.level}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3 league-spartan group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="text-3xl font-black text-slate-900 league-spartan">
                      {course.price}
                    </div>
                    <button 
                      onClick={() => handleEnroll(course.title)}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                    >
                      Enroll Now
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Learning FAQ Section */}
          <div className="max-w-4xl mx-auto mb-24">
            <div className="text-center mb-12 unveil">
              <h2 className="text-4xl font-black text-blue-700 mb-4 league-spartan"> FAQs</h2>
              <p className="text-slate-600">Common questions about our professional training programs.</p>
            </div>
            
            <div className="space-y-4 unveil">
              {LEARNING_FAQS.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl border border-amber-200 overflow-hidden transition-all duration-300"
                >
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-amber-50 transition-colors"
                  >
                    <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                    <div className={`text-indigo-600 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                      {openFaqIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>
                  
                  <div className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 py-6 border-t border-slate-50' : 'max-h-0'}`}>
                    <p className="text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-24 bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden unveil">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-4xl font-black mb-6 text-amber-400">Ready to start your journey?</h2>
              <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
                Not sure which course is right for you? Talk to our learning consultants for a free career guidance session.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleConsultantChat}
                  className="w-full sm:w-auto bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <MessageSquare size={20} />
                  Chat with a Consultant
                </button>
                <Link 
                  to="/" 
                  className="w-full sm:w-auto bg-indigo-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-400 transition-all flex items-center justify-center gap-2"
                >
                  Explore Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Enrollment Form Modal */}
      {isEnrollFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Enroll in Course</h3>
              <button
                onClick={() => setIsEnrollFormOpen(false)}
                title="Close enrollment form"
                className="text-indigo-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Course</label>
                <input
                  type="text"
                  value={selectedCourse}
                  readOnly
                  title="Selected course"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-amber-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-amber-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-amber-400"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {formError && (
                <p className="text-red-600 text-sm">{formError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} />
                Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Consultant Chat Form Modal */}
      {isConsultantFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Chat with a Consultant</h3>
              <button
                onClick={() => setIsConsultantFormOpen(false)}
                title="Close consultant form"
                className="text-indigo-400 hover:text-indigo-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleConsultantFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={consultantFormData.name}
                  onChange={(e) => setConsultantFormData({ ...consultantFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={consultantFormData.email}
                  onChange={(e) => setConsultantFormData({ ...consultantFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={consultantFormData.phone}
                  onChange={(e) => setConsultantFormData({ ...consultantFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-400"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message (Optional)</label>
                <textarea
                  value={consultantFormData.message}
                  onChange={(e) => setConsultantFormData({ ...consultantFormData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-400 resize-none"
                  placeholder="Tell us about your goals or questions..."
                  rows={3}
                />
              </div>

              {consultantFormError && (
                <p className="text-red-600 text-sm">{consultantFormError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} />
                Start Chat via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;


