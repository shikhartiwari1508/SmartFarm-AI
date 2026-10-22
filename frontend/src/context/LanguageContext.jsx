import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translateText, translateAttributes } from './domTranslations'

const LanguageContext = createContext(null)
const originalTextNodes = new WeakMap()

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('smartfarm-language') || 'hi'
    } catch {
      return 'hi'
    }
  })

  const setLanguage = (nextLanguage) => {
    const safeLanguage = nextLanguage === 'en' ? 'en' : 'hi'
    setLanguageState(safeLanguage)
    try {
      localStorage.setItem('smartfarm-language', safeLanguage)
    } catch {
      // Language still works for the current session if storage is unavailable.
    }
  }

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en'
    document.documentElement.dataset.smartfarmLanguage = language
    const updateNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue)
        const original = originalTextNodes.get(node)
        const translated = translateText(original, language)
        if (node.nodeValue !== translated) node.nodeValue = translated
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Keep React component structure untouched; translate text nodes and supported attributes only.
        node.childNodes.forEach(updateNode)
      }
    }
    const root = document.getElementById('root')
    if (!root) return
    updateNode(root)
    translateAttributes(root, language)
    const observer = new MutationObserver((records) => {
      records.forEach(record => {
        if (record.type === 'characterData') updateNode(record.target)
        record.addedNodes?.forEach(updateNode)
      })
      translateAttributes(root, language)
    })
    observer.observe(root, { subtree: true, childList: true, characterData: true })
    return () => observer.disconnect()
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (english, hindi) => language === 'hi' ? hindi : english,
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
