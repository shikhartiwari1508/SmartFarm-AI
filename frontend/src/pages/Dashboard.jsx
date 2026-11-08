import { useLanguage } from '../context/LanguageContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sprout, Droplets, Cloud, Bug, Brain, MapPin,
  Thermometer, Wind, Activity, MessageSquare,
  ArrowUpRight, Leaf, Sun, CalendarDays, ChevronRight,
  Wheat, CircleGauge
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getFarmProfile, getFarmSummary, getWeather, getInsights
} from '../services/api'
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip
} from 'recharts'

export default function Dashboard() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    profile: null,
    summary: null,
    weather: null,
    insights: null
  })

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, summaryRes, weatherRes, insightsRes] = await Promise.all([
          getFarmProfile().catch(() => null),
          getFarmSummary().catch(() => null),
          getWeather().catch(() => null),
          getInsights().catch(() => null)
        ])

        setData({
          profile: profileRes,
          summary: summaryRes,
          weather: weatherRes,
          insights: insightsRes
        })
      } catch (e) {
        toast.error(t('Failed to load some dashboard data', 'डैशबोर्ड का कुछ डेटा लोड नहीं हो सका'))
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  const isHindi = language === 'hi'
  const today = new Date()
  const dateLabel = today.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  if (loading) {
    return (
      <div className="sf-loading">
        <div className="sf-loading-mark"><Sprout size={28} /></div>
        <p>{t('Preparing your farm dashboard...', 'आपका फार्म डैशबोर्ड तैयार हो रहा है...')}</p>
      </div>
    )
  }

  const npkData = data.summary?.soil_metrics ? [
    { name: 'Nitrogen', value: data.summary.soil_metrics.nitrogen, fill: '#64834e' },
    { name: 'Phosphorus', value: data.summary.soil_metrics.phosphorus, fill: '#c28a4b' },
    { name: 'Potassium', value: data.summary.soil_metrics.potassium, fill: '#668b9b' }
  ] : []

  const modules = [
    {
      path: '/crops', icon: Sprout, number: '01',
      title: 'Crop Advisory', hindi: 'फसल सलाह',
      desc: 'Discover crops suited to your soil and season.',
      descHi: 'अपनी मिट्टी और मौसम के अनुसार फसल चुनें।',
      image: '/images/crop-wheat.jpg', tone: 'green'
    },
    {
      path: '/disease', icon: Bug, number: '02',
      title: 'Plant Health', hindi: 'फसल रोग पहचान',
      desc: 'Identify crop diseases and explore solutions.',
      descHi: 'फसल के रोग पहचानें और समाधान जानें।',
      image: '/images/crop-rice.jpg', tone: 'rust'
    },
    {
      path: '/irrigation', icon: Droplets, number: '03',
      title: 'Smart Irrigation', hindi: 'स्मार्ट सिंचाई',
      desc: 'Make better decisions about water usage.',
      descHi: 'पानी के बेहतर उपयोग के लिए सलाह पाएँ।',
      image: '/images/dashboard-hero.jpg', tone: 'blue'
    },
    {
      path: '/weather', icon: Cloud, number: '04',
      title: 'Weather Intelligence', hindi: 'मौसम जानकारी',
      desc: 'Plan farm activities with weather insights.',
      descHi: 'मौसम की जानकारी से खेती की योजना बनाएँ।',
      image: '/images/crop-mustard.jpg', tone: 'gold'
    },
    {
      path: '/insights', icon: Brain, number: '05',
      title: 'Farm Intelligence', hindi: 'AI खेती विश्लेषण',
      desc: 'Understand your farm through useful analytics.',
      descHi: 'खेती के आँकड़ों से उपयोगी जानकारी पाएँ।',
      image: '/images/crop-wheat.jpg', tone: 'green'
    },
    {
      path: '/chat', icon: MessageSquare, number: '06',
      title: 'Farm Assistant', hindi: 'कृषि सहायक',
      desc: 'Get answers to your agriculture questions.',
      descHi: 'खेती से जुड़े सवालों के जवाब पाएँ।',
      image: '/images/crop-rice.jpg', tone: 'blue'
    }
  ]

  const stats = [
    {
      icon: Thermometer,
      label: t('Temperature', 'तापमान'),
      value: data.weather?.current?.temperature ?? '--',
      unit: '°C',
      note: t('Current conditions', 'वर्तमान स्थिति'),
      tone: 'warm'
    },
    {
      icon: Droplets,
      label: t('Humidity', 'नमी'),
      value: data.weather?.current?.humidity ?? '--',
      unit: '%',
      note: t('Air moisture', 'हवा में नमी'),
      tone: 'blue'
    },
    {
      icon: Cloud,
      label: t('Weather', 'मौसम'),
      value: data.weather?.current?.condition || '--',
      unit: '',
      note: t('Today', 'आज का मौसम'),
      tone: 'sage'
    },
    {
      icon: Activity,
      label: t('Farm Health', 'खेत का स्वास्थ्य'),
      value: data.insights?.farm_health_score ?? '--',
      unit: data.insights?.farm_health_score != null ? '/100' : '',
      note: t('AI assessment', 'AI विश्लेषण'),
      tone: 'gold'
    }
  ]

  return (
    <main className="sf-dashboard">

      {/* Welcome heading */}
      <header className="sf-page-heading">
        <div>
          <div className="sf-eyebrow">
            <span className="sf-eyebrow-line" />
            SMARTFARM AI · FARM MANAGEMENT
          </div>
          <h1>{t('Your farm, in good hands.', 'आपकी खेती, हमारी समझ।')}</h1>
          <p>{t('A clearer picture of your farm, every day.', 'आपके खेत की हर जरूरी जानकारी, एक ही जगह।')}</p>
        </div>
        <div className="sf-date">
          <CalendarDays size={16} />
          <span>{dateLabel}</span>
        </div>
      </header>

      {/* Main visual hero */}
      <section className="sf-hero">
        <img className="sf-hero-image" src="/images/dashboard-hero.jpg" alt="Indian agricultural fields" />
        <div className="sf-hero-shade" />
        <div className="sf-hero-content">
          <span className="sf-hero-overline">
            <Leaf size={14} /> {t('ROOTED IN THE LAND · GUIDED BY INTELLIGENCE', 'मिट्टी से जुड़ाव · तकनीक का साथ')}
          </span>
          <h2>
            {isHindi
              ? <>बेहतर खेती की<br /><em>शुरुआत यहीं से।</em></>
              : <>Grow with wisdom.<br /><em>Harvest with confidence.</em></>}
          </h2>
          <p>
            {t(
              'Bring soil, weather and crop insights together to make every farming decision count.',
              'मिट्टी, मौसम और फसल की जानकारी को समझें और खेती के हर फैसले को बेहतर बनाएँ।'
            )}
          </p>
          <button className="sf-hero-button" onClick={() => navigate('/crops')}>
            {t('Explore crop advisory', 'फसल सलाह देखें')}
            <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="sf-hero-stamp">
          <Sprout size={22} />
          <span>{t('SMART FARMING', 'स्मार्ट खेती')}</span>
          <strong>01 / 06</strong>
        </div>
      </section>

      {/* Farm identity */}
      <section className="sf-farm-identity">
        <div className="sf-farmer-avatar">
          {(data.profile?.farmer_name?.charAt(0) || 'F').toUpperCase()}
        </div>
        <div className="sf-farmer-details">
          <span className="sf-small-label">{t('YOUR FARM PROFILE', 'आपकी खेती की पहचान')}</span>
          <h2>{data.profile?.farmer_name || 'Demo Farmer'}</h2>
          <p><MapPin size={14} /> {data.profile?.location || t('Location not set', 'स्थान दर्ज नहीं है')}</p>
        </div>
        <div className="sf-farm-facts">
          <div>
            <span>{t('FARM AREA', 'खेत का क्षेत्रफल')}</span>
            <strong>{data.profile?.area_acres || 0} <small>Acres</small></strong>
          </div>
          <div>
            <span>{t('CURRENT CROP', 'वर्तमान फसल')}</span>
            <strong>{data.profile?.current_crop || '--'}</strong>
          </div>
          <div>
            <span>{t('SOIL TYPE', 'मिट्टी का प्रकार')}</span>
            <strong>{data.profile?.soil_type || '--'}</strong>
          </div>
          <div>
            <span>{t('SOIL HEALTH', 'मिट्टी का स्वास्थ्य')}</span>
            <strong>{data.profile?.soil_health_score ?? '--'}<small>/100</small></strong>
          </div>
        </div>
      </section>

      {/* Live conditions */}
      <section className="sf-section">
        <div className="sf-section-heading">
          <div>
            <span className="sf-small-label">{t('FIELD CONDITIONS', 'खेत की वर्तमान स्थिति')}</span>
            <h2>{t('Your farm at a glance', 'एक नज़र में आपका खेत')}</h2>
          </div>
          <span className="sf-live-label"><span /> {t('LATEST DATA', 'नवीनतम डेटा')}</span>
        </div>
        <div className="sf-stat-grid">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article className={`sf-stat-card ${stat.tone}`} key={stat.label}>
                <div className="sf-stat-top">
                  <span className="sf-stat-icon"><Icon size={20} /></span>
                  <span className="sf-stat-label">{stat.label}</span>
                </div>
                <div className="sf-stat-value">
                  {stat.value}<small>{stat.unit}</small>
                </div>
                <div className="sf-stat-note">{stat.note}</div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Crop gallery */}
      <section className="sf-crop-feature">
        <div className="sf-section-heading">
          <div>
            <span className="sf-small-label">{t('A LAND OF POSSIBILITIES', 'फसलों की समृद्ध दुनिया')}</span>
            <h2>{t('Rooted in Indian agriculture', 'भारतीय खेती की पहचान')}</h2>
          </div>
          <button className="sf-text-link" onClick={() => navigate('/crops')}>
            {t('Explore crops', 'फसलें देखें')} <ChevronRight size={16} />
          </button>
        </div>
        <div className="sf-crop-grid">
          <button className="sf-crop-card crop-large" onClick={() => navigate('/crops')}>
            <img src="/images/crop-wheat.jpg" alt="Wheat crop" />
            <span className="sf-crop-shade" />
            <span className="sf-crop-copy">
              <small>01 · RABI CROP</small>
              <strong>{t('Wheat', 'गेहूं')}</strong>
              <span>{t('The golden harvest', 'सुनहरी फसल')}</span>
            </span>
          </button>
          <button className="sf-crop-card" onClick={() => navigate('/crops')}>
            <img src="/images/crop-rice.jpg" alt="Rice crop" />
            <span className="sf-crop-shade" />
            <span className="sf-crop-copy">
              <small>02 · KHARIF CROP</small>
              <strong>{t('Rice', 'धान')}</strong>
              <span>{t('The staple harvest', 'अन्न का आधार')}</span>
            </span>
          </button>
          <button className="sf-crop-card" onClick={() => navigate('/crops')}>
            <img src="/images/crop-mustard.jpg" alt="Mustard crop" />
            <span className="sf-crop-shade" />
            <span className="sf-crop-copy">
              <small>03 · OILSEED</small>
              <strong>{t('Mustard', 'सरसों')}</strong>
              <span>{t('Fields of gold', 'पीले फूलों की बहार')}</span>
            </span>
          </button>
        </div>
      </section>

      {/* Soil and NPK */}
      <section className="sf-analysis-grid">
        <article className="sf-analysis-panel">
          <div className="sf-section-heading">
            <div>
              <span className="sf-small-label">{t('SOIL INTELLIGENCE', 'मिट्टी का विश्लेषण')}</span>
              <h2>{t('Nutrient balance', 'पोषक तत्वों का संतुलन')}</h2>
            </div>
            <span className="sf-panel-icon"><Wheat size={19} /></span>
          </div>
          {npkData.length > 0 ? (
            <>
              <div className="sf-npk-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="47%" innerRadius="28%" outerRadius="88%" barSize={13} data={npkData}>
                    <RadialBar minAngle={12} background clockWise dataKey="value" cornerRadius={4} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fffdf8',
                        border: '1px solid #e4dccb',
                        borderRadius: '6px',
                        color: '#29382d'
                      }}
                    />
                    <Legend
                      iconSize={9}
                      layout="horizontal"
                      verticalAlign="bottom"
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <p className="sf-panel-footnote">{t('Based on your available soil metrics.', 'आपके उपलब्ध मिट्टी के आँकड़ों पर आधारित।')}</p>
            </>
          ) : (
            <div className="sf-empty-state">
              <CircleGauge size={30} />
              <p>{t('Soil nutrient data is not available yet.', 'मिट्टी के पोषक तत्वों का डेटा अभी उपलब्ध नहीं है।')}</p>
            </div>
          )}
        </article>

        <article className="sf-soil-story">
          <img src="/images/kisan-farmer-optimized.jpg" alt="Farmer in agricultural field" />
          <div className="sf-soil-story-overlay" />
          <div className="sf-soil-story-content">
            <span>{t('GOOD FARMING BEGINS UNDERFOOT', 'अच्छी खेती की शुरुआत मिट्टी से')}</span>
            <h2>{t('Know your soil. Nurture your land.', 'मिट्टी को समझें। अपनी जमीन सँवारें।')}</h2>
            <p>{t('Healthy soil is the foundation of a healthy harvest.', 'स्वस्थ मिट्टी ही अच्छी पैदावार की नींव है।')}</p>
          </div>
        </article>
      </section>

      {/* AI tools */}
      <section className="sf-modules-section">
        <div className="sf-section-heading">
          <div>
            <span className="sf-small-label">{t('TOOLS FOR BETTER FARMING', 'बेहतर खेती के उपयोगी साधन')}</span>
            <h2>{t('Your farm, intelligently supported.', 'आपकी खेती के लिए स्मार्ट सहयोग।')}</h2>
            <p>{t('Everything you need to make informed decisions.', 'खेती के सही फैसलों के लिए जरूरी सुविधाएँ।')}</p>
          </div>
        </div>
        <div className="sf-module-grid">
          {modules.map((mod) => {
            const Icon = mod.icon
            return (
              <button
                key={mod.path}
                className={`sf-module-card ${mod.tone}`}
                onClick={() => navigate(mod.path)}
              >
                <div className="sf-module-top">
                  <span className="sf-module-number">{mod.number}</span>
                  <span className="sf-module-icon"><Icon size={21} /></span>
                </div>
                <div className="sf-module-copy">
                  <h3>{isHindi ? mod.hindi : mod.title}</h3>
                  <p>{isHindi ? mod.descHi : mod.desc}</p>
                </div>
                <span className="sf-module-arrow"><ArrowUpRight size={18} /></span>
              </button>
            )
          })}
        </div>
      </section>

      <footer className="sf-dashboard-footer">
        <Sprout size={17} />
        <span>{t('Growing a better tomorrow, one field at a time.', 'हर खेत के साथ, बेहतर कल की ओर।')}</span>
        <span className="sf-footer-brand">SMARTFARM AI</span>
      </footer>
    </main>
  )
}
