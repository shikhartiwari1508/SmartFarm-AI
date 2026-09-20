import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Bug, AlertTriangle, CheckCircle, XCircle, ImageIcon, Loader2, RefreshCw, ShieldAlert, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'
import { detectDisease } from '../services/api'

const SEVERITY_CONFIG = {
  None: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/40', badge: 'badge-success' },
  Low: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/40', badge: 'badge-warning' },
  Medium: { color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-700/40', badge: 'badge-warning' },
  High: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/40', badge: 'badge-danger' },
}

export default function DiseaseDetection() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Invalid file. Please upload a JPG, PNG or WebP image under 5MB.')
      return
    }
    const f = accepted[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a leaf image first.'); return }
    setLoading(true)
    setError(null)
    try {
      const data = await detectDisease(file)
      setResult(data)
      toast.success('Disease analysis complete!')
    } catch (e) {
      setError(e.message)
      toast.error('Analysis failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const sev = result ? (SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.Low) : null

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-900/40 border border-red-700/40 rounded-xl flex items-center justify-center">
            <Bug className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Disease Detection</h1>
            <p className="text-gray-400 text-sm">Upload a crop/leaf photo for AI-powered disease analysis</p>
          </div>
        </div>
        <div className="demo-badge mt-3">
          <AlertTriangle className="w-3 h-3" />
          Demo Mode — AI model integration ready. Predictions are simulated.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 text-center
              ${isDragActive
                ? 'border-primary-500 bg-primary-900/20'
                : preview
                  ? 'border-gray-700 bg-gray-800/30'
                  : 'border-gray-700 bg-gray-800/20 hover:border-primary-600 hover:bg-primary-900/10'
              }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="space-y-3">
                <img
                  src={preview}
                  alt="Uploaded leaf"
                  className="max-h-64 mx-auto rounded-xl object-contain shadow-lg"
                />
                <p className="text-gray-400 text-sm">{file?.name}</p>
                <p className="text-xs text-gray-500">Click or drag to replace</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-gray-700/50 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-gray-500" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">
                    {isDragActive ? 'Drop the image here!' : 'Drag & Drop a Leaf Photo'}
                  </p>
                  <p className="text-gray-400 text-sm">or click to browse files</p>
                  <p className="text-gray-600 text-xs mt-2">Supports JPG, PNG, WebP · Max 5MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary-400" />
              Photo Tips for Better Results
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-400">
              {[
                'Take close-up photo of affected leaf',
                'Ensure good lighting — avoid shadows',
                'Capture the full leaf including edges',
                'Use the most affected leaf for diagnosis',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-primary-500 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4" />
                  Analyze Disease
                </>
              )}
            </button>
            {(file || result) && (
              <button onClick={handleReset} className="btn-secondary px-4">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-900/20 border border-red-700/40 rounded-xl p-4">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-medium">Analysis Failed</p>
                <p className="text-red-400/70 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div>
          {loading && (
            <div className="glass-card p-8 text-center space-y-4 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
              </div>
              <div>
                <p className="text-white font-medium">AI Analyzing Your Image</p>
                <p className="text-gray-400 text-sm mt-1">Scanning for disease patterns...</p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                {['Preprocessing image', 'Extracting features', 'Running classification'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="glass-card p-8 text-center h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-10 h-10 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-300 font-medium">No Analysis Yet</p>
                <p className="text-gray-500 text-sm mt-1">Upload a leaf photo and click Analyze</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4 animate-slide-up">
              {/* Main Result */}
              <div className={`glass-card p-5 border ${sev.border}`}>
                {result.is_demo && (
                  <div className="demo-badge mb-3 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    Demo Prediction — Not a real AI diagnosis
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">{result.disease_name}</h2>
                    <p className="text-gray-400 text-sm mt-0.5">Disease Analysis Result</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sev.border} ${sev.color} ${sev.bg}`}>
                    {result.severity === 'None' ? '✅ Healthy' : `⚠️ ${result.severity} Severity`}
                  </span>
                </div>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>AI Confidence</span>
                    <span className={sev.color}>{result.confidence}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${result.severity === 'None' ? 'bg-green-500' : result.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                <p className="text-gray-300 text-sm">{result.description}</p>
              </div>

              {/* Causes */}
              {result.causes?.length > 0 && (
                <div className="glass-card p-4">
                  <h3 className="font-semibold text-orange-300 mb-3 flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4" /> Possible Causes
                  </h3>
                  <ul className="space-y-2">
                    {result.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-orange-400 font-bold mt-0.5">{i + 1}.</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention */}
              <div className="glass-card p-4">
                <h3 className="font-semibold text-primary-300 mb-3 flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" /> Recommended Actions
                </h3>
                <ul className="space-y-2">
                  {result.prevention.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div className="bg-primary-900/20 border border-primary-700/30 rounded-xl p-4">
                <h3 className="font-semibold text-primary-300 mb-2 text-sm">📋 Next Steps</h3>
                <p className="text-gray-300 text-sm">{result.next_steps}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
