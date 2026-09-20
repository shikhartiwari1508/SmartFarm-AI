import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, Brain, Droplets, Sun, Shield, Users, 
  ChevronRight, ArrowRight, Star, Zap, CheckCircle, 
  Sprout, Cloud, MessageSquare, Bug, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden selection:bg-green-500/30 selection:text-green-200">
      
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/80 backdrop-blur-lg shadow-lg border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-xl">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
                SmartFarm AI
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-green-400 transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-green-400 transition-colors">How it Works</button>
              <button onClick={() => scrollToSection('team')} className="text-gray-300 hover:text-green-400 transition-colors">Team</button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/40"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-400">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-400">How it Works</button>
              <button onClick={() => scrollToSection('team')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-400">Team</button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="block w-full text-center mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -z-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-xl">🏆</span>
                <span className="text-sm font-medium text-gray-300">Hackathon 2026 | Team Tech Force</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
                  <span className="block text-white">SmartFarm AI</span>
                  <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 pb-2">
                    AI-Powered Agriculture
                  </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                  Helping farmers make smarter decisions through AI, soil intelligence, weather insights and crop health analysis.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/40 flex items-center gap-2 group"
                >
                  Get Started 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all backdrop-blur-sm"
                >
                  Explore Features
                </button>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {['🤖 AI Powered', '🌱 ML Ready', '👨‍🌾 Farmer Friendly', '📊 Data Driven'].map((badge) => (
                  <span key={badge} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm font-medium text-gray-300">
                    {badge}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white">10+</div>
                  <div className="text-sm text-gray-400 mt-1">Crops Analyzed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">6</div>
                  <div className="text-sm text-gray-400 mt-1">AI Modules</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">2</div>
                  <div className="text-sm text-gray-400 mt-1">Team Members</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent rounded-3xl backdrop-blur-sm border border-white/10 transform rotate-3"></div>
              <div className="relative bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <svg viewBox="0 0 400 300" className="w-full h-auto text-green-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                   {/* Decorative abstract farm illustration */}
                   <path d="M 0,250 C 100,200 200,300 400,220 L 400,300 L 0,300 Z" opacity="0.2" fill="currentColor"/>
                   <path d="M 0,270 C 150,220 250,280 400,250 L 400,300 L 0,300 Z" opacity="0.4" fill="currentColor"/>
                   <rect x="50" y="240" width="10" height="40" rx="5" fill="#4ade80" />
                   <rect x="70" y="250" width="10" height="30" rx="5" fill="#4ade80" />
                   <rect x="150" y="220" width="10" height="60" rx="5" fill="#4ade80" />
                   <rect x="170" y="235" width="10" height="45" rx="5" fill="#4ade80" />
                   <rect x="250" y="255" width="10" height="25" rx="5" fill="#4ade80" />
                   <circle cx="320" cy="100" r="40" fill="#fef08a" opacity="0.8"/>
                   <path d="M 280,180 Q 320,120 360,180" stroke="#4ade80" strokeWidth="4" fill="none" opacity="0.5"/>
                   <path d="M 100,100 Q 150,50 200,100" stroke="#4ade80" strokeWidth="4" fill="none" opacity="0.5" strokeDasharray="5,5"/>
                </svg>
                <div className="absolute top-4 right-4 bg-gray-950/80 backdrop-blur border border-white/10 p-4 rounded-xl flex items-center gap-4">
                   <div className="bg-green-500/20 p-2 rounded-lg"><Brain className="text-green-400 w-6 h-6" /></div>
                   <div>
                     <div className="text-xs text-gray-400">AI Analysis</div>
                     <div className="text-sm font-bold text-green-400">98% Accuracy</div>
                   </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-20 bg-gray-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Challenges We Solve</h2>
            <p className="text-gray-400 text-lg">Traditional farming faces numerous uncertainties. We bring data and AI to solve real-world problems.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📉', title: 'Wrong Crop Selection', desc: 'Choosing the wrong crop for your soil leads to devastating losses.' },
              { icon: '🥀', title: 'Late Disease Detection', desc: 'No access to early disease diagnosis ruins entire harvests.' },
              { icon: '💧', title: 'Inefficient Water Use', desc: 'Over or under watering damages crops and wastes resources.' },
              { icon: '📵', title: 'Lack of Tech Support', desc: 'Farmers lack accessible, easy-to-use technology in their hands.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-gray-900 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Comprehensive AI Tools</h2>
            <p className="text-gray-400 text-lg">Everything you need to manage your farm efficiently in one unified platform.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'recommend', icon: Sprout, color: 'text-green-400', bg: 'bg-green-400/10', title: 'Crop Recommendation', desc: 'AI suggests the best crops based on NPK values, pH, and climate.', route: '/recommend' },
              { id: 'disease', icon: Bug, color: 'text-red-400', bg: 'bg-red-400/10', title: 'Disease Detection', desc: 'Upload a leaf photo and instantly identify diseases and cures.', route: '/disease' },
              { id: 'irrigation', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Smart Irrigation', desc: 'Get precise watering schedules based on soil and weather data.', route: '/irrigation' },
              { id: 'weather', icon: Cloud, color: 'text-sky-400', bg: 'bg-sky-400/10', title: 'Weather Intelligence', desc: 'Hyper-local weather forecasts tailored to agricultural needs.', route: '/weather' },
              { id: 'insights', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'AI Insights', desc: 'Deep learning models analyze trends to maximize your yield.', route: '/insights' },
              { id: 'assistant', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'SmartFarm Assistant', desc: '24/7 AI chatbot to answer all your farming queries instantly.', route: '/assistant' },
            ].map((feature) => (
              <div key={feature.id} className="group relative bg-gray-950 border border-white/10 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-8">{feature.desc}</p>
                <button 
                  onClick={() => navigate(feature.route)}
                  className="flex items-center text-sm font-semibold text-white group/btn"
                >
                  <span className="border-b border-transparent group-hover/btn:border-green-400 transition-colors">Try Now</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:text-green-400 transition-all" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400">Four simple steps to transform your farming</p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-green-900 via-green-500 to-green-900 -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-4 gap-12 relative z-10">
              {[
                { step: '01', title: 'Enter Data', desc: 'Input your soil NPK, pH, or upload a leaf photo.' },
                { step: '02', title: 'AI Analysis', desc: 'Our ML models process your data instantly.' },
                { step: '03', title: 'Get Insights', desc: 'Receive tailored recommendations & diagnosis.' },
                { step: '04', title: 'Act & Improve', desc: 'Apply insights to increase your crop yield.' }
              ].map((item, idx) => (
                <div key={idx} className="relative text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-900 border-2 border-green-500 rounded-full flex items-center justify-center text-xl font-bold text-green-400 mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS & TECH STACK */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <div className="bg-gray-950/50 backdrop-blur p-8 rounded-3xl border border-white/5">
              <Users className="w-10 h-10 text-green-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">For Farmers</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Simple, intuitive interface</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Practical, actionable advice</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Reduced input costs</li>
              </ul>
            </div>
            <div className="bg-gray-950/50 backdrop-blur p-8 rounded-3xl border border-white/5">
              <Zap className="w-10 h-10 text-yellow-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">For Agriculture</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Data-driven decisions</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Higher crop yields</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Early disease prevention</li>
              </ul>
            </div>
            <div className="bg-gray-950/50 backdrop-blur p-8 rounded-3xl border border-white/5">
              <Leaf className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">For Environment</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Water conservation</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Optimized fertilizer use</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Sustainable practices</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Powered by Modern Technology</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['React', 'FastAPI', 'Python', 'Machine Learning', 'TensorFlow', 'SQLAlchemy', 'TailwindCSS'].map((tech) => (
                <span key={tech} className="px-6 py-3 bg-gray-950 border border-white/10 rounded-full text-gray-300 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-24 bg-gray-950 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <Star className="w-4 h-4" /> <span>Hackathon Team</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">Team Tech Force 🏆</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Member 1 */}
            <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-6 p-1">
                <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍💻</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Member 1</h3>
              <p className="text-green-400 mb-4">Frontend & ML</p>
            </div>
            
            {/* Member 2 */}
            <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-6 p-1">
                <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👩‍💻</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Member 2</h3>
              <p className="text-green-400 mb-4">Backend & DB</p>
            </div>
          </div>
          <p className="mt-12 text-gray-400 text-lg flex items-center justify-center gap-2">
            Built with <span className="text-red-500">❤️</span> for Indian Farmers
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-emerald-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Transform Your Farm?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join the agricultural revolution. Leverage AI to make smarter decisions and increase your yield today.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white text-green-900 hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Start Using SmartFarm AI
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-500 p-1.5 rounded-lg">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SmartFarm AI</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Empowering farmers with Artificial Intelligence for smarter, more sustainable, and profitable agriculture.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/recommend')} className="text-gray-400 hover:text-green-400">Crop Recommendation</button></li>
                <li><button onClick={() => navigate('/disease')} className="text-gray-400 hover:text-green-400">Disease Detection</button></li>
                <li><button onClick={() => navigate('/irrigation')} className="text-gray-400 hover:text-green-400">Smart Irrigation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Project</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('team')} className="text-gray-400 hover:text-green-400">About Team</button></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400">GitHub Repo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400">Hackathon Page</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              &copy; 2026 SmartFarm AI | Team Tech Force
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-gray-500">
              <span>Made for Hackathon 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
