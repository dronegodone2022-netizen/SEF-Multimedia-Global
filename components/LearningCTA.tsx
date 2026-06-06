
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Star, Users, Award } from 'lucide-react';
const computer = 'src/assests/computer.jpg';

const CounterStat: React.FC<{ end: number; duration?: number; suffix?: string; label: string }> = ({ end, duration = 2000, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(progress * end);
      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [hasStarted, end, duration]);

  return (
    <div className="space-y-2 unveil" ref={ref}>
      <div className="text-3xl font-bold text-white league-spartan">
        {count}{suffix}
      </div>
      <p className="text-sm text-amber-400 uppercase tracking-wider font-bold">{label}</p>
    </div>
  );
};

const LearningCTA: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-bold tracking-wide uppercase border border-indigo-500/20">
              <GraduationCap size={18} />
              New: SEF Academy
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white league-spartan leading-tight unveil">
              Don't Just Hire Us. <br />
              <span className="text-indigo-500">Learn From Us.</span>
            </h2>
            
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl unveil">
              We're opening our studio doors to share our professional secrets. Join our masterclasses and gain the skills to create world-class content yourself.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 py-4 unveil">
              <CounterStat end={15} suffix="+" label="Expert Mentors" />
              <CounterStat end={700} suffix="+" label="Students" />
              <CounterStat end={98} suffix="%" label="Success Rate" />
              <CounterStat end={500} suffix="+" label="Projects Completed" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 unveil">
              <Link 
                to="/courses" 
                className="w-full sm:w-auto bg-indigo-600 hover:bg-orange-500 hover:transform hover:scale-105 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-900/20"
              >
                Explore Courses
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="relative unveil-right">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-amber-500 transition-colors group unveil">
                  <div className="bg-indigo-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Star size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Pro Techniques</h4>
                  <p className="text-slate-500 text-sm">Learn industry-standard workflows used by top pros.</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-amber-500 transition-colors group unveil">
                  <div className="bg-indigo-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Users size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Community</h4>
                  <p className="text-slate-500 text-sm">Join a network of creative minds and collaborators.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-amber-500 transition-colors group unveil">
                  <div className="bg-indigo-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Award size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Certification</h4>
                  <p className="text-slate-500 text-sm">Get recognized for your skills with our certificates.</p>
                </div>
                <div className="rounded-3xl overflow-hidden h-64 shadow-2xl unveil-scale">
                  <img src={computer} alt="Learning" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningCTA;
