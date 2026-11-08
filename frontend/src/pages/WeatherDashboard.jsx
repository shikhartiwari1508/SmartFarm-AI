import { useLanguage } from '../context/LanguageContext'
import { useState, useEffect } from 'react'
import {
  Cloud, CloudSun, Sun, CloudRain, CloudLightning,
  Thermometer, Droplets, Wind, Gauge, MapPin,
  RefreshCw, AlertTriangle, Sprout, ArrowUpRight,
  Umbrella, Leaf, CalendarDays, CloudDrizzle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getWeather } from '../services/api'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

const LOCATIONS = [
  'Maharashtra', 'Punjab', 'Rajasthan', 'Kerala',
  'UP', 'Bihar', 'Karnataka', 'Tamil Nadu', 'Gujarat'
]

const WEATHER_TYPES = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  'cloud-heavy-rain': CloudDrizzle,
  'cloud-lightning': CloudLightning,
}

const getWeatherIcon = (code) => WEATHER_TYPES[code] || CloudSun

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="weather-chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item, index) => (
        <p key={index} style={{ color: item.color }}>
          {item.name}: {item.value}{item.name.includes('Temp') ? '°C' : '%'}
        </p>
      ))}
    </div>
  )
}

const Metric = ({ icon: Icon, label, value, note, tone = 'green' }) => (
  <article className={`weather-metric weather-metric-${tone}`}>
    <div className="weather-metric-top">
      <span>{label}</span>
      <div className="weather-metric-icon"><Icon size={19} /></div>
    </div>
    <strong>{value}</strong>
    {note && <small>{note}</small>}
  </article>
)

