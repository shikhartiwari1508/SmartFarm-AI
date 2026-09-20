import { useState, useEffect } from 'react'
import { Droplets, Loader2, CheckCircle, XCircle, AlertTriangle, Clock, Leaf, Thermometer, CloudRain, Wind, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { getIrrigationRecommendation, getIrrigationCrops } from '../services/api'

const URGENCY_CONFIG = {
  None: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/40', label: 'No Irrigation Needed', icon: CheckCircle },
  Low: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/40', label: 'Low Urgency', icon: AlertTriangle },
  Medium: { color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-700/40', label: 'Moderate Urgency', icon: AlertTriangle },
  High: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/40', label: 'Urgent!', icon: XCircle },
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

function SliderInput({ label, name, value, min, max, unit, icon: Icon, color, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="input-label flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          {label}
        </label>
        <span className={`text-sm font-bold ${color}`}>{value}{unit}</span>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full accent-green-500 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

export default function SmartIrrigation() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const stages = CROP_STAGES[form.crop_type] || ['Vegetative']

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: ['crop_type', 'growth_stage'].includes(name) ? value : parseFloat(value),
      ...(name === 'crop_type' ? { growth_stage: (CROP_STAGES[value] || ['Vegetative'])[0] } : {})
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await getIrrigationRecommendation(form)
      setResult(data)
      toast.success('Irrigation recommendation ready!')
    } catch (e) {
      setError(e.message)
      toast.error('Failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const cfg = result ? (URGENCY_CONFIG[result.urgency] || URGENCY_CONFIG.None) : null
  const UrgencyIcon = cfg?.icon || CheckCircle

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-900/40 border border-blue-700/40 rounded-xl flex items-center justify-center">
          <Droplets className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Smart Irrigation</h1>
          <p className="text-gray-400 text-sm">AI-powered water requirement recommendation for your crops</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          <h2 className="font-semibold text-gray-200 text-sm uppercase tracking-wider">Field Conditions</h2>

          {/* Sliders */}
          <SliderInput label="Soil Moisture" name="soil_moisture" value={form.soil_moisture}
            min={0} max={100} unit="%" icon={Droplets} color="text-blue-400" onChange={handleChange} />
          <SliderInput label="Temperature" name="temperature" value={form.temperature}
            min={0} max={60} unit="°C" icon={Thermometer} color="text-orange-400" onChange={handleChange} />
          <SliderInput label="Humidity" name="humidity" value={form.humidity}
            min={0} max={100} unit="%" icon={Wind} color="text-sky-400" onChange={handleChange} />
          <SliderInput label="Recent Rainfall" name="rainfall" value={form.rainfall}
            min={0} max={200} unit="mm" icon={CloudRain} color="text-indigo-400" onChange={handleChange} />

          {/* Crop & Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary-400" /> Crop Type
              </label>
              <select name="crop_type" value={form.crop_type} onChange={handleChange} className="input-field">
                {Object.keys(CROP_STAGES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Growth Stage</label>
              <select name="growth_stage" value={form.growth_stage} onChange={handleChange} className="input-field">
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Calculating...</> : <><Droplets className="w-4 h-4" />Get Irrigation Recommendation</>}
          </button>
        </form>

        {/* Result */}
        <div>
          {!result && !loading && (
            <div className="glass-card p-8 text-center h-full flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-blue-900/20 border border-blue-700/20 rounded-full flex items-center justify-center">
                <Droplets className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-400">Set your field conditions and get an instant irrigation recommendation.</p>
            </div>
          )}

          {loading && (
            <div className="glass-card p-8 text-center h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              <p className="text-white">Calculating water requirements...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-slide-up">
              {/* Main Decision Card */}
              <div className={`rounded-2xl p-6 border ${cfg.border} ${cfg.bg}`}>
                <div className="flex items-center gap-3 mb-4">
                  <UrgencyIcon className={`w-8 h-8 ${cfg.color}`} />
                  <div>
                    <div className={`text-2xl font-display font-bold ${cfg.color}`}>
                      {result.irrigation_required ? '💧 Irrigation Required' : '✅ No Irrigation Needed'}
                    </div>
                    <div className={`text-sm ${cfg.color} opacity-80`}>{cfg.label}</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{result.reason}</p>
              </div>

              {/* Metrics Row */}
              {result.irrigation_required && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-4 text-center">
                    <div className="text-3xl font-display font-bold text-blue-400">{result.recommended_amount_mm}</div>
                    <div className="text-xs text-gray-400 mt-1">mm Water Required</div>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <div className="text-3xl font-display font-bold text-orange-400">{result.next_check_hours}h</div>
                    <div className="text-xs text-gray-400 mt-1">Next Check</div>
                  </div>
                </div>
              )}

              {/* Method */}
              <div className="glass-card p-4 flex items-start gap-3">
                <Droplets className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-200 mb-1">Recommended Method</div>
                  <div className="text-sm text-gray-400">{result.method_suggestion}</div>
                </div>
              </div>

              {/* Next Check */}
              <div className="glass-card p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-200 mb-1">Next Moisture Check</div>
                  <div className="text-sm text-gray-400">Check soil moisture again in <span className="text-primary-400 font-semibold">{result.next_check_hours} hours</span></div>
                </div>
              </div>

              {/* Water Saving Tip */}
              <div className="bg-primary-900/20 border border-primary-700/30 rounded-xl p-4 flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <div className="text-sm font-medium text-primary-300 mb-1">Water Saving Tip</div>
                  <div className="text-sm text-gray-300">{result.water_saving_tip}</div>
                </div>
              </div>

              <button onClick={() => setResult(null)} className="btn-secondary w-full">
                <RefreshCw className="w-4 h-4" /> Try Different Conditions
              </button>
            </div>
          )}

          {error && (
            <div className="glass-card p-4 border border-red-700/40">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
