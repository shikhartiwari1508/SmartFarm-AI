import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mic, MicOff, PhoneOff, Volume2, VolumeX, Sprout,
  Loader2, Languages, MessageCircle, Send, Leaf,
  ArrowLeft, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  checkKisanAvatarHealth,
  sendKisanAvatarMessage
} from '../services/kisanAvatarApi'
import './KisanAvatar.css'

const LANGUAGES = [
  { code: 'hi', label: 'हिन्दी', speech: 'hi-IN' },
  { code: 'en', label: 'English', speech: 'en-IN' },
  { code: 'bho', label: 'भोजपुरी', speech: 'hi-IN' },
]

const TEXT = {
  hi: {
    title: 'AI किसान साथी',
    subtitle: 'आपका अपना डिजिटल कृषि सलाहकार',
    greeting: 'नमस्ते किसान भाई! मैं आपका AI कृषि साथी हूँ। बताइए, आज आपकी फसल या खेती से जुड़ी क्या समस्या है?',
    start: 'बातचीत शुरू करें',
    end: 'कॉल समाप्त करें',
    listening: 'आपकी बात सुन रहा हूँ...',
    thinking: 'आपके सवाल का जवाब तैयार कर रहा हूँ...',
    speaking: 'जवाब दे रहा हूँ...',
    ready: 'आपसे बात करने के लिए तैयार हूँ',
    online: 'AI ऑनलाइन',
    offline: 'AI कनेक्ट नहीं है',
    placeholder: 'यहाँ अपना सवाल लिखें...',
    type: 'लिखकर पूछें',
    voiceUnavailable: 'इस ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है। आप लिखकर बात कर सकते हैं।',
    micError: 'माइक्रोफोन की अनुमति दें और दोबारा कोशिश करें।',
    error: 'अभी जवाब नहीं मिल पाया। कृपया दोबारा कोशिश करें।',
    empty: 'पहले अपना सवाल लिखें।',
    voiceFallback: 'भोजपुरी जवाब के लिए हिंदी वॉइस का उपयोग हो सकता है।',
    safety: 'AI की सलाह सामान्य जानकारी है। खाद, दवा या फसल उपचार का निर्णय लेने से पहले स्थानीय कृषि विशेषज्ञ या KVK से पुष्टि करें।',
    welcome: 'नमस्ते! आज खेती में आपकी क्या मदद करूँ?',
    mic: 'माइक्रोफोन चालू करें',
    stop: 'आवाज़ बंद करें',
    brandSubtitle: 'स्मार्ट खेती का साथी',
    connecting: 'कनेक्ट हो रहा है...',
    liveSession: 'लाइव AI सेशन',
    yourFarmer: 'आपका किसान साथी',
    conversation: 'बातचीत',
    questionCount: 'सवाल',
    you: 'आप',
    notice: 'सूचना',
    kisanAI: 'किसान AI',
    tryAsking: 'ये सवाल पूछें',
    sendMessage: 'संदेश भेजें',
    hideTyping: 'टाइपिंग बंद करें',
    farmerSpeaking: 'किसान साथी जवाब दे रहे हैं',
    farmerListening: 'आपकी बात सुन रहे हैं',
    farmerThinking: 'AI जवाब सोच रहा है',
    farmerIdle: 'किसान साथी',
    thinkingOverlay: 'AI सोच रहा है...',
    typeHint: 'बोलने के लिए बातचीत शुरू करें',
  },
  en: {
    title: 'AI Farmer Companion',
    subtitle: 'Your personal digital farming assistant',
    greeting: 'Hello farmer! I am your AI farming companion. Tell me what is happening with your crops or farm today.',
    start: 'Start Conversation',
    end: 'End Call',
    listening: 'Listening to you...',
    thinking: 'Thinking about your question...',
    speaking: 'Speaking...',
    ready: 'Ready to talk with you',
    online: 'AI Online',
    offline: 'AI Disconnected',
    placeholder: 'Type your farming question...',
    type: 'Type a message',
    voiceUnavailable: 'Voice recognition is unavailable in this browser. You can type instead.',
    micError: 'Please allow microphone access and try again.',
    error: 'Could not get a response. Please try again.',
    empty: 'Please enter a question first.',
    voiceFallback: 'Hindi voice may be used for Bhojpuri responses.',
    safety: 'AI advice is general information. Confirm fertilizer, pesticide and crop-treatment decisions with a local agricultural expert or KVK.',
    welcome: 'Hello! How can I help with your farming today?',
    mic: 'Enable microphone',
    stop: 'Stop voice',
    brandSubtitle: 'INTELLIGENT FARMING COMPANION',
    connecting: 'Connecting...',
    liveSession: 'LIVE AI SESSION',
    yourFarmer: 'Your AI Farmer',
    conversation: 'CONVERSATION',
    questionCount: 'Q',
    you: 'YOU',
    notice: 'NOTICE',
    kisanAI: 'KISAN AI',
    tryAsking: 'TRY ASKING',
    sendMessage: 'Send message',
    hideTyping: 'Hide typing',
    farmerSpeaking: 'KISAN SAATHI SPEAKING',
    farmerListening: 'LISTENING TO YOU',
    farmerThinking: 'AI IS THINKING',
    farmerIdle: 'KISAN SAATHI',
    thinkingOverlay: 'AI is thinking...',
    typeHint: 'Press Start Conversation to speak',
  },
  bho: {
    title: 'AI किसान साथी',
    subtitle: 'रउरा आपन डिजिटल खेती सलाहकार',
    greeting: 'प्रणाम किसान भाई! हम रउरा AI खेती साथी हईं। बताईं, आज खेती-बारी में का परेशानी बा?',
    start: 'बात शुरू करीं',
    end: 'कॉल बंद करीं',
    listening: 'रउरा बात सुनत बानी...',
    thinking: 'रउरा सवाल के जवाब सोचत बानी...',
    speaking: 'जवाब देत बानी...',
    ready: 'रउरा से बात करे खातिर तैयार बानी',
    online: 'AI ऑनलाइन',
    offline: 'AI कनेक्ट नइखे',
    placeholder: 'अपना सवाल इहाँ लिखीं...',
    type: 'लिख के पूछीं',
    voiceUnavailable: 'एह ब्राउजर में आवाज पहचान उपलब्ध नइखे। रउरा लिख के पूछ सकत बानी।',
    micError: 'माइक्रोफोन के अनुमति दीं आ फेर कोशिश करीं।',
    error: 'अभी जवाब ना मिलल। फेर कोशिश करीं।',
    empty: 'पहिले आपन सवाल लिखीं।',
    voiceFallback: 'भोजपुरी जवाब खातिर हिंदी आवाज इस्तेमाल हो सकेला।',
    safety: 'AI के सलाह सामान्य जानकारी ह। खाद, दवाई आ फसल उपचार खातिर स्थानीय कृषि विशेषज्ञ या KVK से पुष्टि करीं।',
    welcome: 'प्रणाम! आज खेती में का मदद करीं?',
    mic: 'माइक्रोफोन चालू करीं',
    stop: 'आवाज बंद करीं',
    brandSubtitle: 'खेती-बारी के डिजिटल साथी',
    connecting: 'जुड़त बा...',
    liveSession: 'लाइव AI बातचीत',
    yourFarmer: 'रउरा किसान साथी',
    conversation: 'बातचीत',
    questionCount: 'सवाल',
    you: 'रउरा',
    notice: 'सूचना',
    kisanAI: 'किसान AI',
    tryAsking: 'ई सवाल पूछीं',
    sendMessage: 'संदेश भेजीं',
    hideTyping: 'लिखल बंद करीं',
    farmerSpeaking: 'किसान साथी जवाब देत बाड़ें',
    farmerListening: 'रउरा बात सुनत बाड़ें',
    farmerThinking: 'AI जवाब सोचत बा',
    farmerIdle: 'किसान साथी',
    thinkingOverlay: 'AI सोचत बा...',
    typeHint: 'बात करे खातिर बातचीत शुरू करीं',
  },
}

