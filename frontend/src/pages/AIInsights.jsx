import { useLanguage } from '../context/LanguageContext'
import { useState, useEffect } from 'react'
import {
  Brain, AlertTriangle, CheckCircle, Info, Lightbulb,
  RefreshCw, Loader2, ArrowRight, Sprout, ShieldCheck,
  TrendingUp, Activity, CalendarDays, ClipboardList
} from 'lucide-react'
import { getInsights } from '../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  warning: {
    icon: AlertTriangle,
    label: 'Attention required',
    hindi: 'ध्यान देने योग्य',
    className: 'insight-warning',
  },
  success: {
    icon: CheckCircle,
    label: 'Positive observation',
    hindi: 'अच्छी स्थिति',
    className: 'insight-success',
  },
  info: {
    icon: Info,
    label: 'Farm information',
    hindi: 'खेत की जानकारी',
    className: 'insight-info',
  },
  tip: {
    icon: Lightbulb,
    label: 'Expert suggestion',
    hindi: 'विशेष सुझाव',
    className: 'insight-tip',
  },
}

const ACTION_MAP = {
  'Check Irrigation': '/irrigation',
  'View Disease Detection': '/disease',
  'Get Crop Recommendation': '/crops',
}

function HealthScore({ score, t }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0))
  const status = value >= 80
    ? t('Excellent condition', 'बहुत अच्छी स्थिति')
    : value >= 60
      ? t('Good condition', 'अच्छी स्थिति')
      : value >= 40
        ? t('Needs attention', 'ध्यान देने की आवश्यकता')
        : t('Needs improvement', 'सुधार की आवश्यकता')

  return (
    <div className="insight-health-card">
      <div className="insight-health-copy">
        <span className="insight-eyebrow">
          <Activity size={15} />
          {t('YOUR FARM AT A GLANCE', 'आपके खेत की स्थिति')}
        </span>

        <h2>{t('A clearer picture of your farm.', 'आपके खेत की बेहतर जानकारी।')}</h2>

        <p>
          {t(
            'A summary of the conditions and observations that can guide your next farming decisions.',
            'आपके खेत की परिस्थितियों का सार, जो खेती के अगले फैसले लेने में मदद कर सकता है।'
          )}
        </p>

        <div className="insight-health-status">
          <span />
          {status}
        </div>
      </div>

      <div
        className="insight-score-ring"
        style={{ '--score': `${value}%` }}
        role="img"
        aria-label={`${value} out of 100`}
      >
        <div className="insight-score-inner">
          <strong>{value}</strong>
          <span>/ 100</span>
          <small>{t('HEALTH SCORE', 'स्वास्थ्य स्कोर')}</small>
        </div>
      </div>
    </div>
  )
}

