import { useState } from 'react'
import {
  Droplets, Loader2, CheckCircle, XCircle, AlertTriangle,
  Clock, Leaf, Thermometer, CloudRain, Wind, RefreshCw,
  Sprout, Gauge, ArrowRight, ShieldCheck, Sun
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '../context/LanguageContext'
import { getIrrigationRecommendation } from '../services/api'

const URGENCY_CONFIG = {
  None: {
    label: 'No Irrigation Needed',
    hindi: 'अभी सिंचाई की आवश्यकता नहीं',
    icon: CheckCircle,
    className: 'irrigation-status-none',
  },
  Low: {
    label: 'Low Urgency',
    hindi: 'कम प्राथमिकता',
    icon: AlertTriangle,
    className: 'irrigation-status-low',
  },
  Medium: {
    label: 'Moderate Urgency',
    hindi: 'मध्यम प्राथमिकता',
    icon: AlertTriangle,
    className: 'irrigation-status-medium',
  },
  High: {
    label: 'Urgent Irrigation',
    hindi: 'तुरंत सिंचाई आवश्यक',
    icon: XCircle,
    className: 'irrigation-status-high',
  },
}

const INITIAL_FORM = {
  soil_moisture: 40,
  temperature: 30,
  humidity: 65,
  rainfall: 5,
  crop_type: 'Wheat',
  growth_stage: 'Vegetative',
}

const CROP_STAGES = {
  Wheat: ['Germination', 'Vegetative', 'Flowering', 'Grain Fill', 'Maturity'],
  Rice: ['Transplanting', 'Tillering', 'Flowering', 'Grain Fill'],
  Maize: ['Germination', 'Vegetative', 'Tasseling', 'Grain Fill'],
  Cotton: ['Germination', 'Vegetative', 'Flowering', 'Boll'],
  Tomato: ['Transplanting', 'Vegetative', 'Flowering', 'Fruiting'],
  Potato: ['Emergence', 'Vegetative', 'Tuber Init', 'Bulking', 'Maturity'],
  Groundnut: ['Germination', 'Vegetative', 'Pegging', 'Pod Fill', 'Maturity'],
  Soybean: ['Germination', 'Vegetative', 'Flowering', 'Pod Fill'],
  Chickpea: ['Germination', 'Vegetative', 'Flowering', 'Pod Fill'],
  Mustard: ['Germination', 'Vegetative', 'Flowering', 'Maturity'],
  Onion: ['Establishment', 'Vegetative', 'Bulb Dev', 'Maturity'],
  Sugarcane: ['Germination', 'Tillering', 'Grand Growth', 'Maturity'],
}

const CROP_LABELS = {
  Wheat: 'गेहूं', Rice: 'धान', Maize: 'मक्का',
  Cotton: 'कपास', Tomato: 'टमाटर', Potato: 'आलू',
  Groundnut: 'मूंगफली', Soybean: 'सोयाबीन',
  Chickpea: 'चना', Mustard: 'सरसों',
  Onion: 'प्याज', Sugarcane: 'गन्ना',
}

const STAGE_LABELS = {
  Germination: 'अंकुरण',
  Vegetative: 'विकास अवस्था',
  Flowering: 'फूल आने की अवस्था',
  'Grain Fill': 'दाना भरने की अवस्था',
  Maturity: 'परिपक्वता',
  Transplanting: 'रोपाई',
  Tillering: 'कल्ले निकलना',
  Tasseling: 'नर मंजरी अवस्था',
  Boll: 'टिंडा अवस्था',
  Fruiting: 'फल आने की अवस्था',
  Emergence: 'अंकुर निकलना',
  'Tuber Init': 'कंद बनना',
  Bulking: 'कंद विकास',
  Pegging: 'पेगिंग अवस्था',
  'Pod Fill': 'फली भरना',
  Establishment: 'स्थापना अवस्था',
  'Bulb Dev': 'बल्ब विकास',
  'Grand Growth': 'तेज वृद्धि',
}

function SliderInput({
  label,
  hindi,
  name,
  value,
  min,
  max,
  unit,
  icon: Icon,
  color,
  description,
  onChange,
}) {
  const progress = ((value - min) / (max - min)) * 100

  return (
    <div className="irrigation-slider-field">
      <div className="irrigation-slider-top">
        <div className="irrigation-slider-label">
          <span className={`irrigation-slider-icon ${color}`}>
            <Icon size={18} />
          </span>
          <div>
            <label htmlFor={`irrigation-${name}`}>{label}</label>
            <span>{hindi}</span>
          </div>
        </div>
        <div className="irrigation-slider-value">
          {value}<small>{unit}</small>
        </div>
      </div>

      <input
        id={`irrigation-${name}`}
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="irrigation-range"
        style={{ '--range-progress': `${progress}%` }}
      />

      <div className="irrigation-slider-bottom">
        <span>{min}{unit}</span>
        <span>{description}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, unit, tone }) {
  return (
    <div className={`irrigation-metric-card ${tone}`}>
      <div className="irrigation-metric-icon">
        <Icon size={20} />
      </div>
      <span className="irrigation-metric-label">{label}</span>
      <div className="irrigation-metric-value">
        {value}<small>{unit}</small>
      </div>
    </div>
  )
}

export default function SmartIrrigation() {
  const { t, language } = useLanguage()
  const isHindi = language === 'hi'

  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const stages = CROP_STAGES[form.crop_type] || ['Vegetative']

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: ['crop_type', 'growth_stage'].includes(name)
        ? value
        : parseFloat(value),
      ...(name === 'crop_type'
        ? { growth_stage: (CROP_STAGES[value] || ['Vegetative'])[0] }
        : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await getIrrigationRecommendation(form)
      setResult(data)
      toast.success(isHindi ? 'सिंचाई की सलाह तैयार है!' : 'Irrigation recommendation ready!')
    } catch (err) {
      setError(err.message || 'Something went wrong')
      toast.error((isHindi ? 'समस्या: ' : 'Failed: ') + (err.message || 'Please try again'))
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm(INITIAL_FORM)
    setResult(null)
    setError(null)
  }

  const cfg = result
    ? (URGENCY_CONFIG[result.urgency] || URGENCY_CONFIG.None)
    : null

  const UrgencyIcon = cfg?.icon || CheckCircle

  return (
    <main className="irrigation-studio">

      <header className="irrigation-page-heading">
        <div>
          <div className="irrigation-eyebrow">
            <span />
            {t('SMART WATER MANAGEMENT', 'स्मार्ट जल प्रबंधन')}
          </div>
          <h1>
            {t('Smart Irrigation', 'स्मार्ट सिंचाई')}
            <span className="irrigation-heading-mark">.</span>
          </h1>
          <p>
            {t(
              'Give every crop the right amount of water, at the right time.',
              'हर फसल को सही समय पर उसकी जरूरत के अनुसार पानी दें।'
            )}
          </p>
        </div>

        <div className="irrigation-heading-icon">
          <Droplets size={30} />
          <span>{t('WATER WISE', 'जल संरक्षण')}</span>
        </div>
      </header>

      <section className="irrigation-hero">
        <img
          src="/images/dashboard-hero.jpg"
          alt="Green agricultural field"
          className="irrigation-hero-image"
        />
        <div className="irrigation-hero-overlay" />
        <div className="irrigation-hero-content">
          <span className="irrigation-hero-kicker">
            <Sprout size={15} />
            {t('A HEALTHIER FIELD STARTS HERE', 'बेहतर खेती की शुरुआत')}
          </span>
          <h2>
            {t('Every drop has a purpose.', 'हर बूंद कीमती है।')}
          </h2>
          <p>
            {t(
              'Understand your field conditions and make informed irrigation decisions for healthier crops.',
              'अपने खेत की स्थिति समझें और बेहतर फसल के लिए सोच-समझकर सिंचाई का निर्णय लें।'
            )}
          </p>
        </div>
        <div className="irrigation-hero-note">
          <Droplets size={18} />
          <span>{t('Smart water. Strong harvest.', 'सही पानी, बेहतर पैदावार।')}</span>
        </div>
      </section>

      <div className="irrigation-section-intro">
        <div>
          <span className="irrigation-section-kicker">
            {t('FIELD ASSESSMENT', 'खेत का आकलन')}
          </span>
          <h2>{t('Tell us about your field', 'अपने खेत की जानकारी दें')}</h2>
          <p>
            {t(
              'Adjust the conditions below to receive a tailored recommendation.',
              'सही सलाह पाने के लिए नीचे खेत की स्थितियां चुनें।'
            )}
          </p>
        </div>
        <div className="irrigation-step-indicator">
          <span>01</span>
          <div />
          <span>02</span>
          <small>{t('CONDITIONS / ADVICE', 'स्थिति / सलाह')}</small>
        </div>
      </div>

      <div className="irrigation-workspace">

        <form onSubmit={handleSubmit} className="irrigation-form-panel">
          <div className="irrigation-panel-heading">
            <div className="irrigation-panel-icon">
              <Gauge size={21} />
            </div>
            <div>
              <h3>{t('Field Conditions', 'खेत की स्थिति')}</h3>
              <p>{t('Current environmental readings', 'वर्तमान वातावरण की जानकारी')}</p>
            </div>
            <span className="irrigation-panel-number">01</span>
          </div>

          <div className="irrigation-slider-list">
            <SliderInput
              label="Soil Moisture"
              hindi="मिट्टी की नमी"
              name="soil_moisture"
              value={form.soil_moisture}
              min={0}
              max={100}
              unit="%"
              icon={Droplets}
              color="blue"
              description={t('Moisture level', 'नमी का स्तर')}
              onChange={handleChange}
            />

            <SliderInput
              label="Temperature"
              hindi="तापमान"
              name="temperature"
              value={form.temperature}
              min={0}
              max={60}
              unit="°C"
              icon={Thermometer}
              color="orange"
              description={t('Air temperature', 'हवा का तापमान')}
              onChange={handleChange}
            />

            <SliderInput
              label="Humidity"
              hindi="हवा में नमी"
              name="humidity"
              value={form.humidity}
              min={0}
              max={100}
              unit="%"
              icon={Wind}
              color="sky"
              description={t('Relative humidity', 'सापेक्ष आर्द्रता')}
              onChange={handleChange}
            />

            <SliderInput
              label="Recent Rainfall"
              hindi="हाल की वर्षा"
              name="rainfall"
              value={form.rainfall}
              min={0}
              max={200}
              unit="mm"
              icon={CloudRain}
              color="indigo"
              description={t('Rain received', 'हुई वर्षा')}
              onChange={handleChange}
            />
          </div>

          <div className="irrigation-form-divider" />

          <div className="irrigation-crop-section">
            <div className="irrigation-subsection-heading">
              <Leaf size={18} />
              <div>
                <h4>{t('Crop Information', 'फसल की जानकारी')}</h4>
                <p>{t('Select your crop and its current stage', 'फसल और उसकी वर्तमान अवस्था चुनें')}</p>
              </div>
            </div>

            <div className="irrigation-select-grid">
              <div className="irrigation-select-field">
                <label htmlFor="irrigation-crop">
                  {t('Crop Type', 'फसल का प्रकार')}
                </label>
                <select
                  id="irrigation-crop"
                  name="crop_type"
                  value={form.crop_type}
                  onChange={handleChange}
                  className="irrigation-select"
                >
                  {Object.keys(CROP_STAGES).map(crop => (
                    <option key={crop} value={crop}>
                      {isHindi ? (CROP_LABELS[crop] || crop) : crop}
                    </option>
                  ))}
                </select>
              </div>

              <div className="irrigation-select-field">
                <label htmlFor="irrigation-stage">
                  {t('Growth Stage', 'विकास की अवस्था')}
                </label>
                <select
                  id="irrigation-stage"
                  name="growth_stage"
                  value={form.growth_stage}
                  onChange={handleChange}
                  className="irrigation-select"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>
                      {isHindi ? (STAGE_LABELS[stage] || stage) : stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="irrigation-form-footer">
            <div className="irrigation-form-assurance">
              <ShieldCheck size={17} />
              <span>{t('Your field data stays within this recommendation.', 'आपकी जानकारी सलाह तैयार करने के लिए उपयोग होगी।')}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="irrigation-submit-button"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  {t('Calculating...', 'गणना हो रही है...')}
                </>
              ) : (
                <>
                  <Droplets size={19} />
                  {t('Get Irrigation Advice', 'सिंचाई की सलाह पाएं')}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <section className="irrigation-results-column">
          <div className="irrigation-results-heading">
            <div>
              <span>{t('YOUR FARM REPORT', 'आपकी खेत रिपोर्ट')}</span>
              <h3>{t('Irrigation Advice', 'सिंचाई की सलाह')}</h3>
            </div>
            <span className="irrigation-report-number">02</span>
          </div>

          {!result && !loading && (
            <div className="irrigation-empty-state">
              <div className="irrigation-empty-illustration">
                <div className="irrigation-empty-circle">
                  <Droplets size={43} />
                </div>
                <span className="irrigation-empty-leaf"><Leaf size={23} /></span>
                <span className="irrigation-empty-sun"><Sun size={22} /></span>
              </div>
              <span className="irrigation-empty-kicker">
                {t('WAITING FOR FIELD DATA', 'खेत की जानकारी का इंतजार')}
              </span>
              <h3>{t('Your field, understood.', 'आपके खेत की जरूरत समझें।')}</h3>
              <p>
                {t(
                  'Set your field conditions and we will prepare a practical irrigation recommendation.',
                  'खेत की स्थिति चुनें और हम आपके लिए सिंचाई की सलाह तैयार करेंगे।'
                )}
              </p>
              <div className="irrigation-empty-hint">
                <ArrowRight size={16} />
                {t('Complete the field assessment to continue', 'आगे बढ़ने के लिए खेत की जानकारी भरें')}
              </div>
            </div>
          )}

          {loading && (
            <div className="irrigation-loading-state">
              <div className="irrigation-loading-icon">
                <Droplets size={35} />
                <span />
              </div>
              <h3>{t('Reading your field conditions...', 'खेत की स्थिति समझी जा रही है...')}</h3>
              <p>{t('Preparing your irrigation recommendation', 'सिंचाई की सलाह तैयार हो रही है')}</p>
              <div className="irrigation-loading-bar"><span /></div>
            </div>
          )}

          {result && !loading && (
            <div className="irrigation-report">
              <div className={`irrigation-decision-card ${cfg.className}`}>
                <div className="irrigation-decision-top">
                  <div className="irrigation-decision-icon">
                    <UrgencyIcon size={26} />
                  </div>
                  <span className="irrigation-decision-tag">
                    {t('FIELD DECISION', 'खेत का निर्णय')}
                  </span>
                </div>

                <h3>
                  {result.irrigation_required
                    ? t('Irrigation Required', 'सिंचाई आवश्यक है')
                    : t('No Irrigation Needed', 'अभी सिंचाई की जरूरत नहीं')}
                </h3>
                <p className="irrigation-decision-hindi">
                  {isHindi ? cfg.hindi : cfg.label}
                </p>
                <p className="irrigation-decision-reason">{result.reason}</p>
              </div>

              {result.irrigation_required && (
                <div className="irrigation-metrics-grid">
                  <MetricCard
                    icon={Droplets}
                    label={t('Recommended Water', 'अनुशंसित पानी')}
                    value={result.recommended_amount_mm ?? '—'}
                    unit=" mm"
                    tone="water"
                  />
                  <MetricCard
                    icon={Clock}
                    label={t('Next Moisture Check', 'अगली जांच')}
                    value={result.next_check_hours ?? '—'}
                    unit=" hrs"
                    tone="time"
                  />
                </div>
              )}

              <div className="irrigation-advice-card">
                <div className="irrigation-advice-icon"><Droplets size={19} /></div>
                <div>
                  <span>{t('RECOMMENDED METHOD', 'सुझाया गया तरीका')}</span>
                  <h4>{result.method_suggestion || t('Follow local agricultural guidance', 'स्थानीय कृषि सलाह का पालन करें')}</h4>
                </div>
              </div>

              <div className="irrigation-advice-card">
                <div className="irrigation-advice-icon irrigation-clock-icon"><Clock size={19} /></div>
                <div>
                  <span>{t('NEXT SOIL CHECK', 'मिट्टी की अगली जांच')}</span>
                  <h4>
                    {t('Check again in', 'दोबारा जांचें')} {result.next_check_hours ?? '—'} {t('hours', 'घंटे')}
                  </h4>
                </div>
              </div>

              <div className="irrigation-saving-tip">
                <div className="irrigation-tip-icon">✦</div>
                <div>
                  <span>{t('WATER CONSERVATION NOTE', 'जल संरक्षण की सलाह')}</span>
                  <h4>{t('A little care saves more water.', 'थोड़ी सावधानी, पानी की बचत।')}</h4>
                  <p>{result.water_saving_tip || t('Monitor soil moisture regularly.', 'मिट्टी की नमी की नियमित जांच करें।')}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="irrigation-reset-button"
              >
                <RefreshCw size={17} />
                {t('Check Different Conditions', 'दूसरी स्थिति की जांच करें')}
              </button>
            </div>
          )}

          {error && (
            <div className="irrigation-error">
              <AlertTriangle size={20} />
              <div>
                <strong>{t('Unable to prepare recommendation', 'सलाह तैयार नहीं हो सकी')}</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="irrigation-page-footer">
        <span><Leaf size={16} /> {t('SMART FARMING • RESPONSIBLE WATER USE', 'स्मार्ट खेती • जिम्मेदार जल उपयोग')}</span>
        <span>{t('Better decisions begin with better information.', 'बेहतर जानकारी से बेहतर निर्णय।')}</span>
      </footer>
    </main>
  )
}
