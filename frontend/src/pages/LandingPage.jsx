import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import {
  Leaf, Brain, Droplets, Sun, Shield, Users,
  ChevronRight, ArrowRight, Star, Zap, CheckCircle,
  Sprout, Cloud, MessageSquare, Bug, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
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
            <div className="hidden md:flex items-center space-x-5"><LanguageSwitcher />
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-green-400 transition-colors">{t("Features", "सुविधाएँ")}</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-green-400 transition-colors">{t("How it Works", "यह कैसे काम करता है")}</button>

              <button
                onClick={() => navigate('/dashboard')}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/40"
              >
                {t("Get Started", "शुरू करें")}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3"><LanguageSwitcher compact />
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
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-400">{t("Features", "सुविधाएँ")}</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-400">{t("How it Works", "यह कैसे काम करता है")}</button>

              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full text-center mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                {t("Get Started", "शुरू करें")}
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
                <span className="text-sm font-medium text-gray-300">{t("AI-powered farming assistant", "AI आधारित खेती सहायक")}</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
                  <span className="block text-white">SmartFarm AI</span>
                  <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 pb-2">
                    {t("AI-Powered Agriculture", "AI आधारित कृषि")}
                  </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                  {t("Helping farmers make smarter decisions through AI, soil intelligence, weather insights and crop health analysis.", "AI, मिट्टी की जानकारी, मौसम और फसल स्वास्थ्य विश्लेषण की मदद से किसानों को बेहतर निर्णय लेने में सहायता।")}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/40 flex items-center gap-2 group"
                >
                  {t("Get Started", "शुरू करें")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all backdrop-blur-sm"
                >
                  {t("Explore Features", "सुविधाएँ देखें")}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {(language === 'hi' ? ['🤖 AI आधारित', '🌱 ML तैयार', '👨‍🌾 किसान-अनुकूल', '📊 डेटा आधारित'] : ['🤖 AI Powered', '🌱 ML Ready', '👨‍🌾 Farmer Friendly', '📊 Data Driven']).map((badge) => (
                  <span key={badge} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm font-medium text-gray-300">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white">10+</div>
                  <div className="text-sm text-gray-400 mt-1">{t("Crops Analyzed", "विश्लेषित फसलें")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">6</div>
                  <div className="text-sm text-gray-400 mt-1">{t("AI Modules", "AI मॉड्यूल")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400 mt-1">{t("Farming Support", "खेती में सहायता")}</div>
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
                     <div className="text-xs text-gray-400">{t('AI Analysis', 'AI विश्लेषण')}</div>
                     <div className="text-sm font-bold text-green-400">{t('98% Accuracy', '98% सटीकता')}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("The Challenges We Solve", "हम जिन समस्याओं का समाधान करते हैं")}</h2>
            <p className="text-gray-400 text-lg">{t("Traditional farming faces numerous uncertainties. We bring data and AI to solve real-world problems.", "खेती में कई अनिश्चितताएँ होती हैं। हम वास्तविक समस्याओं के समाधान के लिए डेटा और AI का उपयोग करते हैं।")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📉', title: 'Wrong Crop Selection', titleHi: 'गलत फसल का चुनाव', desc: 'Choosing the wrong crop for your soil leads to devastating losses.', descHi: 'मिट्टी के अनुसार गलत फसल चुनने से बड़ा नुकसान हो सकता है।' },
              { icon: '🥀', title: 'Late Disease Detection', titleHi: 'रोग की देर से पहचान', desc: 'No access to early disease diagnosis ruins entire harvests.', descHi: 'समय पर रोग की पहचान न होने से पूरी फसल खराब हो सकती है।' },
              { icon: '💧', title: 'Inefficient Water Use', titleHi: 'पानी का गलत उपयोग', desc: 'Over or under watering damages crops and wastes resources.', descHi: 'कम या ज़्यादा पानी फसल को नुकसान पहुँचाता है और संसाधन बर्बाद करता है।' },
              { icon: '📵', title: 'Lack of Tech Support', titleHi: 'तकनीकी सहायता की कमी', desc: 'Farmers lack accessible, easy-to-use technology in their hands.', descHi: 'किसानों को आसान और सुलभ तकनीकी साधन नहीं मिल पाते।' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{language === 'hi' ? item.titleHi : item.title}</h3>
                <p className="text-gray-400">{language === 'hi' ? item.descHi : item.desc}</p>
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
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t("Comprehensive AI Tools", "उपयोगी AI टूल")}</h2>
            <p className="text-gray-400 text-lg">{t("Everything you need to manage your farm efficiently in one unified platform.", "खेती का बेहतर प्रबंधन करने के लिए आवश्यक सुविधाएँ एक ही प्लेटफ़ॉर्म पर।")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'recommend', icon: Sprout, color: 'text-green-400', bg: 'bg-green-400/10', title: 'Crop Recommendation', titleHi: 'फसल की सलाह', desc: 'AI suggests the best crops based on NPK values, pH, and climate.', descHi: 'NPK, pH और मौसम के आधार पर AI बेहतर फसल सुझाता है।', route: '/recommend' },
              { id: 'disease', icon: Bug, color: 'text-red-400', bg: 'bg-red-400/10', title: 'Disease Detection', titleHi: 'रोग की पहचान', desc: 'Upload a leaf photo and instantly identify diseases and cures.', descHi: 'पत्ते की फोटो अपलोड करके रोग और उसके उपाय जानें।', route: '/disease' },
              { id: 'irrigation', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Smart Irrigation', titleHi: 'स्मार्ट सिंचाई', desc: 'Get precise watering schedules based on soil and weather data.', descHi: 'मिट्टी और मौसम के अनुसार सिंचाई का समय जानें।', route: '/irrigation' },
              { id: 'weather', icon: Cloud, color: 'text-sky-400', bg: 'bg-sky-400/10', title: 'Weather Intelligence', titleHi: 'मौसम की जानकारी', desc: 'Hyper-local weather forecasts tailored to agricultural needs.', descHi: 'खेती के लिए स्थान के अनुसार मौसम पूर्वानुमान पाएँ।', route: '/weather' },
              { id: 'insights', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'AI Insights', titleHi: 'AI खेती विश्लेषण', desc: 'Deep learning models analyze trends to maximize your yield.', descHi: 'AI रुझानों का विश्लेषण करके पैदावार बढ़ाने में मदद करता है।', route: '/insights' },
              { id: 'assistant', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'SmartFarm Assistant', titleHi: 'SmartFarm खेती सहायक', desc: '24/7 AI chatbot to answer all your farming queries instantly.', descHi: 'खेती से जुड़े सवालों के तुरंत जवाब देने वाला AI चैटबॉट।', route: '/assistant' },
            ].map((feature) => (
              <div key={feature.id} className="group relative bg-gray-950 border border-white/10 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{language === 'hi' ? feature.titleHi : feature.title}</h3>
                <p className="text-gray-400 mb-8">{language === 'hi' ? feature.descHi : feature.desc}</p>
                <button
                  onClick={() => navigate(feature.route)}
                  className="flex items-center text-sm font-semibold text-white group/btn"
                >
                  <span className="border-b border-transparent group-hover/btn:border-green-400 transition-colors">{t('Try Now', 'अभी इस्तेमाल करें')}</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("How It Works", "यह कैसे काम करता है")}</h2>
            <p className="text-gray-400">{t("Four simple steps to transform your farming", "खेती को बेहतर बनाने के चार आसान चरण")}</p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-green-900 via-green-500 to-green-900 -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-4 gap-12 relative z-10">
              {[
                { step: '01', title: 'Enter Data', titleHi: 'जानकारी भरें', desc: 'Input your soil NPK, pH, or upload a leaf photo.', descHi: 'मिट्टी का NPK, pH भरें या पत्ते की फोटो अपलोड करें।' },
                { step: '02', title: 'AI Analysis', titleHi: 'AI विश्लेषण', desc: 'Our ML models process your data instantly.', descHi: 'हमारे ML मॉडल तुरंत आपके डेटा का विश्लेषण करते हैं।' },
                { step: '03', title: 'Get Insights', titleHi: 'सलाह पाएँ', desc: 'Receive tailored recommendations & diagnosis.', descHi: 'अपने खेत के अनुसार सलाह और रोग की जाँच पाएँ।' },
                { step: '04', title: 'Act & Improve', titleHi: 'सुधार के कदम उठाएँ', desc: 'Apply insights to increase your crop yield.', descHi: 'पैदावार बढ़ाने के लिए सलाह अपनाएँ।' }
              ].map((item, idx) => (
                <div key={idx} className="relative text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-900 border-2 border-green-500 rounded-full flex items-center justify-center text-xl font-bold text-green-400 mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{language === 'hi' ? item.titleHi : item.title}</h3>
                  <p className="text-gray-400 text-sm">{language === 'hi' ? item.descHi : item.desc}</p>
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
              <h3 className="text-xl font-bold text-white mb-4">{t('For Farmers', 'किसानों के लिए')}</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Simple, intuitive interface', 'आसान और सरल इंटरफ़ेस')}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Practical, actionable advice', 'काम की और उपयोगी सलाह')}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Reduced input costs', 'खेती की लागत में कमी')}</li>
              </ul>
            </div>
            <div className="bg-gray-950/50 backdrop-blur p-8 rounded-3xl border border-white/5">
              <Zap className="w-10 h-10 text-yellow-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">{t('For Agriculture', 'कृषि के लिए')}</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Data-driven decisions', 'डेटा पर आधारित निर्णय')}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Higher crop yields', 'अधिक पैदावार')}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Early disease prevention', 'रोगों की समय पर रोकथाम')}</li>
              </ul>
            </div>
            <div className="bg-gray-950/50 backdrop-blur p-8 rounded-3xl border border-white/5">
              <Leaf className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">{t('For Environment', 'पर्यावरण के लिए')}</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Water conservation', 'पानी का संरक्षण')}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Optimized fertilizer use', 'उर्वरक का सही उपयोग')}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {t('Sustainable practices', 'टिकाऊ खेती के तरीके')}</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">{t('Powered by Modern Technology', 'आधुनिक तकनीक से संचालित')}</h3>
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

      {/* CREATOR SECTION */}
      <section id="creator" className="py-20 bg-gray-950 text-center border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <Star className="w-4 h-4" /> <span>{t('Project Creator', 'प्रोजेक्ट निर्माता')}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Shikhar Tiwari</h2>
          <p className="text-gray-400 text-lg">{t('Designed and developed with a focus on useful AI tools for Indian farmers.', 'भारतीय किसानों के लिए उपयोगी AI टूल बनाने के उद्देश्य से विकसित।')}</p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-emerald-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">{t("Ready to Transform Your Farm?", "अपनी खेती को बेहतर बनाने के लिए तैयार हैं?")}</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            {t("Use AI to make smarter farming decisions and improve your crop management.", "AI की मदद से खेती के बेहतर निर्णय लें और फसल प्रबंधन सुधारें।")}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-green-900 hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {t("Start Using SmartFarm AI", "SmartFarm AI इस्तेमाल करें")}
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
                {t("Empowering farmers with Artificial Intelligence for smarter, more sustainable, and profitable agriculture.", "कृत्रिम बुद्धिमत्ता की मदद से खेती को अधिक समझदार, टिकाऊ और लाभकारी बनाने में किसानों की सहायता।")}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t("Features", "सुविधाएँ")}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/recommend')} className="text-gray-400 hover:text-green-400">{t("Crop Recommendation", "फसल सुझाव")}</button></li>
                <li><button onClick={() => navigate('/disease')} className="text-gray-400 hover:text-green-400">{t("Disease Detection", "रोग पहचान")}</button></li>
                <li><button onClick={() => navigate('/irrigation')} className="text-gray-400 hover:text-green-400">{t("Smart Irrigation", "स्मार्ट सिंचाई")}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t("Project", "प्रोजेक्ट")}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('creator')} className="text-gray-400 hover:text-green-400">{t("About Creator", "निर्माता के बारे में")}</button></li>
                <li><a href="https://github.com/shikhartiwari1508/SmartFarm-AI" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-400">{t('GitHub Repository', 'GitHub रिपॉज़िटरी')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              &copy; 2026 SmartFarm AI | Shikhar Tiwari
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-gray-500">
              <span>{t("Created by Shikhar Tiwari", "निर्माता: Shikhar Tiwari")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
