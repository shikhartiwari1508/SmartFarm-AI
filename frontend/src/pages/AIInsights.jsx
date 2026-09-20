import { useState, useEffect } from 'react'
import { Brain, AlertTriangle, CheckCircle, Info, Lightbulb, RefreshCw, Loader2, ArrowRight } from 'lucide-react'
import { getInsights } from '../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500' },
  success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500' },
  tip: { icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500' }
}

const ACTION_MAP = {
  'Check Irrigation': '/irrigation',
  'View Disease Detection': '/disease',
  'Get Crop Recommendation': '/crops'
}

export default function AIInsights() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const res = await getInsights()
      setData(res)
    } catch (e) {
      toast.error("Failed to load insights")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInsights() }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-900/40 border border-yellow-700/40 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">AI Insights</h1>
            <p className="text-gray-400 text-sm">Smart contextual analysis of your farm conditions</p>
          </div>
        </div>
        <button onClick={fetchInsights} className="btn-secondary px-4 py-2">
           {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4" />}
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
           {[...Array(4)].map((_, i) => <div key={i} className="glass-card h-32 skeleton" />)}
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="glass-card p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-l-4 border-l-primary-500">
             <div className="text-gray-400 text-sm mb-1">Overall Farm Health Score</div>
             <div className="text-4xl font-display font-bold text-white">{data?.farm_health_score}/100</div>
             <p className="text-sm mt-2 text-gray-300">Generated on {data?.generated_at}</p>
          </div>

          {data?.insights.map((insight, idx) => {
            const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info
            const Icon = config.icon
            return (
              <div key={idx} className={`glass-card p-5 border-l-4 ${config.border} flex flex-col sm:flex-row gap-4 items-start`}>
                 <div className={`p-3 rounded-full ${config.bg} ${config.color} shrink-0`}>
                   <Icon className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                   <h3 className="font-bold text-white text-lg mb-1">{insight.title}</h3>
                   <p className="text-gray-300">{insight.message}</p>
                 </div>
                 {insight.action && (
                   <button 
                     onClick={() => navigate(ACTION_MAP[insight.action] || '/dashboard')}
                     className="mt-4 sm:mt-0 shrink-0 flex items-center gap-2 text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600"
                   >
                     {insight.action} <ArrowRight className="w-4 h-4" />
                   </button>
                 )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