export default function AIInsights() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const res = await getInsights()
      setData(res)
    } catch (e) {
      toast.error(t('Failed to load insights', 'जानकारी लोड नहीं हो सकी'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const insights = Array.isArray(data?.insights) ? data.insights : []
  const score = Number(data?.farm_health_score) || 0

  return (
    <main className="insight-studio">

      <header className="insight-page-heading">
        <div>
          <div className="insight-eyebrow">
            <span />
            SMARTFARM AI <i>·</i> FARM INTELLIGENCE
          </div>

          <h1>
            {t('Understand your farm.', 'अपने खेत को समझें।')}
            <em>{t('Make informed decisions.', 'बेहतर फैसले लें।')}</em>
          </h1>

          <p>
            {t(
              'Thoughtful observations and practical guidance for a healthier, more productive farm.',
              'स्वस्थ और बेहतर पैदावार वाले खेत के लिए उपयोगी जानकारी और व्यावहारिक सुझाव।'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInsights}
          disabled={loading}
          className="insight-refresh-button"
        >
          {loading
            ? <Loader2 size={17} className="animate-spin" />
            : <RefreshCw size={17} />
          }
          <span>{t('Refresh report', 'रिपोर्ट अपडेट करें')}</span>
        </button>
      </header>

      <section className="insight-report-banner">
        <div className="insight-banner-icon">
          <Brain size={27} />
        </div>
        <div>
          <span>{t('INTELLIGENCE REPORT', 'इंटेलिजेंस रिपोर्ट')}</span>
          <h2>{t('Your farm, thoughtfully analysed.', 'आपके खेत का समझदारी से विश्लेषण।')}</h2>
          <p>
            {t(
              'Review the observations below and explore the recommended next steps.',
              'नीचे दी गई जानकारी देखें और सुझाए गए अगले कदमों पर विचार करें।'
            )}
          </p>
        </div>
        <div className="insight-banner-decoration">
          <Sprout size={62} />
        </div>
      </section>

      {loading ? (
        <section className="insight-loading-grid">
          <div className="insight-loading-score" />
          {[1, 2, 3].map((item) => (
            <div className="insight-loading-card" key={item} />
          ))}
        </section>
      ) : data ? (
        <>
          <HealthScore score={score} t={t} />

          <div className="insight-section-heading">
            <div>
              <span className="insight-eyebrow">
                <ClipboardList size={15} />
                {t('OBSERVATIONS & GUIDANCE', 'जानकारी और सुझाव')}
              </span>
              <h2>{t('What your farm is telling us', 'आपके खेत की स्थिति')}</h2>
              <p>
                {t(
                  'Review each observation and take action where needed.',
                  'हर सुझाव को देखें और जरूरत के अनुसार कदम उठाएँ।'
                )}
              </p>
            </div>

            <div className="insight-count">
              <strong>{insights.length.toString().padStart(2, '0')}</strong>
              <span>{t('INSIGHTS', 'सुझाव')}</span>
            </div>
          </div>

          {insights.length > 0 ? (
            <div className="insight-list">
              {insights.map((insight, index) => {
                const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info
                const Icon = config.icon

                return (
                  <article
                    key={`${insight.title || 'insight'}-${index}`}
                    className={`insight-card ${config.className}`}
                  >
                    <div className="insight-card-number">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>

                    <div className="insight-card-icon">
                      <Icon size={22} />
                    </div>

                    <div className="insight-card-content">
                      <span className="insight-card-category">
                        {t(config.label, config.hindi)}
                      </span>

                      <h3>{insight.title}</h3>
                      <p>{insight.message}</p>

                      {insight.action && (
                        <button
                          type="button"
                          onClick={() => navigate(ACTION_MAP[insight.action] || '/dashboard')}
                          className="insight-action-button"
                        >
                          {insight.action}
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>

                    <div className="insight-card-side-icon">
                      <Icon size={34} />
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="insight-empty-state">
              <ShieldCheck size={35} />
              <h3>{t('No new observations available', 'अभी कोई नई जानकारी उपलब्ध नहीं है')}</h3>
              <p>
                {t(
                  'Your farm report currently has no additional recommendations.',
                  'आपकी रिपोर्ट में फिलहाल कोई अतिरिक्त सुझाव नहीं है।'
                )}
              </p>
            </div>
          )}

          <section className="insight-next-panel">
            <div className="insight-next-icon">
              <TrendingUp size={25} />
            </div>
            <div>
              <span>{t('THE WAY FORWARD', 'आगे की दिशा')}</span>
              <h3>{t('Good farming begins with good observations.', 'अच्छी खेती की शुरुआत सही जानकारी से होती है।')}</h3>
              <p>
                {t(
                  'Review your irrigation, crop health and crop planning regularly. Use these insights as guidance alongside local agricultural expertise.',
                  'सिंचाई, फसल के स्वास्थ्य और फसल योजना की नियमित जाँच करें। इन सुझावों के साथ स्थानीय कृषि विशेषज्ञ की सलाह भी लें।'
                )}
              </p>
            </div>
          </section>

          <footer className="insight-report-footer">
            <span>
              <CalendarDays size={15} />
              {t('Report generated', 'रिपोर्ट तैयार हुई')}: {data.generated_at || '—'}
            </span>
            <strong>SMARTFARM AI</strong>
          </footer>
        </>
      ) : (
        <div className="insight-empty-state">
          <AlertTriangle size={35} />
          <h3>{t('Your report is not available right now.', 'रिपोर्ट अभी उपलब्ध नहीं है।')}</h3>
          <p>{t('Please try refreshing the report.', 'कृपया रिपोर्ट दोबारा अपडेट करें।')}</p>
          <button
            type="button"
            onClick={fetchInsights}
            className="insight-action-button"
          >
            <RefreshCw size={16} />
            {t('Try again', 'फिर कोशिश करें')}
          </button>
        </div>
      )}

    </main>
  )
}
