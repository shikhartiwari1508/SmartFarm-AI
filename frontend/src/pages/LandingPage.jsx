import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import {
  Leaf, ArrowRight, Menu, X, Sprout, Bug, Droplets, CloudSun,
  Brain, MessageCircle, TrendingUp, ShieldCheck, Users,
  CheckCircle2, ChevronRight, MapPin, Github, Tractor,
  Wheat, Sun, HandHeart, BarChart3
} from 'lucide-react'
import './LandingPage.css'

const features = [
  {
    icon: Sprout,
    number: '01',
    title: 'Crop Recommendation',
    titleHi: 'फसल की सलाह',
    desc: 'Find suitable crops using soil nutrients, pH and local climate conditions.',
    descHi: 'मिट्टी के पोषक तत्वों, pH और मौसम के आधार पर उपयुक्त फसल चुनें।',
    route: '/crops',
    image: '/images/crop-wheat.jpg',
    tag: 'SOIL INTELLIGENCE'
  },
  {
    icon: Bug,
    number: '02',
    title: 'Crop Disease Detection',
    titleHi: 'फसल रोग पहचान',
    desc: 'Upload a leaf image to explore possible crop diseases and practical guidance.',
    descHi: 'पत्ते की तस्वीर से संभावित रोग पहचानें और उपयोगी सलाह पाएँ।',
    route: '/disease',
    image: '/images/crop-rice.jpg',
    tag: 'CROP HEALTH'
  },
  {
    icon: Droplets,
    number: '03',
    title: 'Smart Irrigation',
    titleHi: 'स्मार्ट सिंचाई',
    desc: 'Make informed irrigation decisions with soil and weather indicators.',
    descHi: 'मिट्टी और मौसम की जानकारी से सिंचाई के बेहतर निर्णय लें।',
    route: '/irrigation',
    image: '/images/crop-mustard.jpg',
    tag: 'WATER MANAGEMENT'
  },
  {
    icon: CloudSun,
    number: '04',
    title: 'Weather Intelligence',
    titleHi: 'मौसम की जानकारी',
    desc: 'Understand weather conditions and their impact on farm activities.',
    descHi: 'मौसम की स्थिति और खेती पर उसके प्रभाव को समझें।',
    route: '/weather',
    image: '/images/dashboard-hero.jpg',
    tag: 'WEATHER INSIGHTS'
  },
  {
    icon: TrendingUp,
    number: '05',
    title: 'Mandi Prices',
    titleHi: 'मंडी भाव',
    desc: 'Explore available mandi price information and compare market rates.',
    descHi: 'उपलब्ध मंडी भाव देखें और बाजार के दामों की तुलना करें।',
    route: '/market-prices',
    image: '/images/homepage-paddy-farmer.jpg',
    tag: 'MARKET INFORMATION'
  },
  {
    icon: Brain,
    number: '06',
    title: 'AI Farm Insights',
    titleHi: 'AI खेती विश्लेषण',
    desc: 'Bring farm observations together to discover useful next steps.',
    descHi: 'खेत से जुड़ी जानकारी का विश्लेषण करके उपयोगी सुझाव पाएँ।',
    route: '/insights',
    image: '/images/homepage-woman-farmer.jpg',
    tag: 'FARM INTELLIGENCE'
  }
]

