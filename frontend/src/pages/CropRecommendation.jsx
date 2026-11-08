import { useLanguage } from '../context/LanguageContext'
import { useState } from 'react'
import {
  Sprout, Info, Loader2, CheckCircle, Thermometer,
  Droplets, CloudRain, AlertTriangle, RefreshCw,
  MapPin, FlaskConical, Wind, Sun, ArrowRight,
  Leaf, ChartNoAxesCombined, Wheat, Sparkles,
  ClipboardCheck, Gauge, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { recommendCrop } from '../services/api'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts'

export default function CropRecommendation() {
  const { t, language } = useLanguage()
  const isHindi = language === 'hi'

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const [form, setForm] = useState({
    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,
    ph: 6.5,
    temperature: 28,
    humidity: 82,
    rainfall: 202,
    season: 'Kharif',
    location: 'Maharashtra'
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: ['season', 'location'].includes(name)
        ? value
        : value === '' ? '' : parseFloat(value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await recommendCrop(form)
      setResult(res)
      toast.success(t('Recommendation Ready!', 'फसल की सलाह तैयार है!'))
    } catch (err) {
      toast.error(
        err.message || t(
          'Failed to get recommendation',
          'फसल की सलाह नहीं मिल सकी'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { subject: 'Nitrogen', A: Number(form.nitrogen) || 0, fullMark: 150 },
    { subject: 'Phosphorus', A: Number(form.phosphorus) || 0, fullMark: 100 },
    { subject: 'Potassium', A: Number(form.potassium) || 0, fullMark: 100 },
    { subject: 'pH', A: (Number(form.ph) || 0) * 10, fullMark: 140 },
    { subject: 'Temp', A: Number(form.temperature) || 0, fullMark: 50 },
    { subject: 'Humidity', A: Number(form.humidity) || 0, fullMark: 100 }
  ]

  const fields = [
    {
      name: 'nitrogen',
      label: 'Nitrogen',
      hindi: 'नाइट्रोजन',
      symbol: 'N',
      unit: 'kg/ha',
      icon: FlaskConical,
      min: 0,
      max: 200,
      step: 1
    },
    {
      name: 'phosphorus',
      label: 'Phosphorus',
      hindi: 'फॉस्फोरस',
      symbol: 'P',
      unit: 'kg/ha',
      icon: FlaskConical,
      min: 0,
      max: 200,
      step: 1
    },
    {
      name: 'potassium',
      label: 'Potassium',
      hindi: 'पोटैशियम',
      symbol: 'K',
      unit: 'kg/ha',
      icon: FlaskConical,
      min: 0,
      max: 200,
      step: 1
    },
    {
      name: 'ph',
      label: 'Soil pH',
      hindi: 'मिट्टी का pH',
      symbol: 'pH',
      unit: '0–14',
      icon: Gauge,
      min: 0,
      max: 14,
      step: 0.1
    },
    {
      name: 'temperature',
      label: 'Temperature',
      hindi: 'तापमान',
      symbol: '°C',
      unit: 'Celsius',
      icon: Thermometer,
      step: 0.1
    },
    {
      name: 'humidity',
      label: 'Humidity',
      hindi: 'नमी',
      symbol: '%',
      unit: 'Relative',
      icon: Droplets,
      min: 0,
      max: 100,
      step: 1
    },
    {
      name: 'rainfall',
      label: 'Rainfall',
      hindi: 'वर्षा',
      symbol: 'mm',
      unit: 'Annual',
      icon: CloudRain,
      min: 0,
      step: 1
    }
  ]

  const alternatives = result?.alternative_crops || []
  const tips = result?.farming_tips || []
  const score = Math.max(
    0,
    Math.min(100, Number(result?.suitability_score) || 0)
  )

  return (
    <main className="crop-studio">

      {/* Editorial page heading */}
      <header className="crop-page-heading">
        <div>
          <div className="crop-eyebrow">
            <span />
            SMARTFARM AI <i>·</i> INTELLIGENT AGRICULTURE
          </div>

          <h1>
            {t('Find the right crop.', 'सही फसल चुनें।')}
            <em>{t('Grow with confidence.', 'समझदारी से खेती करें।')}</em>
          </h1>

          <p>
            {t(
              'A thoughtful look at your soil, climate and growing conditions.',
              'अपनी मिट्टी, मौसम और खेती की परिस्थितियों को समझकर बेहतर फसल चुनें।'
            )}
          </p>
        </div>

        <div className="crop-heading-mark">
          <Sprout size={25} />
          <span>{t('CROP ADVISORY', 'फसल सलाह')}</span>
          <strong>01 / 06</strong>
        </div>
      </header>

      {/* Visual hero */}
      <section className="crop-hero">
        <img
          src="/images/crop-wheat.jpg"
          alt="Golden wheat field"
          className="crop-hero-image"
        />
        <div className="crop-hero-overlay" />

        <div className="crop-hero-content">
          <span className="crop-hero-kicker">
            <Sparkles size={14} />
            {t('SCIENCE MEETS THE SOIL', 'विज्ञान और मिट्टी का संगम')}
          </span>

          <h2>
            {t(
              'Every field has a story. Let’s find its best crop.',
              'हर खेत की अपनी कहानी है। उसकी सबसे अच्छी फसल चुनें।'
            )}
          </h2>

          <p>
            {t(
              'Use your farm conditions to discover a crop recommendation that makes agricultural sense.',
              'अपने खेत की परिस्थितियों के आधार पर उपयुक्त फसल की सलाह प्राप्त करें।'
            )}
          </p>
        </div>

        <div className="crop-hero-side">
          <Wheat size={30} />
          <span>{t('BETTER CHOICES', 'बेहतर चुनाव')}</span>
          <strong>{t('Better harvests', 'बेहतर पैदावार')}</strong>
        </div>
      </section>

      {/* Main workspace */}
      <div className="crop-workspace">

        <section className="crop-form-panel">
          <div className="crop-panel-heading">
            <div className="crop-panel-heading-icon">
              <FlaskConical size={21} />
            </div>

            <div>
              <span className="crop-overline">
                {t('STEP 01 · FARM DETAILS', 'चरण 01 · खेत की जानकारी')}
              </span>
              <h2>{t('Understand your land', 'अपनी जमीन को समझें')}</h2>
              <p>
                {t(
                  'Enter the available soil and climate measurements.',
                  'मिट्टी और मौसम से जुड़ी उपलब्ध जानकारी भरें।'
                )}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="crop-form">

            <div className="crop-form-section-title">
              <span className="crop-section-number">01</span>
              <div>
                <h3>{t('Soil composition', 'मिट्टी की संरचना')}</h3>
                <p>{t('Primary soil nutrient values', 'मिट्टी के मुख्य पोषक तत्व')}</p>
              </div>
            </div>

            <div className="crop-input-grid">
              {fields.slice(0, 3).map(field => {
                const Icon = field.icon

                return (
                  <div className="crop-field" key={field.name}>
                    <label htmlFor={`crop-${field.name}`}>
                      <span>{isHindi ? field.hindi : field.label}</span>
                      <small>{field.symbol}</small>
                    </label>

                    <div className="crop-input-wrap">
                      <Icon size={16} />
                      <input
                        id={`crop-${field.name}`}
                        type="number"
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        required
                      />
                      <span>{field.unit}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="crop-form-section-title crop-climate-title">
              <span className="crop-section-number">02</span>
              <div>
                <h3>{t('Climate conditions', 'मौसम की परिस्थितियाँ')}</h3>
                <p>{t('Temperature, moisture and rainfall', 'तापमान, नमी और वर्षा')}</p>
              </div>
            </div>

            <div className="crop-input-grid">
              {fields.slice(3).map(field => {
                const Icon = field.icon

                return (
                  <div className="crop-field" key={field.name}>
                    <label htmlFor={`crop-${field.name}`}>
                      <span>{isHindi ? field.hindi : field.label}</span>
                      <small>{field.symbol}</small>
                    </label>

                    <div className="crop-input-wrap">
                      <Icon size={16} />
                      <input
                        id={`crop-${field.name}`}
                        type="number"
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        required
                      />
                      <span>{field.unit}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="crop-form-section-title crop-climate-title">
              <span className="crop-section-number">03</span>
              <div>
                <h3>{t('Growing region', 'खेती का क्षेत्र')}</h3>
                <p>{t('Season and farm location', 'फसल का मौसम और स्थान')}</p>
              </div>
            </div>

            <div className="crop-location-grid">
              <div className="crop-field">
                <label htmlFor="crop-season">
                  <span>{t('Growing season', 'फसल का मौसम')}</span>
                  <small><Sun size={13} /></small>
                </label>

                <select
                  id="crop-season"
                  name="season"
                  value={form.season}
                  onChange={handleChange}
                  className="crop-select"
                >
                  <option value="Kharif">{t('Kharif · खरीफ', 'खरीफ')}</option>
                  <option value="Rabi">{t('Rabi · रबी', 'रबी')}</option>
                  <option value="Zaid">{t('Zaid · जायद', 'जायद')}</option>
                </select>
              </div>

              <div className="crop-field">
                <label htmlFor="crop-location">
                  <span>{t('Farm location', 'खेत का स्थान')}</span>
                  <small><MapPin size={13} /></small>
                </label>

                <div className="crop-input-wrap">
                  <MapPin size={16} />
                  <input
                    id="crop-location"
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder={t('Enter state or region', 'राज्य या क्षेत्र दर्ज करें')}
                  />
                </div>
              </div>
            </div>

            <div className="crop-form-note">
              <Info size={16} />
              <span>
                {t(
                  'Use recent soil-test values whenever available. Recommendations depend on the accuracy of your inputs.',
                  'जहाँ संभव हो, मिट्टी की हाल की जाँच के आँकड़े भरें। सलाह आपके दिए गए डेटा की सटीकता पर निर्भर करती है।'
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="crop-submit-button"
            >
              {loading
                ? <Loader2 size={19} className="crop-spin" />
                : <Sparkles size={19} />
              }

              <span>
                {loading
                  ? t('Analysing your farm...', 'आपके खेत का विश्लेषण हो रहा है...')
                  : t('Generate crop recommendation', 'फसल की सलाह प्राप्त करें')
                }
              </span>

              {!loading && <ArrowRight size={19} />}
            </button>
          </form>
        </section>

        {/* Results workspace */}
        <section className="crop-results-column">

          {!result && !loading && (
            <div className="crop-result-empty">
              <div className="crop-empty-illustration">
                <img
                  src="/images/crop-rice.jpg"
                  alt="Healthy green rice field"
                />
                <div className="crop-empty-icon">
                  <Sprout size={27} />
                </div>
              </div>

              <span className="crop-overline">
                {t('YOUR FARM REPORT', 'आपके खेत की रिपोर्ट')}
              </span>

              <h2>
                {t('Your next harvest starts with a good decision.', 'अच्छे फैसले से शुरू होती है बेहतर पैदावार।')}
              </h2>

              <p>
                {t(
                  'Complete the farm assessment to discover a crop suited to your soil and climate.',
                  'अपनी मिट्टी और मौसम के अनुसार फसल की सलाह पाने के लिए खेत का विवरण भरें।'
                )}
              </p>

              <div className="crop-empty-steps">
                <div><span>01</span>{t('Soil values', 'मिट्टी के आँकड़े')}</div>
                <ChevronRight size={15} />
                <div><span>02</span>{t('Climate', 'मौसम')}</div>
                <ChevronRight size={15} />
                <div><span>03</span>{t('Crop match', 'उपयुक्त फसल')}</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="crop-result-loading">
              <div className="crop-loading-ring">
                <Sprout size={32} />
              </div>

              <span className="crop-overline">
                {t('SMART FARM ANALYSIS', 'स्मार्ट फार्म विश्लेषण')}
              </span>

              <h2>{t('Reading your field...', 'आपके खेत को समझ रहे हैं...')}</h2>

              <p>
                {t(
                  'Evaluating soil nutrients and climate conditions.',
                  'मिट्टी के पोषक तत्वों और मौसम की परिस्थितियों का विश्लेषण हो रहा है।'
                )}
              </p>

              <div className="crop-loading-track"><span /></div>
            </div>
          )}

          {result && !loading && (
            <div className="crop-result-report">

              <div className="crop-result-topline">
                <div>
                  <span className="crop-overline">
                    {t('YOUR PERSONAL FARM REPORT', 'आपकी खेती की रिपोर्ट')}
                  </span>
                  <h2>{t('Crop recommendation', 'फसल की सलाह')}</h2>
                </div>
                <div className="crop-report-icon">
                  <ClipboardCheck size={22} />
                </div>
              </div>

              <article className="crop-winner-card">
                <div className="crop-winner-background" />
                <div className="crop-winner-content">

                  {result.is_demo && (
                    <div className="crop-demo-indicator">
                      <AlertTriangle size={13} />
                      {t('Demo Mode Active', 'डेमो मोड चालू है')}
                    </div>
                  )}

                  <span className="crop-winner-label">
                    <CheckCircle size={15} />
                    {t('MOST SUITABLE CROP', 'सबसे उपयुक्त फसल')}
                  </span>

                  <h3>{result.recommended_crop || '--'}</h3>

                  <p>
                    {result.season_info || t(
                      'Based on the submitted farm conditions.',
                      'आपके दिए गए खेत के विवरण के आधार पर।'
                    )}
                  </p>

                  <div className="crop-score-row">
                    <div className="crop-score-circle">
                      <strong>{score}</strong>
                      <span>%</span>
                    </div>

                    <div>
                      <span>{t('Suitability score', 'उपयुक्तता स्कोर')}</span>
                      <strong>
                        {score >= 80
                          ? t('Strong match', 'बेहतर अनुकूलता')
                          : score >= 60
                            ? t('Good match', 'अच्छी अनुकूलता')
                            : t('Review conditions', 'परिस्थितियों की जाँच करें')
                        }
                      </strong>
                    </div>
                  </div>
                </div>
              </article>

              <div className="crop-result-section-heading">
                <span className="crop-overline">
                  {t('FIELD NOTES', 'खेत के लिए सुझाव')}
                </span>
                <h3>{t('Recommendations for your farm', 'आपके खेत के लिए सुझाव')}</h3>
              </div>

              <div className="crop-result-detail-grid">
                <article className="crop-tips-card">
                  <div className="crop-detail-heading">
                    <span><CheckCircle size={17} /></span>
                    <h4>{t('Farming tips', 'खेती के सुझाव')}</h4>
                  </div>

                  {tips.length > 0 ? (
                    <ul>
                      {tips.map((tip, index) => (
                        <li key={index}>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <p>{tip}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="crop-no-data">
                      {t('No additional tips available.', 'अतिरिक्त सुझाव उपलब्ध नहीं हैं।')}
                    </p>
                  )}
                </article>

                <article className="crop-chart-card">
                  <div className="crop-detail-heading">
                    <span><ChartNoAxesCombined size={17} /></span>
                    <h4>{t('Soil & climate profile', 'मिट्टी और मौसम का विवरण')}</h4>
                  </div>

                  <div className="crop-radar-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="72%"
                        data={chartData}
                      >
                        <PolarGrid stroke="#dcd8c9" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: '#657263', fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#fffdf7',
                            border: '1px solid #e2dac8',
                            borderRadius: '5px',
                            fontSize: '11px'
                          }}
                        />
                        <Radar
                          name="Current"
                          dataKey="A"
                          stroke="#426b46"
                          fill="#6f9462"
                          fillOpacity={0.32}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="crop-chart-caption">
                    {t('Current values entered in your assessment.', 'आपके द्वारा दर्ज किए गए वर्तमान आँकड़े।')}
                  </p>
                </article>
              </div>

              {alternatives.length > 0 && (
                <article className="crop-alternatives-card">
                  <div className="crop-detail-heading">
                    <span><Leaf size={17} /></span>
                    <h4>{t('Other crop possibilities', 'अन्य संभावित फसलें')}</h4>
                  </div>

                  <div className="crop-alternatives-list">
                    {alternatives.map((crop, index) => (
                      <div className="crop-alternative-item" key={crop.crop}>
                        <span className="crop-alternative-number">
                          0{index + 1}
                        </span>
                        <strong>{crop.crop}</strong>
                        <span className="crop-alternative-score">
                          {crop.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              <button
                type="button"
                onClick={() => setResult(null)}
                className="crop-reset-button"
              >
                <RefreshCw size={16} />
                {t('Start a new assessment', 'नया विश्लेषण शुरू करें')}
              </button>
            </div>
          )}
        </section>
      </div>

      <footer className="crop-page-footer">
        <Sprout size={17} />
        <span>
          {t(
            'Good farming begins with understanding your land.',
            'बेहतर खेती की शुरुआत अपनी मिट्टी को समझने से होती है।'
          )}
        </span>
        <strong>SMARTFARM AI</strong>
      </footer>
    </main>
  )
}
