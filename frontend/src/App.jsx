import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CropRecommendation from './pages/CropRecommendation'
import DiseaseDetection from './pages/DiseaseDetection'
import SmartIrrigation from './pages/SmartIrrigation'
import WeatherDashboard from './pages/WeatherDashboard'
import ChatAssistant from './pages/ChatAssistant'
import AIInsights from './pages/AIInsights'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crops" element={<CropRecommendation />} />
        <Route path="/disease" element={<DiseaseDetection />} />
        <Route path="/irrigation" element={<SmartIrrigation />} />
        <Route path="/weather" element={<WeatherDashboard />} />
        <Route path="/chat" element={<ChatAssistant />} />
        <Route path="/insights" element={<AIInsights />} />
      </Route>
    </Routes>
  )
}
