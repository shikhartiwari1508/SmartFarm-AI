import { useState, useEffect } from 'react'
import { Cloud, Thermometer, Droplets, Wind, Sun, CloudRain, CloudLightning, Loader2, MapPin, RefreshCw, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getWeather } from '../services/api'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const WEATHER_ICONS = {
  'sun': '☀️',
  'cloud-sun': '⛅',
  'cloud': '☁️',
  'cloud-rain': '🌧️',
  'cloud-heavy-rain': '🌊',
  'cloud-lightning': '⛈️',
  default: '🌤️',
}

const LOCATIONS = ['Maharashtra', 'Punjab', 'Rajasthan', 'Kerala', 'UP', 'Bihar', 'Karnataka', 'Tamil Nadu', 'Gujarat']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs">
        <p className="text-gray-300 font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}{p.name.includes('Temp') ? '°C' : '%'}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function WeatherDashboard() {
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
      setError(e.message)
      toast.error('Failed to fetch weather: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWeather() }, [])

  const handleLocationChange = (e) => {
    setLocation(e.target.value)
  }

  const handleRefresh = () => fetchWeather(location)

  const chartData = weather?.forecast?.map(d => ({
    day: d.day_name.slice(0, 3),
    'Max Temp': d.max_temp,
    'Min Temp': d.min_temp,
    'Rain %': d.rain_probability,
    humidity: d.humidity,
  })) || []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-900/40 border border-sky-700/40 rounded-xl flex items-center justify-center">
            <Cloud className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Weather Intelligence</h1>
            <p className="text-gray-400 text-sm">Real-time weather insights for smart farming decisions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={location}
            onChange={handleLocationChange}
            className="input-field w-auto"
          >
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={handleRefresh} disabled={loading} className="btn-secondary px-4 py-3">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {weather?.is_demo && (
        <div className="demo-badge">
          <AlertTriangle className="w-3 h-3" />
          Demo Mode — Connect OpenWeatherMap API for real weather data
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-28 skeleton rounded-2xl" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="glass-card p-6 text-center border border-red-700/40">
          <p className="text-red-400">{error}</p>
          <button onClick={handleRefresh} className="btn-primary mt-4">Retry</button>
        </div>
      )}

      {weather && !loading && (
        <>
          {/* Current Weather Hero */}
          <div className="glass-card p-6 bg-gradient-to-r from-sky-900/30 to-blue-900/20 border-sky-700/30">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="text-6xl md:text-8xl">
                {WEATHER_ICONS[weather.current.icon] || WEATHER_ICONS.default}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sky-400 text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  {weather.current.location}
                  <span className="text-gray-500">· Updated {weather.current.updated_at}</span>
                </div>
                <div className="font-display text-5xl font-bold text-white">{weather.current.temperature}°C</div>
                <div className="text-gray-300 text-lg mt-1">{weather.current.description}</div>
                <div className="text-gray-400 text-sm">Feels like {weather.current.feels_like}°C</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:min-w-48">
                {[
                  { icon: Droplets, label: 'Humidity', value: `${weather.current.humidity}%`, color: 'text-blue-400' },
                  { icon: Wind, label: 'Wind Speed', value: `${weather.current.wind_speed} km/h ${weather.current.wind_direction}`, color: 'text-sky-400' },
                  { icon: CloudRain, label: 'Rain Chance', value: `${weather.current.rain_probability}%`, color: 'text-indigo-400' },
                  { icon: Thermometer, label: 'Pressure', value: `${weather.current.pressure} hPa`, color: 'text-orange-400' },
                ].map(({ icon: Icon, label, value, color }, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                    <div>
                      <div className="text-xs text-gray-500">{label}</div>
                      <div className={`text-sm font-medium ${color}`}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farming Advisory */}
          <div className="bg-primary-900/20 border border-primary-700/30 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <div className="font-semibold text-primary-300 mb-1">Farming Advisory</div>
              <div className="text-gray-300 text-sm">{weather.farming_advisory}</div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div>
            <h2 className="font-semibold text-gray-200 mb-3">5-Day Forecast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weather.forecast.map((day, i) => (
                <div key={i} className="glass-card p-4 text-center hover:border-sky-700/40 transition-colors card-hover">
                  <div className="text-xs text-gray-400 mb-2">{day.day_name.slice(0, 3)}</div>
                  <div className="text-3xl mb-2">{WEATHER_ICONS[day.icon] || '🌤️'}</div>
                  <div className="text-white font-bold text-sm">{day.max_temp}°</div>
                  <div className="text-gray-500 text-xs">{day.min_temp}°</div>
                  <div className="mt-2 text-xs text-blue-400">💧 {day.rain_probability}%</div>
                  <div className="text-xs text-gray-500 mt-1">{day.condition}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="font-semibold text-gray-200 mb-4 text-sm">Temperature Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Max Temp" stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="Min Temp" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5">
              <h3 className="font-semibold text-gray-200 mb-4 text-sm">Rain Probability (%)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Rain %" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
