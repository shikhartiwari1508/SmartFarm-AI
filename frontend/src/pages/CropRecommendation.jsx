import { useState } from 'react'
import { Sprout, Info, Loader2, CheckCircle, Thermometer, Droplets, CloudRain, AlertTriangle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { recommendCrop } from '../services/api'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export default function CropRecommendation() {
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
      [name]: ['season', 'location'].includes(name) ? value : parseFloat(value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await recommendCrop(form)
      setResult(res)
      toast.success("Recommendation Ready!")
    } catch (err) {
      toast.error(err.message || "Failed to get recommendation")
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { subject: 'Nitrogen', A: form.nitrogen, fullMark: 150 },
    { subject: 'Phosphorus', A: form.phosphorus, fullMark: 100 },
    { subject: 'Potassium', A: form.potassium, fullMark: 100 },
    { subject: 'pH', A: form.ph * 10, fullMark: 140 },
    { subject: 'Temp', A: form.temperature, fullMark: 50 },
    { subject: 'Humidity', A: form.humidity, fullMark: 100 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-900/40 border border-green-700/40 rounded-xl flex items-center justify-center">
          <Sprout className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Crop Recommendation</h1>
          <p className="text-gray-400 text-sm">AI analysis to find the best crop for your soil and climate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Nitrogen (N)</label>
              <input type="number" name="nitrogen" value={form.nitrogen} onChange={handleChange} className="input-field" required min="0" max="200" />
            </div>
            <div>
              <label className="input-label">Phosphorus (P)</label>
              <input type="number" name="phosphorus" value={form.phosphorus} onChange={handleChange} className="input-field" required min="0" max="200" />
            </div>
            <div>
              <label className="input-label">Potassium (K)</label>
              <input type="number" name="potassium" value={form.potassium} onChange={handleChange} className="input-field" required min="0" max="200" />
            </div>
            <div>
              <label className="input-label">Soil pH</label>
              <input type="number" name="ph" value={form.ph} onChange={handleChange} className="input-field" step="0.1" required min="0" max="14" />
            </div>
            <div>
              <label className="input-label">Temp (°C)</label>
              <input type="number" name="temperature" value={form.temperature} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Humidity (%)</label>
              <input type="number" name="humidity" value={form.humidity} onChange={handleChange} className="input-field" required min="0" max="100" />
            </div>
            <div>
              <label className="input-label">Rainfall (mm)</label>
              <input type="number" name="rainfall" value={form.rainfall} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Season</label>
              <select name="season" value={form.season} onChange={handleChange} className="input-field">
                <option>Kharif</option><option>Rabi</option><option>Zaid</option>
              </select>
            </div>
            <div>
              <label className="input-label">Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sprout className="w-5 h-5" />}
            Get AI Recommendation
          </button>
        </form>

        {/* Results */}
        <div>
          {!result && !loading && (
             <div className="glass-card p-8 h-full flex items-center justify-center text-gray-400 text-center">
               Enter your farm details to get AI crop recommendations based on agronomic data.
             </div>
          )}
          {loading && (
             <div className="glass-card p-8 h-full flex flex-col items-center justify-center">
               <Loader2 className="w-10 h-10 text-primary-400 animate-spin mb-4" />
               <p className="text-white">Analyzing soil and climate data...</p>
             </div>
          )}
          {result && !loading && (
            <div className="space-y-4 animate-slide-up">
              <div className="glass-card p-6 border border-primary-500/30 bg-primary-900/10">
                {result.is_demo && <div className="demo-badge mb-3"><AlertTriangle className="w-3 h-3" /> Demo Mode Active</div>}
                <div className="text-gray-400 text-sm mb-1">Highly Recommended Crop</div>
                <div className="text-5xl font-display font-bold text-gradient">{result.recommended_crop}</div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="bg-primary-900/50 px-3 py-1 rounded-full text-primary-300 text-sm font-semibold">
                    Score: {result.suitability_score}%
                  </div>
                  <div className="text-sm text-gray-400">{result.season_info}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-400"/> Tips</h3>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {result.farming_tips.map((t, i) => <li key={i}>• {t}</li>)}
                  </ul>
                </div>
                <div className="glass-card p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Current vs Optimal</h3>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="subject" tick={{fill: '#9ca3af', fontSize: 10}} />
                        <Radar name="Current" dataKey="A" stroke="#4ade80" fill="#4ade80" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {result.alternative_crops?.length > 0 && (
                <div className="glass-card p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Alternatives</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {result.alternative_crops.map(c => (
                      <div key={c.crop} className="bg-gray-800/50 p-2 rounded-lg text-center border border-gray-700">
                        <div className="font-bold text-white text-sm">{c.crop}</div>
                        <div className="text-xs text-gray-400">{c.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button onClick={() => setResult(null)} className="btn-secondary w-full">
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