const SUGGESTIONS = {
  hi: ['गेहूँ की फसल पीली क्यों हो रही है?', 'धान में पानी कितना देना चाहिए?', 'मिट्टी की सेहत कैसे सुधारें?'],
  en: ['Why are my wheat leaves turning yellow?', 'How should I manage paddy irrigation?', 'How can I improve soil health?'],
  bho: ['गेहूं के फसल पियर काहे पड़ता?', 'धान में पानी केतना दीं?', 'माटी के सेहत कइसे सुधारीं?'],
}

function FarmerVisual({ speaking, listening, thinking, t }) {
  return (
    <div className={`farmer-visual real-farmer-visual ${speaking ? 'is-speaking' : ''} ${listening ? 'is-listening' : ''}`}>
      <img
        className="real-farmer-photo"
        src="/images/kisan-farmer-optimized.jpg"
        alt="SmartFarm AI Kisan Saathi"
        loading="eager"
      />

      <div className="real-farmer-shade" />

      <div className="real-farmer-top-label">
        <span className="real-farmer-live-dot" />
        {speaking ? t.farmerSpeaking : listening ? t.farmerListening : thinking ? t.farmerThinking : t.farmerIdle}
      </div>

      <div className={`farmer-audio-bars ${speaking ? 'active' : ''}`}>
        <i /><i /><i /><i /><i /><i /><i />
      </div>

      <div className="farmer-visual-caption">
        <span className="caption-dot" />
        SMARTFARM AI · KISAN SAATHI
      </div>

      {thinking && (
        <div className="farmer-thinking">
          <Sparkles size={15} /> {t.thinkingOverlay}
        </div>
      )}
    </div>
  )
}