const steps = [
  {
    number: '01',
    title: 'Share farm details',
    titleHi: 'खेत की जानकारी दें',
    desc: 'Enter soil, crop or location information.',
    descHi: 'मिट्टी, फसल या स्थान की जानकारी भरें।'
  },
  {
    number: '02',
    title: 'Explore AI analysis',
    titleHi: 'AI विश्लेषण देखें',
    desc: 'Let the tools examine the information you provide.',
    descHi: 'दिए गए डेटा के आधार पर AI विश्लेषण देखें।'
  },
  {
    number: '03',
    title: 'Understand recommendations',
    titleHi: 'सुझाव समझें',
    desc: 'Review insights and practical recommendations.',
    descHi: 'विश्लेषण और उपयोगी सुझावों को समझें।'
  },
  {
    number: '04',
    title: 'Make informed decisions',
    titleHi: 'सोच-समझकर निर्णय लें',
    desc: 'Use the information to plan your farm activities.',
    descHi: 'जानकारी के आधार पर खेती की योजना बनाएँ।'
  }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHindi = language === 'hi'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const openDashboard = () => navigate('/dashboard')

  return (
    <main className="sf-home">
      <header className={`sf-home-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="sf-home-nav">
          <button className="sf-home-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="SmartFarm AI home">
            <span className="sf-home-brand-mark"><Leaf size={25} /></span>
            <span className="sf-home-brand-copy">
              <strong>SmartFarm <em>AI</em></strong>
              <small>{t('INTELLIGENT AGRICULTURE', 'स्मार्ट कृषि समाधान')}</small>
            </span>
          </button>

          <nav className="sf-home-desktop-nav">
            <button onClick={() => scrollToSection('sf-home-about')}>{t('Our Approach', 'हमारा उद्देश्य')}</button>
            <button onClick={() => scrollToSection('sf-home-features')}>{t('Solutions', 'सुविधाएँ')}</button>
            <button onClick={() => scrollToSection('sf-home-how')}>{t('How it works', 'कैसे काम करता है')}</button>
            <LanguageSwitcher />
            <button className="sf-home-nav-cta" onClick={openDashboard}>
              {t('Open Platform', 'प्लेटफ़ॉर्म खोलें')} <ArrowRight size={16} />
            </button>
          </nav>

          <div className="sf-home-mobile-actions">
            <LanguageSwitcher compact />
            <button className="sf-home-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="sf-home-mobile-nav">
            <button onClick={() => scrollToSection('sf-home-about')}>{t('Our Approach', 'हमारा उद्देश्य')}</button>
            <button onClick={() => scrollToSection('sf-home-features')}>{t('Solutions', 'सुविधाएँ')}</button>
            <button onClick={() => scrollToSection('sf-home-how')}>{t('How it works', 'कैसे काम करता है')}</button>
            <button className="sf-home-nav-cta" onClick={() => { setIsMenuOpen(false); openDashboard() }}>
              {t('Open Platform', 'प्लेटफ़ॉर्म खोलें')} <ArrowRight size={16} />
            </button>
          </nav>
        )}
      </header>

      <section className="sf-home-hero">
        <div className="sf-home-hero-image" role="img" aria-label="Indian farmer working in a green agricultural field" />
        <div className="sf-home-hero-shade" />
        <div className="sf-home-hero-content">
          <div className="sf-home-eyebrow sf-home-eyebrow-light">
            <span className="sf-home-eyebrow-line" />
            {t('ROOTED IN AGRICULTURE · BUILT WITH INTELLIGENCE', 'कृषि की जड़ों से जुड़ा · आधुनिक तकनीक से सशक्त')}
          </div>

          <h1>
            {t('A smarter future', 'खेती का बेहतर')}
            <br />
            <span>{t('for every farm.', 'भविष्य, हर किसान के लिए।')}</span>
          </h1>

          <p className="sf-home-hero-description">
            {t(
              'Bringing useful AI tools, crop intelligence and farm insights together — to help Indian farmers make more informed decisions.',
              'उपयोगी AI टूल, फसल संबंधी जानकारी और खेती के विश्लेषण को एक जगह लाकर भारतीय किसानों को बेहतर निर्णय लेने में सहायता।'
            )}
          </p>

          <div className="sf-home-hero-actions">
            <button className="sf-home-primary-button" onClick={openDashboard}>
              {t('Explore SmartFarm', 'SmartFarm देखें')} <ArrowRight size={18} />
            </button>
            <button className="sf-home-outline-button" onClick={() => scrollToSection('sf-home-features')}>
              {t('Discover our tools', 'सुविधाएँ जानें')} <ChevronRight size={17} />
            </button>
          </div>

          <div className="sf-home-hero-foot">
            <span><CheckCircle2 size={16} /> {t('Farmer-focused tools', 'किसानों के लिए उपयोगी टूल')}</span>
            <span><CheckCircle2 size={16} /> {t('Hindi & English interface', 'हिंदी और अंग्रेज़ी')}</span>
          </div>
        </div>

        <div className="sf-home-hero-caption">
          <span>{t('AGRICULTURE · INNOVATION · GROWTH', 'कृषि · नवाचार · प्रगति')}</span>
          <span>01 / 06</span>
        </div>
      </section>

      <section className="sf-home-intro" id="sf-home-about">
        <div className="sf-home-intro-copy">
          <div className="sf-home-eyebrow"><span className="sf-home-eyebrow-line" />{t('A NEW WAY TO FARM', 'खेती का एक नया दृष्टिकोण')}</div>
          <h2>{t('Tradition gives us roots. Intelligence helps us grow.', 'परंपरा हमारी जड़ें हैं। समझदारी हमें आगे बढ़ाती है।')}</h2>
        </div>
        <div className="sf-home-intro-aside">
          <p>{t(
            'Farming is built on experience, observation and hard work. SmartFarm AI brings accessible digital tools into that journey — without losing sight of the farmer at its centre.',
            'खेती अनुभव, समझ और मेहनत पर आधारित है। SmartFarm AI इस सफर में आसान डिजिटल टूल जोड़ता है, जहाँ किसान हमेशा सबसे महत्वपूर्ण है।'
          )}</p>
          <button className="sf-home-text-link" onClick={() => scrollToSection('sf-home-how')}>
            {t('See how it works', 'जानें कैसे काम करता है')} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="sf-home-photo-story">
        <div className="sf-home-story-image sf-home-story-image-main">
          <img src="/images/homepage-farmer-rice.jpg" alt="Farmer working in a green agricultural field" loading="lazy" />
          <span className="sf-home-image-label">{t('THE PEOPLE BEHIND EVERY HARVEST', 'हर फसल के पीछे किसान की मेहनत')}</span>
        </div>
        <div className="sf-home-story-copy">
          <span className="sf-home-story-number">01 — OUR BELIEF</span>
          <h2>{t('Technology should work for the farmer.', 'तकनीक किसान के काम आनी चाहिए।')}</h2>
          <p>{t(
            'The best agricultural technology is practical, understandable and accessible. Our goal is to make useful insights easier to explore, whether you are planning a crop or checking the weather.',
            'बेहतर कृषि तकनीक वही है जो उपयोगी, आसान और सबकी पहुँच में हो। हमारा उद्देश्य फसल की योजना से लेकर मौसम की जानकारी तक, उपयोगी सुझावों को सरल बनाना है।'
          )}</p>
          <div className="sf-home-story-signoff"><span className="sf-home-signoff-icon"><HandHeart size={21} /></span><span>{t('Built around real farming needs', 'खेती की वास्तविक जरूरतों को ध्यान में रखकर')}</span></div>
        </div>
        <div className="sf-home-story-small">
          <img src="/images/homepage-woman-farmer.jpg" alt="Woman farmer in an agricultural field" loading="lazy" />
          <span>{t('FARMERS FIRST', 'किसान सबसे पहले')}</span>
        </div>
      </section>

      <section className="sf-home-features" id="sf-home-features">
        <div className="sf-home-section-heading">
          <div>
            <div className="sf-home-eyebrow"><span className="sf-home-eyebrow-line" />{t('THE SMARTFARM TOOLKIT', 'SMARTFARM की सुविधाएँ')}</div>
            <h2>{t('Useful tools for every stage of the season.', 'खेती के हर चरण के लिए उपयोगी डिजिटल टूल।')}</h2>
          </div>
          <p>{t(
            'Explore a connected set of tools designed to support everyday farm decisions — from soil and crop health to weather and market information.',
            'मिट्टी और फसल के स्वास्थ्य से लेकर मौसम और मंडी की जानकारी तक, खेती के रोज़मर्रा के निर्णयों में मदद करने वाले टूल।'
          )}</p>
        </div>

        <div className="sf-home-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article className="sf-home-feature-card" key={feature.number}>
                <button className="sf-home-feature-image" onClick={() => navigate(feature.route)} aria-label={`Open ${feature.title}`}>
                  <img src={feature.image} alt="" loading="lazy" />
                  <span className="sf-home-feature-number">{feature.number}</span>
                  <span className="sf-home-feature-image-arrow"><ArrowRight size={19} /></span>
                </button>
                <div className="sf-home-feature-body">
                  <span className="sf-home-feature-tag">{feature.tag}</span>
                  <h3>{isHindi ? feature.titleHi : feature.title}</h3>
                  <p>{isHindi ? feature.descHi : feature.desc}</p>
                  <button className="sf-home-card-link" onClick={() => navigate(feature.route)}>
                    {t('Explore tool', 'टूल देखें')} <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="sf-home-avatar-strip">
          <div className="sf-home-avatar-icon"><MessageCircle size={27} /></div>
          <div className="sf-home-avatar-copy">
            <span>{t('A FARMING COMPANION', 'खेती का डिजिटल साथी')}</span>
            <h3>{t('Meet AI Kisan Saathi', 'मिलें AI किसान साथी से')}</h3>
            <p>{t('Ask farming questions and explore guidance in Hindi, English and Bhojpuri.', 'खेती से जुड़े सवाल पूछें और हिंदी, अंग्रेज़ी व भोजपुरी में मार्गदर्शन पाएँ।')}</p>
          </div>
          <button onClick={() => navigate('/kisan-avatar')}>{t('Meet your Saathi', 'किसान साथी से मिलें')} <ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="sf-home-how" id="sf-home-how">
        <div className="sf-home-how-photo">
          <img src="/images/homepage-paddy-farmer.jpg" alt="Agriculture and rice cultivation" loading="lazy" />
          <div className="sf-home-how-photo-note">
            <Tractor size={20} />
            <span>{t('Knowledge for the field, not just the screen.', 'खेत के काम आने वाली जानकारी।')}</span>
          </div>
        </div>
        <div className="sf-home-how-content">
          <div className="sf-home-eyebrow"><span className="sf-home-eyebrow-line" />{t('SIMPLE BY DESIGN', 'आसान इस्तेमाल')}</div>
          <h2>{t('From information to informed action.', 'जानकारी से बेहतर निर्णय तक।')}</h2>
          <p className="sf-home-how-lead">{t('A straightforward way to explore the tools and understand the insights that matter to your farm.', 'अपने खेत के लिए जरूरी टूल और सुझाव समझने का एक आसान तरीका।')}</p>
          <div className="sf-home-steps">
            {steps.map((step) => (
              <div className="sf-home-step" key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{isHindi ? step.titleHi : step.title}</h3>
                  <p>{isHindi ? step.descHi : step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="sf-home-primary-button sf-home-dark-button" onClick={openDashboard}>
            {t('Get started', 'शुरू करें')} <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <section className="sf-home-values">
        <div className="sf-home-values-heading">
          <div className="sf-home-eyebrow sf-home-eyebrow-light"><span className="sf-home-eyebrow-line" />{t('OUR PRINCIPLES', 'हमारे सिद्धांत')}</div>
          <h2>{t('Grounded in farming. Guided by useful technology.', 'कृषि से जुड़ाव। उपयोगी तकनीक का साथ।')}</h2>
        </div>
        <div className="sf-home-values-grid">
          <div><Users /><h3>{t('Farmer-focused', 'किसान केंद्रित')}</h3><p>{t('Designed around practical farming questions and everyday needs.', 'खेती की वास्तविक जरूरतों और सवालों को ध्यान में रखकर।')}</p></div>
          <div><ShieldCheck /><h3>{t('Thoughtful guidance', 'जिम्मेदार सुझाव')}</h3><p>{t('Information is presented to support decisions, not replace local expertise.', 'जानकारी निर्णय लेने में मदद करती है, स्थानीय विशेषज्ञता का विकल्प नहीं।')}</p></div>
          <div><BarChart3 /><h3>{t('Informed choices', 'जानकारीपूर्ण निर्णय')}</h3><p>{t('Explore data and insights to better understand your farm.', 'अपने खेत को बेहतर समझने के लिए डेटा और विश्लेषण देखें।')}</p></div>
          <div><Wheat /><h3>{t('Sustainable future', 'टिकाऊ भविष्य')}</h3><p>{t('Encouraging careful use of resources and considered farm planning.', 'संसाधनों के समझदारी भरे उपयोग और बेहतर योजना को बढ़ावा।')}</p></div>
        </div>
      </section>

      <section className="sf-home-creator">
        <div className="sf-home-creator-image">
          <img src="/images/kisan-farmer-optimized.jpg" alt="Indian farmer" loading="lazy" />
        </div>
        <div className="sf-home-creator-copy">
          <div className="sf-home-eyebrow"><span className="sf-home-eyebrow-line" />{t('THE PROJECT', 'इस परियोजना के बारे में')}</div>
          <h2>{t('Built with a purpose. Made for agriculture.', 'एक उद्देश्य के साथ निर्मित। कृषि के लिए समर्पित।')}</h2>
          <p>{t('SmartFarm AI is a project by Shikhar Tiwari, created around the idea of making modern AI tools more approachable for Indian agriculture.', 'SmartFarm AI, Shikhar Tiwari द्वारा विकसित एक परियोजना है, जिसका उद्देश्य भारतीय कृषि के लिए आधुनिक AI टूल को अधिक सुलभ बनाना है।')}</p>
          <div className="sf-home-creator-name">
            <strong>Shikhar Tiwari</strong>
            <span>{t('Project Creator & Developer', 'प्रोजेक्ट निर्माता एवं डेवलपर')}</span>
          </div>
          <a className="sf-home-github-link" href="https://github.com/shikhartiwari1508/SmartFarm-AI" target="_blank" rel="noreferrer">
            <Github size={17} /> {t('View project on GitHub', 'GitHub पर प्रोजेक्ट देखें')} <ArrowRight size={15} />
          </a>
        </div>
      </section>

      <section className="sf-home-cta">
        <img src="/images/dashboard-hero.jpg" alt="" loading="lazy" />
        <div className="sf-home-cta-overlay" />
        <div className="sf-home-cta-content">
          <div className="sf-home-eyebrow sf-home-eyebrow-light"><span className="sf-home-eyebrow-line" />{t('YOUR FARM. YOUR DECISIONS.', 'आपका खेत। आपके निर्णय।')}</div>
          <h2>{t('Let’s grow a smarter tomorrow.', 'आइए, बेहतर कल की खेती करें।')}</h2>
          <p>{t('Explore SmartFarm AI and discover tools that can support your farming journey.', 'SmartFarm AI के टूल देखें और खेती के सफर में नई जानकारी का साथ पाएँ।')}</p>
          <button className="sf-home-primary-button" onClick={openDashboard}>{t('Enter SmartFarm AI', 'SmartFarm AI खोलें')} <ArrowRight size={18} /></button>
        </div>
      </section>

      <footer className="sf-home-footer">
        <div className="sf-home-footer-main">
          <div className="sf-home-footer-brand">
            <div className="sf-home-brand">
              <span className="sf-home-brand-mark"><Leaf size={23} /></span>
              <span className="sf-home-brand-copy"><strong>SmartFarm <em>AI</em></strong><small>{t('INTELLIGENT AGRICULTURE', 'स्मार्ट कृषि समाधान')}</small></span>
            </div>
            <p>{t('Useful technology, thoughtful insights and a farmer-first approach to modern agriculture.', 'आधुनिक कृषि के लिए उपयोगी तकनीक, सार्थक जानकारी और किसान-केंद्रित सोच।')}</p>
          </div>
          <div className="sf-home-footer-links">
            <div><h4>{t('Explore', 'देखें')}</h4><button onClick={() => navigate('/crops')}>{t('Crop recommendation', 'फसल की सलाह')}</button><button onClick={() => navigate('/disease')}>{t('Disease detection', 'रोग पहचान')}</button><button onClick={() => navigate('/weather')}>{t('Weather', 'मौसम')}</button></div>
            <div><h4>{t('Platform', 'प्लेटफ़ॉर्म')}</h4><button onClick={openDashboard}>{t('Dashboard', 'डैशबोर्ड')}</button><button onClick={() => navigate('/market-prices')}>{t('Mandi prices', 'मंडी भाव')}</button><button onClick={() => navigate('/kisan-avatar')}>{t('AI Kisan Saathi', 'AI किसान साथी')}</button></div>
            <div><h4>{t('Connect', 'जुड़ें')}</h4><a href="https://github.com/shikhartiwari1508/SmartFarm-AI" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a><button onClick={() => scrollToSection('sf-home-about')}>{t('About the project', 'परियोजना के बारे में')}</button></div>
          </div>
        </div>
        <div className="sf-home-footer-bottom">
          <span>© 2026 SmartFarm AI · Shikhar Tiwari</span>
          <span>{t('Rooted in agriculture. Growing with intelligence.', 'कृषि से जुड़ाव, तकनीक के साथ विकास।')}</span>
        </div>
      </footer>
    </main>
  )
}

