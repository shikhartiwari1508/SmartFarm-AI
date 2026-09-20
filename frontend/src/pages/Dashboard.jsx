import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout, Droplets, Cloud, Bug, Brain, MapPin, Thermometer, Wind, Activity, Clock, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { getFarmProfile, getFarmSummary, getWeather, getInsights } from '../services/api'
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function Dashboard() {
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
        toast.error("Failed to load some dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-primary-400">Loading Dashboard...</div>
  }

  const npkData = data.summary?.soil_metrics ? [
    { name: 'Nitrogen', value: data.summary.soil_metrics.nitrogen, fill: '#4ade80' },
    { name: 'Phosphorus', value: data.summary.soil_metrics.phosphorus, fill: '#60a5fa' },
    { name: 'Potassium', value: data.summary.soil_metrics.potassium, fill: '#f97316' }
  ] : []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Farm Dashboard</h1>
          <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Farmer Profile */}
      <div className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-emerald-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {data.profile?.farmer_name?.charAt(0) || 'F'}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{data.profile?.farmer_name || 'Demo Farmer'}</h2>
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
            <MapPin className="w-4 h-4" /> {data.profile?.location || 'Location not set'}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
          <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400">Farm Area</div>
            <div className="font-semibold text-white">{data.profile?.area_acres || 0} Acres</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400">Current Crop</div>
            <div className="font-semibold text-primary-400">{data.profile?.current_crop || 'None'}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400">Soil Type</div>
            <div className="font-semibold text-earth-300">{data.profile?.soil_type || 'Unknown'}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400">Health Score</div>
            <div className="font-semibold text-blue-400">{data.profile?.soil_health_score || 0}/100</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <Thermometer className="w-6 h-6 text-orange-400" />
            <span className="text-xs text-gray-500">Current</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{data.weather?.current?.temperature || '--'}°C</div>
            <div className="text-sm text-gray-400">Temperature</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <Droplets className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-gray-500">Current</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{data.weather?.current?.humidity || '--'}%</div>
            <div className="text-sm text-gray-400">Humidity</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <Cloud className="w-6 h-6 text-sky-400" />
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-white truncate">{data.weather?.current?.condition || '--'}</div>
            <div className="text-sm text-gray-400">Weather</div>
          </div>
        </div>
        <div className="metric-card border-primary-500/30">
          <div className="flex justify-between items-start">
            <Activity className="w-6 h-6 text-primary-400" />
            <span className="text-xs text-primary-500">AI Analyzed</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{data.insights?.farm_health_score || '--'}/100</div>
            <div className="text-sm text-gray-400">Farm Health</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NPK Chart */}
        <div className="glass-card p-6 lg:col-span-1">
          <h3 className="font-semibold text-white mb-4">Soil Nutrients (NPK)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={15} data={npkData}>
                <RadialBar minAngle={15} background clockWise dataKey="value" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }}/>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Modules */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="font-semibold text-white mb-4">AI Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { path: '/crops', icon: Sprout, label: 'Crop Recommendation', desc: 'AI suggests best crops', color: 'text-green-400' },
              { path: '/disease', icon: Bug, label: 'Disease Detection', desc: 'Scan leaves for disease', color: 'text-red-400' },
              { path: '/irrigation', icon: Droplets, label: 'Smart Irrigation', desc: 'Optimize water usage', color: 'text-blue-400' },
              { path: '/weather', icon: Cloud, label: 'Weather Intel', desc: 'Farm-specific forecasts', color: 'text-sky-400' },
              { path: '/insights', icon: Brain, label: 'AI Insights', desc: 'Actionable farm analytics', color: 'text-purple-400' },
              { path: '/chat', icon: MessageSquare, label: 'Farm Assistant', desc: 'Ask agriculture questions', color: 'text-yellow-400' }
            ].map((mod, i) => (
              <button key={i} onClick={() => navigate(mod.path)} className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/40 border border-gray-700 hover:border-gray-500 transition-all text-left">
                <div className={`p-2 rounded-lg bg-gray-900 ${mod.color}`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-white">{mod.label}</div>
                  <div className="text-xs text-gray-400">{mod.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