export default function KisanAvatar() {
  const [language, setLanguage] = useState('hi')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [health, setHealth] = useState('checking')
  const [callActive, setCallActive] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState('')
  const recognitionRef = useRef(null)
  const callActiveRef = useRef(false)
  const busyRef = useRef(false)
  const languageRef = useRef(language)
  const restartTimerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const t = TEXT[language]

  useEffect(() => {
    languageRef.current = language
  }, [language])

  useEffect(() => {
    setMessages([{ role: 'assistant', text: TEXT[language].greeting }])
    checkKisanAvatarHealth()
      .then(() => setHealth('online'))
      .catch(() => setHealth('offline'))

    return () => {
      callActiveRef.current = false
      clearTimeout(restartTimerRef.current)
      recognitionRef.current?.abort?.()
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const stopRecognition = useCallback(() => {
    clearTimeout(restartTimerRef.current)
    try {
      recognitionRef.current?.stop()
    } catch {
      // Recognition may already be stopped.
    }
    setListening(false)
  }, [])

  const startRecognition = useCallback(() => {
    if (!callActiveRef.current || busyRef.current) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceNotice(TEXT[languageRef.current].voiceUnavailable)
      return
    }

    try {
      recognitionRef.current?.abort?.()
    } catch {
      // Ignore an already stopped recognizer.
    }

    const recognition = new SpeechRecognition()
    recognition.lang = LANGUAGES.find(x => x.code === languageRef.current)?.speech || 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim()
      if (transcript) {
        stopRecognition()
        submitMessage(transcript)
      }
    }

    recognition.onerror = (event) => {
      setListening(false)
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceNotice(TEXT[languageRef.current].micError)
        callActiveRef.current = false
        setCallActive(false)
      }
    }

    recognition.onend = () => {
      setListening(false)
      if (callActiveRef.current && !busyRef.current) {
        restartTimerRef.current = setTimeout(startRecognition, 650)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [stopRecognition])

  const speakAnswer = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      setVoiceNotice(TEXT[languageRef.current].voiceUnavailable)
      busyRef.current = false
      setSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const code = languageRef.current
    const preferred = code === 'en' ? 'en-IN' : 'hi-IN'
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.lang.toLowerCase() === preferred.toLowerCase())
      || voices.find(v => v.lang.toLowerCase().startsWith(code === 'en' ? 'en' : 'hi'))

    if (voice) utterance.voice = voice
    utterance.lang = preferred
    utterance.rate = 0.94
    utterance.pitch = 1

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => {
      setSpeaking(false)
      busyRef.current = false
      if (callActiveRef.current) restartTimerRef.current = setTimeout(startRecognition, 500)
    }
    utterance.onerror = () => {
      setSpeaking(false)
      busyRef.current = false
      if (callActiveRef.current) restartTimerRef.current = setTimeout(startRecognition, 700)
    }

    if (code === 'bho') setVoiceNotice(TEXT.bho.voiceFallback)
    window.speechSynthesis.speak(utterance)
  }, [startRecognition])

  const submitMessage = useCallback(async (rawText) => {
    const question = (rawText ?? input).trim()
    if (!question) {
      toast.error(TEXT[languageRef.current].empty)
      return
    }
    if (busyRef.current) return

    busyRef.current = true
    stopRecognition()
    setLoading(true)
    setInput('')
    setMessages(previous => [...previous, { role: 'user', text: question }])

    try {
      const data = await sendKisanAvatarMessage(question, languageRef.current)
      const answer = data?.answer || TEXT[languageRef.current].error
      setMessages(previous => [...previous, { role: 'assistant', text: answer }])
      setLoading(false)

      if (callActiveRef.current) {
        speakAnswer(answer)
      } else {
        busyRef.current = false
      }
    } catch (error) {
      const status = error.response?.status
      const detail = error.response?.data?.detail || TEXT[languageRef.current].error

      setMessages(previous => [...previous, { role: 'error', text: detail }])
      setLoading(false)
      busyRef.current = false
      toast.error(detail)

      if (status === 429) {
        // Quota/rate limit: stop voice call to prevent repeated API requests.
        callActiveRef.current = false
        setCallActive(false)
        stopRecognition()
        setSpeaking(false)
        setVoiceNotice(detail)
      } else if (callActiveRef.current) {
        restartTimerRef.current = setTimeout(startRecognition, 900)
      }
    }
  }, [input, speakAnswer, startRecognition, stopRecognition])

  const startCall = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceNotice(t.voiceUnavailable)
      setShowTyping(true)
      toast.error(t.voiceUnavailable)
      return
    }
    callActiveRef.current = true
    setCallActive(true)
    setVoiceNotice('')
    toast.success(t.ready)
    startRecognition()
  }

  const endCall = () => {
    callActiveRef.current = false
    setCallActive(false)
    busyRef.current = false
    clearTimeout(restartTimerRef.current)
    stopRecognition()
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
    setLoading(false)
  }

  const changeLanguage = (code) => {
    languageRef.current = code
    setLanguage(code)
    setMessages([{ role: 'assistant', text: TEXT[code].greeting }])
    setVoiceNotice('')
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
    if (callActiveRef.current) {
      stopRecognition()
      setTimeout(startRecognition, 300)
    }
  }

  const handleTyping = (event) => {
    event.preventDefault()
    submitMessage(input)
  }

  return (
    <main className="kisan-call-screen">
      <header className="call-topbar">
        <div className="call-brand">
          <div className="call-brand-icon"><Sprout size={22} /></div>
          <div>
            <strong>SMARTFARM <span>AI</span></strong>
            <small>{t.brandSubtitle}</small>
          </div>
        </div>

        <div className={`call-health ${health}`}>
          <span />
          {health === 'checking' ? t.connecting : health === 'online' ? t.online : t.offline}
        </div>

        <div className="call-language">
          <Languages size={16} />
          {LANGUAGES.map(item => (
            <button
              key={item.code}
              className={language === item.code ? 'active' : ''}
              onClick={() => changeLanguage(item.code)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <section className="call-main">
        <div className="call-person-area">
          <div className="call-person-heading">
            <span className="call-live-indicator"><i /> {t.liveSession}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <FarmerVisual speaking={speaking} listening={listening} thinking={loading} t={t} />

          <div className="call-person-info">
            <div className="call-avatar-small"><Sprout size={19} /></div>
            <div>
              <strong>{t.yourFarmer}</strong>
              <span>{speaking ? t.speaking : loading ? t.thinking : listening ? t.listening : t.ready}</span>
            </div>
            <div className={`call-audio-bars ${speaking || listening ? 'active' : ''}`}>
              <i /><i /><i /><i /><i />
            </div>
          </div>
        </div>

        <aside className="call-conversation">
          <div className="conversation-heading">
            <div>
              <span><MessageCircle size={15} /> {t.conversation}</span>
              <h2>{t.welcome}</h2>
            </div>
            <div className="conversation-count">{messages.filter(m => m.role === 'user').length} <small>{t.questionCount}</small></div>
          </div>

          <div className="conversation-messages">
            {messages.map((message, index) => (
              <motion.div
                key={`${index}-${message.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`conversation-message ${message.role}`}
              >
                <div className="message-role">
                  {message.role === 'user' ? t.you : message.role === 'error' ? t.notice : t.kisanAI}
                </div>
                <p>{message.text}</p>
              </motion.div>
            ))}
            {loading && (
              <div className="call-thinking"><Loader2 size={17} /> {t.thinking}</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="call-suggestions">
              <span>{t.tryAsking}</span>
              {SUGGESTIONS[language].map(item => (
                <button key={item} type="button" onClick={() => submitMessage(item)} disabled={loading}>
                  {item}
                </button>
              ))}
            </div>
          )}

          {voiceNotice && <div className="call-notice">{voiceNotice}</div>}

          <form className={`call-type-form ${showTyping ? 'visible' : ''}`} onSubmit={handleTyping}>
            <input
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder={t.placeholder}
              aria-label={t.type}
            />
            <button type="submit" disabled={!input.trim() || loading} aria-label={t.sendMessage}>
              <Send size={17} />
            </button>
          </form>

          <button className="call-type-toggle" onClick={() => setShowTyping(value => !value)} type="button">
            <MessageCircle size={14} />
            {showTyping ? t.hideTyping : t.type}
          </button>
        </aside>
      </section>

      <footer className="call-controls">
        <div className="call-status-label">
          <span className={`call-status-dot ${listening ? 'active' : ''}`} />
          {speaking ? t.speaking : loading ? t.thinking : listening ? t.listening : t.typeHint}
        </div>

        <div className="call-control-buttons">
          {!callActive ? (
            <button className="call-start-button" onClick={startCall} type="button" disabled={health === 'offline'}>
              <Mic size={19} /> {t.start}
            </button>
          ) : (
            <>
              <div className={`call-mic-indicator ${listening ? 'active' : ''}`}>
                {listening ? <Mic size={21} /> : <MicOff size={21} />}
              </div>
              <button className="call-end-button" onClick={endCall} type="button">
                <PhoneOff size={19} /> {t.end}
              </button>
            </>
          )}
          {speaking && (
            <button className="call-stop-audio" onClick={() => {
              window.speechSynthesis.cancel()
              setSpeaking(false)
              busyRef.current = false
              if (callActiveRef.current) startRecognition()
            }} type="button" aria-label={t.stop}>
              <VolumeX size={18} />
            </button>
          )}
        </div>

        <div className="call-footer-note"><Leaf size={14} /> {t.safety}</div>
      </footer>
    </main>
  )
}





