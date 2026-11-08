import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare, Send, User, Bot, AlertTriangle, Sparkles,
  Sprout, Leaf, RotateCcw, ShieldCheck
} from 'lucide-react'
import { sendChatMessage } from '../services/api'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { useLanguage } from '../context/LanguageContext'

const getWelcomeMessage = (language) => ({
  role: 'assistant',
  content: language === 'hi'
    ? 'नमस्कार किसान भाई! 🙏 मैं आपका SmartFarm AI कृषि सहायक हूँ। फसल, मिट्टी, रोग, सिंचाई और मौसम से जुड़े सवाल पूछिए। मैं आपकी मदद करने की पूरी कोशिश करूँगा।'
    : 'Namaste! I am your SmartFarm AI farming assistant. Ask me about crops, soil health, plant diseases, irrigation, weather, or farming practices. I am here to help you make informed decisions.'
})

const getSuggestions = (language) => language === 'hi'
  ? [
      'खरीफ में कौन-सी फसल उगाऊँ?',
      'मेरी फसल के पत्ते पीले हो रहे हैं।',
      'गेहूँ में सिंचाई कब करनी चाहिए?',
      'मिट्टी की सेहत कैसे सुधारें?'
    ]
  : [
      'Which crop is best for Kharif?',
      'My crop leaves are turning yellow.',
      'When should I irrigate wheat?',
      'How can I improve soil health?'
    ]

export default function ChatAssistant() {
  const { language, t } = useLanguage()
  const [messages, setMessages] = useState(() => [getWelcomeMessage(language)])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [suggestions, setSuggestions] = useState(() => getSuggestions(language))

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setMessages([getWelcomeMessage(language)])
    setSuggestions(getSuggestions(language))
    setSessionId(null)
  }, [language])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  const handleSend = async (text) => {
    const userMsg = text.trim()
    if (!userMsg || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await sendChatMessage(userMsg, sessionId, language)
      setSessionId(res.session_id)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: res.reply, isDemo: res.is_demo }
      ])

      if (res.suggestions?.length) {
        setSuggestions(res.suggestions)
      }
    } catch (error) {
      toast.error(t('Failed to send message', 'संदेश नहीं भेजा जा सका'))
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: language === 'hi'
            ? 'क्षमा कीजिए, सर्वर से जुड़ने में समस्या आई है। कृपया थोड़ी देर बाद दोबारा प्रयास करें।'
            : 'Sorry, I could not connect to the server. Please try again in a little while.'
        }
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleNewChat = () => {
    if (loading) return
    setMessages([getWelcomeMessage(language)])
    setSessionId(null)
    setSuggestions(getSuggestions(language))
    setInput('')
    toast.success(t('New conversation started', 'नई बातचीत शुरू हुई'))
  }

  return (
    <main className="chat-studio">
      <header className="chat-page-heading">
        <div className="chat-heading-copy">
          <span className="chat-eyebrow">
            <Sprout size={15} />
            {t('YOUR FARMING COMPANION', 'आपका कृषि साथी')}
          </span>
          <h1>{t('SmartFarm Assistant', 'SmartFarm कृषि सहायक')}</h1>
          <p>
            {t(
              'Practical guidance for better farming decisions.',
              'बेहतर खेती के फैसलों के लिए उपयोगी कृषि सलाह।'
            )}
          </p>
        </div>

        <button
          type="button"
          className="chat-new-button"
          onClick={handleNewChat}
          disabled={loading}
        >
          <RotateCcw size={16} />
          {t('New conversation', 'नई बातचीत')}
        </button>
      </header>

      <section className="chat-workspace">
        <div className="chat-topbar">
          <div className="chat-assistant-identity">
            <div className="chat-brand-mark">
              <Sprout size={24} />
            </div>
            <div>
              <h2>{t('Farm Advisory Desk', 'कृषि सलाह केंद्र')}</h2>
              <span className="chat-online-status">
                <span className="chat-status-dot" />
                {t('Ready to assist', 'आपकी सहायता के लिए तैयार')}
              </span>
            </div>
          </div>

          <div className="chat-trust-label">
            <ShieldCheck size={16} />
            {t('SmartFarm AI', 'SmartFarm AI')}
          </div>
        </div>

        <div className="chat-conversation" aria-live="polite">
          <div className="chat-date-divider">
            <span>{t('FARMING CONVERSATION', 'कृषि बातचीत')}</span>
          </div>

          {messages.map((msg, index) => (
            <article
              key={index}
              className={`chat-message-row ${msg.role === 'user' ? 'is-user' : 'is-assistant'}`}
            >
              <div className={`chat-avatar ${msg.role === 'user' ? 'user-avatar' : 'assistant-avatar'}`}>
                {msg.role === 'user'
                  ? <User size={19} />
                  : <Sprout size={20} />}
              </div>

              <div className="chat-message-content">
                <div className="chat-message-author">
                  {msg.role === 'user'
                    ? t('You', 'आप')
                    : t('SmartFarm Assistant', 'SmartFarm सहायक')}
                </div>

                <div className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                  {msg.isDemo && (
                    <div className="chat-demo-label">
                      <AlertTriangle size={13} />
                      {t('Demo response', 'डेमो उत्तर')}
                    </div>
                  )}
                  <div className="chat-markdown">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {loading && (
            <article className="chat-message-row is-assistant">
              <div className="chat-avatar assistant-avatar">
                <Sprout size={20} />
              </div>
              <div className="chat-message-content">
                <div className="chat-message-author">
                  {t('SmartFarm Assistant', 'SmartFarm सहायक')}
                </div>
                <div className="chat-bubble assistant-bubble chat-typing">
                  <span />
                  <span />
                  <span />
                  <small>{t('Preparing your advice...', 'आपके लिए सलाह तैयार हो रही है...')}</small>
                </div>
              </div>
            </article>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="chat-composer-area">
          {suggestions.length > 0 && messages.length <= 2 && (
            <div className="chat-suggestions">
              <div className="chat-suggestions-heading">
                <Sparkles size={15} />
                {t('Questions you can ask', 'आप ये सवाल पूछ सकते हैं')}
              </div>
              <div className="chat-suggestion-list">
                {suggestions.map((suggestion, index) => (
                  <button
                    type="button"
                    key={`${suggestion}-${index}`}
                    className="chat-suggestion-chip"
                    onClick={() => handleSend(suggestion)}
                    disabled={loading}
                  >
                    <Leaf size={14} />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="chat-input-form"
            onSubmit={(event) => {
              event.preventDefault()
              handleSend(input)
            }}
          >
            <div className="chat-input-icon">
              <MessageSquare size={19} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t(
                'Ask your farming question here...',
                'अपना खेती से जुड़ा सवाल यहाँ लिखें...'
              )}
              aria-label={t('Your message', 'आपका संदेश')}
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send-button"
              disabled={!input.trim() || loading}
              aria-label={t('Send message', 'संदेश भेजें')}
            >
              <Send size={19} />
              <span>{t('Send', 'भेजें')}</span>
            </button>
          </form>

          <p className="chat-composer-note">
            <ShieldCheck size={13} />
            {t(
              'AI advice is a guide. Verify critical farm decisions with local agricultural experts.',
              'AI की सलाह मार्गदर्शन के लिए है। जरूरी कृषि फैसलों में स्थानीय कृषि विशेषज्ञ से पुष्टि करें।'
            )}
          </p>
        </div>
      </section>
    </main>
  )
}
