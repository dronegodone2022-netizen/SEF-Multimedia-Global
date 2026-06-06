import React, { useState } from 'react';
import { CheckCircle2, Users, Award, Heart, Mail, Phone, MapPin } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
const ph = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/1000/700`;
const Aboutbg = 'src/assests/Aboutbg.jpg';
const aboutBG = new URL('../src/assests/videograp.jpg', import.meta.url).href;
const team1 = 'src/assests/team1.jpg';
const team2 = 'src/assests/team2.jpg';
const team3 = 'src/assests/team3.jpg';
const clientLogo1 = new URL('../src/assests/LogoDesign12.jpg', import.meta.url).href;
const clientLogo2 = new URL('../src/assests/LogoDesign5.jpg', import.meta.url).href;
const clientLogo3 = new URL('../src/assests/LogoDesign8.jpg', import.meta.url).href;
const clientLogo4 = new URL('../src/assests/LogoDesign15.jpg', import.meta.url).href;
const clientLogo5 = new URL('../src/assests/LogoDesign3.jpg', import.meta.url).href;
const clientLogo6 = new URL('../src/assests/LogoDesign10.jpg', import.meta.url).href;
const clientLogo7 = new URL('../src/assests/LogoDesign17.jpg', import.meta.url).href;

const About: React.FC = () => {
  const highlights = [
    "Professional expertise across multiple creative fields.",
    "Cutting-edge equipment and modern techniques.",
    "A team that values creativity, precision, and detail.",
    "Customized solutions for individuals and businesses."
  ];

  const teamMembers = [
    {
      name: "Sylvester SEF Gbamoi",
      role: "CEO & Lead Photographer",
      image: team1,
      bio: "With over 12 years of experience, Sylvester leads our creative vision and specializes in portrait and fashion photography, graphic design, and brand strategy.",
      skills: ["Videography", "Video Editing", "Motion Graphics", "Photography", "Art Direction", "Brand Strategy"]
    },
    {
      name: "Bintu Gbamoi",
      role: "Managing Director & Finance",
      image: team2,
      bio: "Bintu oversees our operations and finances, ensuring smooth project execution and client satisfaction. She brings a wealth of experience in business management and client relations.",
      social: {"whatsapp": "https://wa.me/+23275510770",  "facebook": "https://www.facebook.com/bintu.gbamoi.5"},
    },
    {
      name: "Jestina N Y Fillie",
      role: "Client Manager",
      image: team3,
      bio: "Jestina is our dedicated client manager, ensuring that every project runs smoothly and that our clients are always in the loop, As a skilled communicator, she bridges the gap between our creative team and clients to deliver exceptional results.",
      social: {"whatsapp": "https://wa.me/+23275510770",  "facebook": "https://www.facebook.com/bintu.gbamoi.5"},
    }
  ];

  const trustedClients = [
    { name: "Premium Client 1", logo: clientLogo1 },
    { name: "Premium Client 2", logo: clientLogo2 },
    { name: "Premium Client 3", logo: clientLogo3 },
    { name: "Premium Client 4", logo: clientLogo4 },
    { name: "Premium Client 5", logo: clientLogo5 },
    { name: "Premium Client 6", logo: clientLogo6 },
    { name: "Premium Client 7", logo: clientLogo7 }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Excellence",
      description: "We are driven by a deep passion for creativity and storytelling, striving to deliver exceptional quality in every project we undertake."
    },
    {
      icon: Users,
      title: "Collaborative Spirit",
      description: "We believe in the power of collaboration, working closely with our clients and each other to bring ideas to life and create meaningful connections."
    },
    {
      icon: Award,
      title: "Innovation First",
      description: "We are committed to staying at the forefront of creative innovation, leveraging the latest technologies to deliver cutting-edge solutions that exceed expectations."
    }
  ];

  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');

  const handleWhatsAppSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim() || !contactMessage.trim()) {
      setContactError('All fields are required.');
      return;
    }

    const message = `Hello SEF Multimedia Global, I would like to discuss a project.\n\nName: ${contactName}\nEmail: ${contactEmail || 'N/A'}\nPhone: ${contactPhone || 'N/A'}\nMessage: ${contactMessage}`;
    const whatsappUrl = `https://wa.me/+23275510770?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setIsWhatsAppFormOpen(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
    setContactError('');
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={aboutBG}
              alt="About background"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-transparent"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-black text-white league-spartan mb-6 unveil">
                About <span className="text-amber-800">SEF Global</span>
              </h1>
              <p className="text-xl text-white leading-relaxed unveil">
                Over 10 years of digital excellence, crafting stories that inspire and connect.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative unveil-right">
                <div className="rounded-[60px] overflow-hidden shadow-2xl unveil-scale">
                  <img
                    src={Aboutbg}
                    alt="Our Team"
                    className="w-full h-125 object-cover"
                  />
                </div>

                <div className="absolute -bottom-10 -right-0 bg-amber-500 p-8 rounded-3xl shadow-2xl max-w-xs unveil">
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

              <div className="space-y-8 unveil-left">
                <div className="space-y-4">
                  <p className="text-indigo-600 font-bold tracking-widest uppercase unveil">About SEF Global</p>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 league-spartan leading-tight unveil">
                    Over <span className="text-amber-600">10 Years</span> of Digital Excellence.
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed unveil">
                      SEF Multimedia Global is a leading creative agency specializing in photography, videography, graphic design, and digital solutions. With over a decade of experience, we have built a reputation for delivering exceptional quality and storytelling excellence to clients worldwide.

                    <p className="mt-4 unveil">
                      Our team of passionate professionals is dedicated to bringing your vision to life through innovative and customized solutions. We work closely with individuals, businesses, and organizations to create compelling visuals and digital experiences that inspire, connect, and leave a lasting impact.

                    </p>

                    <p className="mt-4 unveil">
                      Whether you need compelling visuals, a strong digital presence, or complete creative support and Training, SEF Multimedia Global is committed to transforming your vision into reality.

                    </p>

                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 unveil">
                  {highlights.map((text, i) => (
                    <div key={i} className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl shadow-sm unveil">
                      <CheckCircle2 className="text-indigo-600 w-6 h-6 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium text-sm leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 bg-amber-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-indigo-600 font-bold tracking-widest uppercase mb-4">Our Values</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 league-spartan">What Drives Us</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="bg-white p-8 rounded-3xl shadow-lg text-center unveil">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="text-indigo-600 w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-indigo-600 font-bold tracking-widest uppercase mb-4">Meet Our Team</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 league-spartan">Creative Minds Behind the Magic</h2>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Our diverse team of passionate professionals brings together years of experience and creative expertise to deliver exceptional results.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {teamMembers.map((member, index) => (
                <article
                  key={index}
                  className="rounded-3xl group relative overflow-hidden border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-500 via-indigo-600 to-cyan-500"></div>
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/75 to-transparent px-6 py-4 text-white">
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-200">{member.role}</p>
                      <h3 className="mt-2 text-2xl font-bold">{member.name}</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-slate-600 mb-6 leading-relaxed min-h-27.5">{member.bio}</p>
                    {member.skills && (
                      <div className="mb-6 flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {member.social?.whatsapp && (
                        <a
                          href={member.social.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
                        >
                          WhatsApp
                        </a>
                      )}
                      {member.social?.facebook && (
                        <a
                          href={member.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Clients */}
        <section className="py-24 bg-slate-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-indigo-600 font-bold tracking-widest uppercase mb-4">Trusted By</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 league-spartan">Our Valued Clients</h2>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">We're proud to have worked with amazing clients across various industries, helping them tell their stories through our creative services.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {trustedClients.map((client, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center unveil">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-28 md:max-h-32 w-auto object-contain grayscale hover:grayscale-0 transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 bg-amber-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black league-spartan mb-6 unveil">Ready to Work Together?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto unveil">
              Let's discuss your next project and bring your creative vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center unveil">
              <button
                type="button"
                onClick={() => {
                  setIsWhatsAppFormOpen(true);
                  setContactError('');
                }}
                className="flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
              >
                <Mail size={20} />
                Get In Touch
              </button>
              <a href="tel:+23275510770" className="flex items-center gap-2 bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-800 transition-colors">
                <Phone size={20} />
                Call Us
              </a>
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">Contact via WhatsApp</p>
                  <h2 className="text-2xl font-black text-slate-900">Send a message directly to WhatsApp</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWhatsAppFormOpen(false)}
                  className="text-slate-500 hover:text-amber-700 font-bold transition-colors duration-300"
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
                    <span className="text-sm font-semibold text-slate-700">Name</span>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Your name"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Email</span>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Your email"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Phone</span>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Your phone number"
                      required
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Message</span>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="mt-2 w-full min-h-40 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Tell us about your project or ask a question"
                    required
                  />
                </label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm  text-slate-500 mr-6 unveil">
                    When you submit, we'll open WhatsApp with your message ready to send.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex w-50 items-center justify-center rounded-full bg-green-600 px-4 py-2.5 text-white font-bold hover:bg-green-800 transition-all"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default About;
