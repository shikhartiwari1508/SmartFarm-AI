import { Languages } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage } = useLanguage()
  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900/80 px-3 py-2 text-sm text-gray-200">
      <Languages className="h-4 w-4 text-green-400" />
      {!compact && <span className="hidden sm:inline">{language === 'hi' ? 'भाषा' : 'Language'}</span>}
      <select
        aria-label={language === 'hi' ? 'भाषा चुनें' : 'Select language'}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-transparent text-white outline-none cursor-pointer"
      >
        <option className="bg-gray-900" value="hi">हिंदी</option>
        <option className="bg-gray-900" value="en">English</option>
      </select>
    </label>
  )
}
