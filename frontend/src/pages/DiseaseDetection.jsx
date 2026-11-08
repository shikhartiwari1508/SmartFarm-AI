import { useLanguage } from '../context/LanguageContext'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Upload, Bug, AlertTriangle, CheckCircle, XCircle,
  ImageIcon, Loader2, RefreshCw, ShieldAlert, Leaf,
  Sprout, ScanSearch, Camera, Microscope, ArrowRight,
  ClipboardCheck, ShieldCheck, Info, Activity
} from 'lucide-react'
import toast from 'react-hot-toast'
import { detectDisease } from '../services/api'

const SEVERITY_CONFIG = {
  None: { className: 'severity-none', label: 'Healthy', hindi: 'स्वस्थ' },
  Low: { className: 'severity-low', label: 'Low severity', hindi: 'कम गंभीरता' },
  Medium: { className: 'severity-medium', label: 'Medium severity', hindi: 'मध्यम गंभीरता' },
  High: { className: 'severity-high', label: 'High severity', hindi: 'अधिक गंभीरता' },
}

export default function DiseaseDetection() {
  const { t, language } = useLanguage()
  const isHindi = language === 'hi'

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error(t(
        'Invalid image. Use JPG, PNG or WebP under 5 MB.',
        'गलत इमेज। 5 MB से छोटी JPG, PNG या WebP फोटो चुनें।'
      ))
      return
    }

    const selectedFile = accepted[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
    setError(null)
  }, [t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!file) {
      toast.error(t('Please upload a leaf image first.', 'पहले पत्ते की फोटो अपलोड करें।'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await detectDisease(file)
      setResult(data)
      toast.success(t('Disease analysis complete!', 'रोग का विश्लेषण पूरा हुआ!'))
    } catch (e) {
      setError(e.message || t('Something went wrong.', 'कुछ गलत हो गया।'))
      toast.error(t('Disease analysis failed.', 'रोग का विश्लेषण नहीं हो सका।'))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const severity = result
    ? (SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.Low)
    : null

  const confidence = Math.max(
    0,
    Math.min(100, Number(result?.confidence) || 0)
  )

  const causes = Array.isArray(result?.causes) ? result.causes : []
  const prevention = Array.isArray(result?.prevention) ? result.prevention : []

  return (
    <main className="disease-studio">

      {/* Editorial heading */}
      <header className="disease-heading">
        <div>
          <div className="disease-eyebrow">
            <span />
            SMARTFARM AI <i>·</i> PLANT HEALTH INTELLIGENCE
          </div>

          <h1>
            {t('Protect your crops.', 'अपनी फसल बचाएँ।')}
            <em>{t('Recognise the signs.', 'लक्षणों को पहचानें।')}</em>
          </h1>

          <p>
            {t(
              'Examine a leaf photograph and explore possible plant health concerns with your crop diagnosis assistant.',
              'पत्ते की तस्वीर अपलोड करके फसल में संभावित रोगों और स्वास्थ्य संबंधी समस्याओं की जानकारी प्राप्त करें।'
            )}
          </p>
        </div>

        <div className="disease-heading-mark">
          <Microscope size={25} />
          <span>{t('PLANT HEALTH', 'पौधों का स्वास्थ्य')}</span>
          <strong>02 / 06</strong>
        </div>
      </header>

      {/* Visual hero */}
      <section className="disease-hero">
        <img
          src="/images/crop-mustard.jpg"
          alt="Agricultural crop field"
          className="disease-hero-image"
        />

        <div className="disease-hero-content">
          <span className="disease-hero-kicker">
            <ScanSearch size={14} />
            {t('EARLY DETECTION · BETTER PROTECTION', 'समय पर पहचान · बेहतर सुरक्षा')}
          </span>

          <h2>
            {t(
              'A healthier field begins with an attentive eye.',
              'स्वस्थ खेत की शुरुआत सही पहचान से होती है।'
            )}
          </h2>

          <p>
            {t(
              'Upload a clear photograph of an affected leaf to begin your plant health assessment.',
              'प्रभावित पत्ते की साफ तस्वीर अपलोड करें और पौधे के स्वास्थ्य की जाँच शुरू करें।'
            )}
          </p>
        </div>

        <div className="disease-hero-stamp">
          <Sprout size={32} />
          <span>{t('HEALTHY CROPS', 'स्वस्थ फसल')}</span>
        </div>
      </section>

      {/* Main workspace */}
      <div className="disease-workspace">

        {/* Upload panel */}
        <section className="disease-panel">

          <div className="disease-panel-heading">
            <div className="disease-panel-icon">
              <Camera size={21} />
            </div>

            <div>
              <span className="disease-overline">
                {t('STEP 01 · IMAGE SUBMISSION', 'चरण 01 · तस्वीर अपलोड')}
              </span>

              <h2>{t('Examine your crop', 'अपनी फसल की जाँच करें')}</h2>

              <p>
                {t(
                  'Choose a clear photograph of the affected plant leaf.',
                  'प्रभावित पौधे के पत्ते की साफ तस्वीर चुनें।'
                )}
              </p>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`disease-dropzone ${isDragActive ? 'is-active' : ''} ${preview ? 'has-image' : ''}`}
          >
            <input {...getInputProps()} />

            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Uploaded crop leaf"
                  className="disease-preview-image"
                />

                <p className="disease-file-name">{file?.name}</p>

                <p>
                  {t(
                    'Click or drop another image to replace this photograph.',
                    'दूसरी तस्वीर चुनने के लिए यहाँ क्लिक करें।'
                  )}
                </p>
              </>
            ) : (
              <>
                <div className="disease-upload-icon">
                  {isDragActive
                    ? <Upload size={29} />
                    : <ImageIcon size={29} />
                  }
                </div>

                <h3>
                  {isDragActive
                    ? t('Release to upload', 'अपलोड करने के लिए छोड़ें')
                    : t('Drop your leaf photograph here', 'पत्ते की फोटो यहाँ डालें')
                  }
                </h3>

                <p>
                  {t(
                    'Or click to browse photographs from your device.',
                    'या अपने डिवाइस से फोटो चुनने के लिए क्लिक करें।'
                  )}
                </p>

                <small>
                  JPG · PNG · WebP &nbsp; | &nbsp; {t('Maximum 5 MB', 'अधिकतम 5 MB')}
                </small>
              </>
            )}
          </div>

          {/* Photography tips */}
          <div className="disease-photo-tips">
            <h3>
              <Leaf size={16} />
              {t('How to take a useful photograph', 'अच्छी फोटो कैसे लें')}
            </h3>

            <ul>
              {[
                t('Capture the affected leaf closely.', 'प्रभावित पत्ते की पास से फोटो लें।'),
                t('Use natural light and avoid shadows.', 'प्राकृतिक रोशनी में फोटो लें।'),
                t('Keep the complete leaf visible.', 'पूरा पत्ता तस्वीर में दिखना चाहिए।'),
                t('Choose a clear, focused photograph.', 'साफ और स्पष्ट फोटो चुनें।'),
              ].map((tip, index) => (
                <li key={index}>
                  <CheckCircle size={14} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="disease-action-row">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="disease-analyze-button"
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <ScanSearch size={18} />
              }

              <span>
                {loading
                  ? t('Examining your crop...', 'फसल की जाँच हो रही है...')
                  : t('Analyse plant health', 'फसल के रोग की जाँच करें')
                }
              </span>

              {!loading && <ArrowRight size={17} />}
            </button>

            {(file || result) && (
              <button
                type="button"
                onClick={handleReset}
                className="disease-reset-button"
                title={t('Start again', 'फिर से शुरू करें')}
              >
                <RefreshCw size={17} />
              </button>
            )}
          </div>

          {error && (
            <div className="disease-error">
              <XCircle size={19} />
              <div>
                <strong>{t('Analysis could not be completed', 'विश्लेषण पूरा नहीं हो सका')}</strong>
                <div>{error}</div>
              </div>
            </div>
          )}

        </section>

        {/* Results panel */}
        <section className="disease-results-panel">

          <div className="disease-results-heading">
            <div>
              <span className="disease-overline">
                {t('STEP 02 · DIAGNOSTIC REPORT', 'चरण 02 · जाँच रिपोर्ट')}
              </span>

              <h2>{t('Plant health report', 'पौधे के स्वास्थ्य की रिपोर्ट')}</h2>
            </div>

            <div className="disease-results-heading-icon">
              <ClipboardCheck size={21} />
            </div>
          </div>

          {/* Empty state */}
          {!loading && !result && (
            <div className="disease-empty-state">
              <div className="disease-empty-art">
                <ShieldAlert size={47} />
              </div>

              <span className="disease-overline">
                {t('YOUR DIAGNOSTIC REPORT', 'आपकी जाँच रिपोर्ट')}
              </span>

              <h3>
                {t('Your crop report will appear here.', 'आपकी फसल की रिपोर्ट यहाँ दिखाई देगी।')}
              </h3>

              <p>
                {t(
                  'Upload a leaf photograph and begin the analysis to view disease details and recommended actions.',
                  'पत्ते की फोटो अपलोड करके जाँच शुरू करें। इसके बाद रोग की जानकारी और बचाव के सुझाव यहाँ मिलेंगे।'
                )}
              </p>

              <div className="disease-empty-note">
                <Info size={15} />
                {t('Your crop assessment is waiting to begin.', 'आपकी फसल की जाँच शुरू होने की प्रतीक्षा में है।')}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="disease-loading-state">
              <div className="disease-loading-ring">
                <ScanSearch size={28} />
              </div>

              <span className="disease-overline">
                {t('SMART FARM DIAGNOSTICS', 'स्मार्ट फार्म जाँच')}
              </span>

              <h3>{t('Examining the leaf...', 'पत्ते की जाँच हो रही है...')}</h3>

              <p>
                {t(
                  'Your image is being processed. Please wait while the diagnosis is prepared.',
                  'आपकी तस्वीर का विश्लेषण किया जा रहा है। कृपया प्रतीक्षा करें।'
                )}
              </p>

              <div className="disease-loading-track">
                <span />
              </div>
            </div>
          )}

          {/* Diagnosis report */}
          {!loading && result && (
            <div className="disease-report">

              <article className={`disease-report-card ${severity.className}`}>

                {result.is_demo && (
                  <div className="disease-demo-label">
                    <AlertTriangle size={13} />
                    {t('DEMO PREDICTION · NOT A CONFIRMED DIAGNOSIS', 'डेमो अनुमान · पक्की जाँच नहीं')}
                  </div>
                )}

                <span className="disease-result-label">
                  {result.severity === 'None'
                    ? <CheckCircle size={15} />
                    : <AlertTriangle size={15} />
                  }

                  {t('PLANT HEALTH FINDING', 'पौधे के स्वास्थ्य की जानकारी')}
                </span>

                <h3>{result.disease_name || t('Unknown condition', 'अज्ञात समस्या')}</h3>

                <p>
                  {result.description ||
                    t('No additional description is available.', 'अतिरिक्त जानकारी उपलब्ध नहीं है।')
                  }
                </p>

                <div className="disease-report-meta">
                  <span>
                    {t('Severity', 'गंभीरता')}: {isHindi ? severity.hindi : severity.label}
                  </span>

                  <span>
                    {t('Confidence', 'विश्वास स्तर')}: {confidence}%
                  </span>
                </div>
              </article>

              {/* Confidence */}
              <div className="disease-confidence">
                <div className="disease-confidence-top">
                  <span>{t('Analysis confidence', 'विश्लेषण का विश्वास स्तर')}</span>
                  <strong>{confidence}%</strong>
                </div>

                <div className="disease-confidence-track">
                  <div
                    className="disease-confidence-fill"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>

              {/* Causes */}
              {causes.length > 0 && (
                <article className="disease-detail-card">
                  <div className="disease-detail-heading">
                    <span>
                      <AlertTriangle size={16} />
                    </span>
                    <h4>{t('Possible causes', 'संभावित कारण')}</h4>
                  </div>

                  <ul className="disease-detail-list">
                    {causes.map((cause, index) => (
                      <li key={index}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <div>{cause}</div>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {/* Prevention and recommended actions */}
              <article className="disease-detail-card">
                <div className="disease-detail-heading">
                  <span>
                    <ShieldCheck size={17} />
                  </span>
                  <h4>{t('Recommended actions', 'सुझाए गए बचाव के उपाय')}</h4>
                </div>

                {prevention.length > 0 ? (
                  <ul className="disease-detail-list">
                    {prevention.map((action, index) => (
                      <li key={index}>
                        <CheckCircle size={15} />
                        <div>{action}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="disease-empty-state">
                    {t('No additional actions available.', 'अतिरिक्त उपाय उपलब्ध नहीं हैं।')}
                  </p>
                )}
              </article>

              {/* Next steps */}
              {result.next_steps && (
                <article className="disease-next-steps">
                  <h4>
                    <Activity size={16} />
                    {t('What to do next', 'अब आगे क्या करें')}
                  </h4>

                  <p>{result.next_steps}</p>
                </article>
              )}

              <div className="disease-report-footer">
                <span>
                  {t(
                    'Verify serious symptoms with a local agriculture expert.',
                    'गंभीर लक्षणों की पुष्टि स्थानीय कृषि विशेषज्ञ से करें।'
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleReset}
                  className="disease-new-analysis"
                >
                  <RefreshCw size={14} />
                  {t('New analysis', 'नई जाँच')}
                </button>
              </div>

            </div>
          )}

        </section>
      </div>

      <footer className="disease-page-footer">
        <Sprout size={17} />

        <span>
          {t(
            'Healthy plants today. Stronger harvests tomorrow.',
            'आज स्वस्थ पौधे, कल बेहतर पैदावार।'
          )}
        </span>

        <strong>SMARTFARM AI</strong>
      </footer>

    </main>
  )
}
