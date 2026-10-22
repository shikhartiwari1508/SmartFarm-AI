import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, User, Bot, AlertTriangle, Sparkles } from 'lucide-react'
import { sendChatMessage } from '../services/api'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { useLanguage } from '../context/LanguageContext'

export default function ChatAssistant() {
  const { language, t } = useLanguage()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: language === 'hi'
        ? '🙏 नमस्ते! मैं आपका SmartFarm AI खेती सहायक हूँ। फसल, रोग, सिंचाई, मौसम या मिट्टी से जुड़ा सवाल पूछें।'
        : '👋 Hello! I am your SmartFarm AI farming assistant. Ask me about crops, diseases, irrigation, weather, or soil.'
    }])
    setSuggestions(language === 'hi'
      ? ['खरीफ में कौन-सी फसल उगाऊँ?', 'मेरी फसल के पत्ते पीले हो रहे हैं।', 'गेहूँ में सिंचाई कब करूँ?']
      : ['Which crop is best for Kharif?', 'My leaves are turning yellow.', 'When should I irrigate wheat?'])
  }, [language])

  const bottomRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    if (!text.trim()) return
    const userMsg = text.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await sendChatMessage(userMsg, sessionId, language)
      setSessionId(res.session_id)
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply, isDemo: res.is_demo }])
      if (res.suggestions) setSuggestions(res.suggestions)
    } catch (e) {
      toast.error(t('Failed to send message', 'संदेश भेजा नहीं जा सका'))
      setMessages(prev => [...prev, { role: 'assistant', content: language === 'hi'
        ? '❌ सर्वर से जुड़ने में समस्या आई। कृपया थोड़ी देर बाद फिर प्रयास करें।'
        : '❌ Sorry, I encountered an error connecting to the server.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-900/40 border border-purple-700/40 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{t('SmartFarm Assistant', 'SmartFarm खेती सहायक')}</h1>
          <p className="text-gray-400 text-sm">{t('AI Agriculture Chatbot', 'AI कृषि चैटबॉट')}</p>
        </div>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden relative border-purple-500/20">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-primary-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white"/> : <Bot className="w-4 h-4 text-white"/>}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm chat-response'}`}>
                {msg.isDemo && <div className="text-[10px] text-amber-400 mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {t('Demo Response', 'डेमो उत्तर')}</div>}
                <div className="prose prose-invert max-w-none text-sm"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
              </div>
            </div>
          ))}
          {loading && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center"><Bot className="w-4 h-4 text-white"/></div><div className="bg-gray-800 border border-gray-700 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2"><div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div><div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div></div></div>}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          {suggestions.length > 0 && <div className="flex flex-wrap gap-2 mb-3">{suggestions.map((s, i) => <button key={i} onClick={() => handleSend(s)} className="text-xs bg-gray-800 hover:bg-primary-900/40 text-gray-300 hover:text-primary-300 border border-gray-700 rounded-full px-3 py-1.5 transition-colors flex items-center gap-1"><Sparkles className="w-3 h-3" /> {s}</button>)}</div>}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(input) }} className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('Ask anything about farming...', 'खेती से जुड़ा कोई भी सवाल पूछें...')} className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
            <button type="submit" disabled={!input.trim() || loading} aria-label={t('Send message', 'संदेश भेजें')} className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 flex items-center justify-center transition-colors disabled:opacity-50"><Send className="w-5 h-5" /></button>
          </form>
        </div>
      </div>
    </div>
  )
}
