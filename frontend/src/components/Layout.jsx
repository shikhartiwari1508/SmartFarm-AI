import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Sprout, Bug, Droplets, Cloud,
  MessageSquare, Lightbulb, Menu, X, ChevronRight,
  Leaf, LogOut
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-emerald-400' },
  { path: '/crops', icon: Sprout, label: 'Crop Recommendation', color: 'text-green-400' },
  { path: '/disease', icon: Bug, label: 'Disease Detection', color: 'text-red-400' },
  { path: '/irrigation', icon: Droplets, label: 'Smart Irrigation', color: 'text-blue-400' },
  { path: '/weather', icon: Cloud, label: 'Weather Intelligence', color: 'text-sky-400' },
  { path: '/insights', icon: Lightbulb, label: 'AI Insights', color: 'text-yellow-400' },
  { path: '/chat', icon: MessageSquare, label: 'SmartFarm Assistant', color: 'text-purple-400' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed lg:relative z-30 flex flex-col w-72 h-full bg-gray-900 border-r border-gray-800 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm leading-tight">SmartFarm AI</div>
              <div className="text-xs text-gray-500">Smart Farming Platform</div>
            </div>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ path, icon: Icon, label, color }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary-900/60 border border-primary-700/50 text-primary-300'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/60'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('w-5 h-5 flex-shrink-0', isActive ? 'text-primary-400' : color, 'group-hover:scale-110 transition-transform')} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-primary-500" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="glass-card p-3 mb-3">
            <div className="text-xs text-gray-400 mb-1">Demo Mode Active</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs text-yellow-300">ML models ready for integration</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all w-full text-sm"
          >
            <LogOut className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-xs text-gray-500 hidden sm:block">Tech Force Hackathon 2026</div>
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs text-primary-400 font-medium">AI Online</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
