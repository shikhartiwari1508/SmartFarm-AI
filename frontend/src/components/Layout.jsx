import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Sprout, Bug, Droplets, Cloud,
  MessageSquare, Lightbulb, Menu, X, ChevronRight, TrendingUp,
  Leaf, LogOut, UserRound
} from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import './Layout.css'

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, labelEn: 'Dashboard', labelHi: 'डैशबोर्ड' },
  { path: '/crops', icon: Sprout, labelEn: 'Crop Recommendation', labelHi: 'फसल सुझाव' },
  { path: '/disease', icon: Bug, labelEn: 'Disease Detection', labelHi: 'रोग पहचान' },
  { path: '/irrigation', icon: Droplets, labelEn: 'Smart Irrigation', labelHi: 'स्मार्ट सिंचाई' },
  { path: '/weather', icon: Cloud, labelEn: 'Weather Intelligence', labelHi: 'मौसम जानकारी' },
  { path: '/kisan-avatar', icon: UserRound, labelEn: 'AI Kisan Avatar', labelHi: 'AI किसान साथी' },
  { path: '/market-prices', icon: TrendingUp, labelEn: 'Mandi Prices', labelHi: 'मंडी भाव' },
  { path: '/insights', icon: Lightbulb, labelEn: 'AI Insights', labelHi: 'AI जानकारी' },
  { path: '/chat', icon: MessageSquare, labelEn: 'SmartFarm Assistant', labelHi: 'स्मार्टफार्म सहायक' },
]

export default function Layout() {
  const { t, language } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f1e7] text-[#29382d]">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Traditional Forest Green Sidebar */}
      <aside className={clsx(
        'fixed lg:relative z-30 flex flex-col w-72 h-full bg-[#294b35] text-[#f8f5e9] border-r border-[#203b2a] transition-transform duration-300 shadow-xl shadow-[#203b2a]/10 sf-sidebar-shell',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>

        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-white/15 sf-sidebar-brand">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left group sf-sidebar-logo"
          >
            <div className="w-11 h-11 bg-[#f3edda] rounded-lg flex items-center justify-center border border-[#d9cda9] group-hover:bg-white transition-colors sf-sidebar-mark">
              <Leaf className="w-6 h-6 text-[#294b35]" />
            </div>
            <div>
              <div className="font-bold text-white text-base leading-tight tracking-wide">
                SmartFarm AI
              </div>
              <div className="text-[11px] text-[#d4dfcf] mt-1">
                {t('Smart Farming Platform', 'स्मार्ट खेती प्लेटफॉर्म')}
              </div>
            </div>
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#d4dfcf] hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#bdcdb8] sf-sidebar-nav-heading">
            {t('Main Navigation', 'मुख्य मेन्यू')}
          </p>
        </div>

        <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto sf-sidebar-navigation">
          {NAV_ITEMS.map(({ path, icon: Icon, labelEn, labelHi }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-3 rounded-md text-[13px] font-medium transition-all duration-200 border-l-[3px] sf-sidebar-link',
                isActive
                  ? 'bg-[#f5f1e7] text-[#294b35] border-[#c58b50] shadow-sm'
                  : 'text-[#e0e8dc] border-transparent hover:bg-white/10 hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx(
                    'w-[18px] h-[18px] flex-shrink-0',
                    isActive ? 'text-[#294b35]' : 'text-[#cbd9c5]'
                  )} />
                  <span className="flex-1">
                    {language === 'hi' ? labelHi : labelEn}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-[#a65e3b]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/15 sf-sidebar-footer">
          <div className="bg-[#203b2a] border border-white/10 rounded-md p-3 mb-3 sf-sidebar-status">
            <div className="text-[11px] text-[#d4dfcf] mb-2 font-medium">
              {t('Demo Mode Active', 'डेमो मोड चालू है')}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d6ad62]" />
              <span className="text-[11px] text-[#ead9ae]">
                {t('ML models ready for integration', 'ML मॉडल जोड़ने के लिए तैयार हैं')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#d4dfcf] hover:text-white hover:bg-white/10 transition-colors w-full text-sm sf-sidebar-home"
          >
            <LogOut className="w-4 h-4" />
            {t('Back to Home', 'मुख्य पृष्ठ पर लौटें')}
          </button>
        </div>
      </aside>

      {/* Main Application */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#f5f1e7]">

        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#e4dccb] bg-[#fffdf8] shadow-[0_2px_5px_rgba(48,61,43,0.025)] sf-topbar">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#294b35] hover:bg-[#e8efe5] p-2 rounded-md"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#8b9386] font-semibold">
                {t('Agriculture Management Portal', 'कृषि प्रबंधन पोर्टल')}
              </p>
              <p className="text-sm font-semibold text-[#294b35] mt-0.5 sf-topbar-title">
                SmartFarm AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {location.pathname !== '/kisan-avatar' && <LanguageSwitcher />}

            <div className="flex items-center gap-2 border-l border-[#e4dccb] pl-3 sm:pl-5 sf-online-status">
              <span className="w-2 h-2 rounded-full bg-[#648b55]" />
              <span className="text-xs text-[#426447] font-semibold">
                {t('AI Online', 'AI ऑनलाइन')}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-7 max-w-[1500px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}