export default function WeatherDashboard() {
  const { t, language } = useLanguage()
  const isHindi = language === 'hi'

  const [location, setLocation] = useState('Maharashtra')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWeather = async (loc = location) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getWeather(loc)
      setWeather(data)
    } catch (e) {
      setError(e.message || 'Unable to fetch weather information.')
      toast.error(t('Weather could not be loaded.', 'मौसम की जानकारी नहीं मिल सकी।'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  const current = weather?.current
  const forecast = Array.isArray(weather?.forecast) ? weather.forecast : []

  const chartData = forecast.map(day => ({
    day: day.day_name?.slice(0, 3) || '--',
    'Max Temp': Number(day.max_temp) || 0,
    'Min Temp': Number(day.min_temp) || 0,
    'Rain %': Number(day.rain_probability) || 0,
  }))

  const CurrentIcon = getWeatherIcon(current?.icon)

  return (
    <main className="weather-studio">

      <header className="weather-page-heading">
        <div>
          <div className="weather-eyebrow">
            <span />
            SMARTFARM AI <i>·</i> CLIMATE & FIELD INTELLIGENCE
          </div>
          <h1>
            {t('Weather shapes every harvest.', 'मौसम तय करता है हर फसल का भविष्य।')}
          </h1>
          <p>
            {t(
              'Understand the skies. Make better decisions for your fields.',
              'मौसम को समझें और अपने खेत के लिए बेहतर फैसले लें।'
            )}
          </p>
        </div>

        <div className="weather-controls">
          <label className="weather-location-select">
            <MapPin size={17} />
            <select value={location} onChange={e => setLocation(e.target.value)}>
              {LOCATIONS.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="weather-refresh"
            onClick={() => fetchWeather(location)}
            disabled={loading}
            aria-label="Refresh weather"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            <span>{t('Refresh', 'रिफ्रेश')}</span>
          </button>
        </div>
      </header>

      {weather?.is_demo && (
        <div className="weather-demo-notice">
          <AlertTriangle size={16} />
          <span>
            {t(
              'Demo weather data · Connect OpenWeatherMap for live conditions.',
              'डेमो मौसम डेटा · लाइव जानकारी के लिए OpenWeatherMap कनेक्ट करें।'
            )}
          </span>
        </div>
      )}

      {loading && (
        <div className="weather-loading-grid">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="weather-skeleton" />
          ))}
        </div>
      )}

      {error && !loading && (
        <section className="weather-error-panel">
          <AlertTriangle size={30} />
          <h2>{t('Weather information unavailable', 'मौसम की जानकारी उपलब्ध नहीं है')}</h2>
          <p>{error}</p>
          <button type="button" onClick={() => fetchWeather(location)}>
            {t('Try again', 'दोबारा कोशिश करें')}
          </button>
        </section>
      )}

      {current && !loading && (
        <>
          <section className="weather-current-hero">
            <img
              src="/images/dashboard-hero.jpg"
              alt="Agricultural fields"
              className="weather-hero-image"
            />
            <div className="weather-hero-shade" />

            <div className="weather-hero-content">
              <div className="weather-live-label">
                <span />
                {t('CURRENT FIELD CONDITIONS', 'वर्तमान मौसम की स्थिति')}
              </div>

              <div className="weather-place">
                <MapPin size={17} />
                {current.location || location}
              </div>

              <div className="weather-temperature-line">
                <CurrentIcon size={66} strokeWidth={1.35} />
                <strong>{current.temperature}<sup>°C</sup></strong>
              </div>

              <h2>{current.description}</h2>
              <p className="weather-feels">
                {t('Feels like', 'अनुभव तापमान')} {current.feels_like}°C
                <span> · </span>
                {t('Updated', 'अपडेट')} {current.updated_at}
              </p>
            </div>

            <div className="weather-hero-caption">
              <Sprout size={17} />
              {t('A closer look at your farming climate', 'आपकी खेती के मौसम की पूरी जानकारी')}
            </div>
          </section>

          <section className="weather-metrics-grid">
            <Metric
              icon={Droplets}
              label={t('Humidity', 'नमी')}
              value={`${current.humidity}%`}
              note={t('Air moisture', 'हवा में नमी')}
              tone="blue"
            />
            <Metric
              icon={Wind}
              label={t('Wind speed', 'हवा की गति')}
              value={`${current.wind_speed} km/h`}
              note={current.wind_direction || t('Wind direction', 'हवा की दिशा')}
              tone="green"
            />
            <Metric
              icon={Umbrella}
              label={t('Rain probability', 'बारिश की संभावना')}
              value={`${current.rain_probability}%`}
              note={t('Chance of rainfall', 'वर्षा की संभावना')}
              tone="blue"
            />
            <Metric
              icon={Gauge}
              label={t('Air pressure', 'वायुदाब')}
              value={`${current.pressure} hPa`}
              note={t('Atmospheric pressure', 'वायुमंडलीय दबाव')}
              tone="earth"
            />
          </section>

          <section className="weather-advisory">
            <div className="weather-advisory-symbol"><Sprout size={28} /></div>
            <div className="weather-advisory-copy">
              <span>{t('ADVICE FOR THE FARMER', 'किसानों के लिए सलाह')}</span>
              <h2>{t('Farming advisory', 'खेती संबंधी सलाह')}</h2>
              <p>{weather.farming_advisory || t('No advisory is available at the moment.', 'फिलहाल कोई सलाह उपलब्ध नहीं है।')}</p>
            </div>
            <div className="weather-advisory-mark">FIELD<br />NOTE</div>
          </section>

          <section className="weather-forecast-section">
            <div className="weather-section-heading">
              <div>
                <span>{t('PLAN AHEAD', 'आगे की तैयारी')}</span>
                <h2>{t('The coming five days', 'आने वाले पाँच दिन')}</h2>
                <p>{t('A forecast to help you plan field activities.', 'खेत के काम की योजना बनाने के लिए मौसम का अनुमान।')}</p>
              </div>
              <CalendarDays size={27} />
            </div>

            <div className="weather-forecast-grid">
              {forecast.map((day, index) => {
                const DayIcon = getWeatherIcon(day.icon)
                return (
                  <article key={`${day.day_name}-${index}`} className={`weather-day-card ${index === 0 ? 'weather-day-today' : ''}`}>
                    <span className="weather-day-label">
                      {index === 0 ? t('TODAY', 'आज') : day.day_name}
                    </span>
                    <DayIcon size={35} strokeWidth={1.5} />
                    <strong>{day.max_temp}°</strong>
                    <span className="weather-day-min">{day.min_temp}°</span>
                    <span className="weather-day-rain">
                      <Droplets size={13} /> {day.rain_probability}%
                    </span>
                    <small>{day.condition}</small>
                  </article>
                )
              })}
              {forecast.length === 0 && (
                <p className="weather-no-forecast">{t('Forecast is not available.', 'पूर्वानुमान उपलब्ध नहीं है।')}</p>
              )}
            </div>
          </section>

          <section className="weather-charts-section">
            <div className="weather-section-heading">
              <div>
                <span>{t('WEATHER PATTERNS', 'मौसम का रुझान')}</span>
                <h2>{t('Read the week ahead', 'आने वाले सप्ताह को समझें')}</h2>
                <p>{t('Temperature and rainfall probability across the forecast.', 'अगले दिनों का तापमान और बारिश की संभावना।')}</p>
              </div>
              <ArrowUpRight size={25} />
            </div>

            <div className="weather-charts-grid">
              <article className="weather-chart-card">
                <div className="weather-chart-title">
                  <div><Thermometer size={19} /><h3>{t('Temperature trend', 'तापमान का रुझान')}</h3></div>
                  <span>°C</span>
                </div>
                <ResponsiveContainer width="100%" height={245}>
                  <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weatherMaxFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b66d43" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#b66d43" stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="weatherMinFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#668b70" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#668b70" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#e9e2d5" strokeDasharray="4 5" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#718071', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#718071', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Max Temp" stroke="#ad6842" fill="url(#weatherMaxFill)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="Min Temp" stroke="#668b70" fill="url(#weatherMinFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="weather-chart-legend">
                  <span><i className="legend-max" />{t('Maximum', 'अधिकतम')}</span>
                  <span><i className="legend-min" />{t('Minimum', 'न्यूनतम')}</span>
                </div>
              </article>

              <article className="weather-chart-card">
                <div className="weather-chart-title">
                  <div><CloudRain size={19} /><h3>{t('Rain probability', 'बारिश की संभावना')}</h3></div>
                  <span>%</span>
                </div>
                <ResponsiveContainer width="100%" height={245}>
                  <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weatherRainFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#648ca0" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#648ca0" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#e9e2d5" strokeDasharray="4 5" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#718071', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#718071', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Rain %" stroke="#648ca0" fill="url(#weatherRainFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="weather-chart-footnote">
                  <Droplets size={14} />
                  {t('Rainfall chances can guide irrigation planning.', 'बारिश की संभावना सिंचाई की योजना बनाने में मदद कर सकती है।')}
                </div>
              </article>
            </div>
          </section>

          <footer className="weather-page-footer">
            <Leaf size={17} />
            <span>{t('Observe the weather. Nurture the land.', 'मौसम को समझें, धरती को सँवारें।')}</span>
            <strong>SMARTFARM AI</strong>
          </footer>
        </>
      )}
    </main>
  )
}
