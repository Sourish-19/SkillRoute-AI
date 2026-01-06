
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BlurText from './BlurText';
import CurvedLoop from './CurvedLoop';
import Hyperspeed from './Hyperspeed';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hyperspeedOptions = useMemo(() => ({
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 1.2,
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0x10b981, 0x059669, 0x047857],
      rightCars: [0x3b82f6, 0x2563eb, 0x1d4ed8],
      sticks: 0x10b981,
    }
  }), []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30 relative">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <Hyperspeed effectOptions={hyperspeedOptions} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_90%)]" />
      </div>

      <div className="relative z-10">
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
          <motion.nav 
            initial={false}
            animate={{ 
              width: isScrolled ? 'auto' : '100%',
              maxWidth: isScrolled ? '600px' : '1280px',
              y: isScrolled ? 20 : 0,
              paddingLeft: isScrolled ? '1.5rem' : '2rem',
              paddingRight: isScrolled ? '1.5rem' : '2rem',
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`pointer-events-auto h-16 md:h-20 flex items-center justify-between border-b transition-all duration-500 overflow-hidden ${
              isScrolled 
                ? 'bg-zinc-900/80 border-emerald-500/30 rounded-full backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                : 'bg-transparent border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 cursor-target">
              <motion.div 
                animate={{ 
                  scale: isScrolled ? 0.85 : 1,
                  rotate: isScrolled ? 360 : 0
                }}
                className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-black shadow-lg"
              >
                S
              </motion.div>
              <AnimatePresence mode="popLayout">
                {!isScrolled && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-xl font-bold tracking-tight"
                  >
                    SkillRoute <span className="text-emerald-500">AI</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={onStart} 
                className={`cursor-target text-sm font-medium transition-colors ${
                  isScrolled ? 'text-zinc-400 hover:text-white px-2' : 'text-zinc-300 hover:text-white'
                }`}
              >
                Log in
              </button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  scale: isScrolled ? 0.9 : 1,
                }}
                onClick={onStart} 
                className="cursor-target bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-full md:rounded-xl transition-all shadow-lg shadow-white/10 whitespace-nowrap"
              >
                {isScrolled ? 'Join' : 'Sign Up'}
              </motion.button>
            </div>
          </motion.nav>
        </div>

        <section className="max-w-7xl mx-auto px-6 pt-48 pb-40 min-h-[90vh] flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto space-y-10 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4"
            >
              ✨ The Future of Career Guidance
            </motion.div>
            
            <BlurText
              text="The Career Navigation Engine for Tier-2 & Tier-3 Students."
              delay={50}
              animateBy="words"
              direction="top"
              className="text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-center justify-center drop-shadow-2xl"
            />

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto mt-6"
            >
              Personalized learning, local job matching, and mentorship to launch your career, regardless of your location or infrastructure constraints.
            </motion.p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 50px rgba(16,185,129,0.5)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={onStart}
                className="cursor-target px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg rounded-2xl transition-colors shadow-[0_0_40px_rgba(16,185,129,0.3)] relative overflow-hidden group"
              >
                <span className="relative z-10">Sign Up for Free</span>
                <motion.div 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-0"
                />
              </motion.button>
            </div>
          </div>
        </section>

        <div className="relative border-y border-white/5 bg-[#09090b]/20 backdrop-blur-sm overflow-hidden">
          <CurvedLoop 
            marqueeText="✦ NAVIGATE YOUR CAREER ✦ LOCAL OPPORTUNITIES ✦ SKILLROUTE AI ✦ BREAKING BARRIERS ✦ EMPOWERING TIER-2 & TIER-3 ✦"
            speed={1.2}
            curveAmount={180}
            className="font-black fill-emerald-500/15"
          />
        </div>

        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 flex flex-col items-center">
              <BlurText
                text="Key Features"
                delay={100}
                animateBy="letters"
                direction="bottom"
                className="text-3xl font-bold mb-4 justify-center"
              />
              <div className="w-12 h-1 bg-emerald-500 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon="📖" 
                title="Personalized Learning Modules" 
                desc="Tailored curriculum that respects your time and accessibility." 
              />
              <FeatureCard 
                icon="📍" 
                title="Local Opportunity Feed" 
                desc="Real-world projects and roles matched to your immediate vicinity." 
              />
              <FeatureCard 
                icon="🤝" 
                title="Mentorship Network" 
                desc="Direct access to experts who understand your unique journey." 
              />
              <FeatureCard 
                icon="📈" 
                title="Career Growth Forecasting" 
                desc="Visualize your path from learning to full-time employment." 
              />
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#09090b]/40 backdrop-blur-sm border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <BlurText
              text="How It Works"
              delay={100}
              animateBy="words"
              direction="top"
              className="text-3xl font-bold mb-20 justify-center"
            />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
              <div className="flex-1 w-full">
                <StepItem 
                  number={1} 
                  title="Assess Your Skills" 
                  desc="Complete a holistic profile analysis including skills, location, and connectivity." 
                  color="border-emerald-500/30 bg-emerald-500/10" 
                />
              </div>
              <div className="hidden md:block text-zinc-700 text-3xl font-light shrink-0">→</div>
              <div className="flex-1 w-full">
                <StepItem 
                  number={2} 
                  title="Follow Your Roadmap" 
                  desc="Follow your AI-generated weekly plan designed for consistent, micro-progress." 
                />
              </div>
              <div className="hidden md:block text-zinc-700 text-3xl font-light shrink-0">→</div>
              <div className="flex-1 w-full">
                <StepItem 
                  number={3} 
                  title="Launch Your Career" 
                  desc="Connect with local businesses and launch your career in your own community." 
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <BlurText
              text="Testimonials"
              delay={100}
              animateBy="letters"
              direction="bottom"
              className="text-3xl font-bold mb-16 justify-center"
            />
            <div className="grid md:grid-cols-2 gap-8">
              <TestimonialCard 
                name="Anya" 
                role="Student" 
                text="SkillRoute helped me find an internship right in my hometown. I didn't think I could start my tech career without moving to a big city." 
                img="https://picsum.photos/80/80?1"
              />
              <TestimonialCard 
                name="Rani" 
                role="Mentor" 
                text="The AI mapping is incredible. It provides students with a realistic yet ambitious roadmap that actually works." 
                img="https://picsum.photos/80/80?2"
              />
            </div>
          </div>
        </section>

        <footer className="bg-[#09090b]/80 backdrop-blur-xl pt-20 pb-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-4">
               <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center font-bold text-black text-sm">S</div>
                <span className="text-lg font-bold tracking-tight text-white">SkillRoute <span className="text-emerald-500">AI</span></span>
              </div>
              <p className="text-zinc-500 max-w-sm">Empowering students in Tier-2 and Tier-3 cities with AI-driven career guidance and local opportunities.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-zinc-100">About</h4>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li><a href="#" className="cursor-target hover:text-emerald-500 transition-colors">About Us</a></li>
                <li><a href="#" className="cursor-target hover:text-emerald-500 transition-colors">Company</a></li>
                <li><a href="#" className="cursor-target hover:text-emerald-500 transition-colors">Careers</a></li>
                <li><a href="#" className="cursor-target hover:text-emerald-500 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-zinc-100">Contact</h4>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li className="cursor-target hover:text-emerald-500">Contact Us</li>
                <li className="cursor-target hover:text-emerald-500">Privacy Policy</li>
                <li className="cursor-target hover:text-emerald-500">Sitemap</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-zinc-700">© 2025 SkillRoute AI. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="cursor-target p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-zinc-800/50 group">
    <div className="text-3xl mb-6 bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-lg mb-3 leading-snug">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StepItem: React.FC<{ number: number; title: string; desc: string; color?: string }> = ({ number, title, desc, color }) => (
  <div className={`cursor-target p-8 rounded-3xl border h-full ${color || 'border-white/5 bg-zinc-900/30 backdrop-blur-md'} text-left space-y-4 hover:scale-[1.02] transition-transform flex flex-col justify-center`}>
    <div className="text-emerald-500 text-sm font-bold tracking-widest leading-tight">{number}. {title.toUpperCase()}</div>
    <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const TestimonialCard: React.FC<{ name: string; role: string; text: string; img: string }> = ({ name, role, text, img }) => (
  <div className="cursor-target bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 flex gap-6 hover:bg-zinc-800/60 transition-colors">
    <img src={img} alt={name} className="w-16 h-16 rounded-full border-2 border-zinc-800 shrink-0" />
    <div className="space-y-4">
      <p className="text-zinc-400 italic text-sm leading-relaxed">"{text}"</p>
      <div>
        <div className="font-bold text-zinc-100">{name}</div>
        <div className="text-emerald-500 text-xs font-medium uppercase tracking-widest">{role}</div>
      </div>
    </div>
  </div>
);
