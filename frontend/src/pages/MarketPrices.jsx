import { useState } from 'react'
import {
  RefreshCw, Search, TrendingUp, MapPin,
  CalendarDays, IndianRupee, AlertCircle, Info, RotateCcw
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import indiaLocations from '../data/indiaLocations.json'
import { getMarketPrices } from '../services/api'

const DEFAULT_STATE = 'Uttar Pradesh'

const selectClass =
  'w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-emerald-500'

export default function MarketPrices() {
  const { language } = useLanguage()
  const hi = language === 'hi'

  const [commodity, setCommodity] = useState('Wheat')
  const [state, setState] = useState(DEFAULT_STATE)
  const [district, setDistrict] = useState('')
  const [records, setRecords] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedState = indiaLocations.find((item) => item.name === state)
  const availableDistricts = selectedState?.districts ?? []

  const clearResults = () => {
    setRecords([])
    setSearched(false)
  }

  const handleStateChange = (value) => {
    setState(value)
    setDistrict('')
    clearResults()
  }

  const handleDistrictChange = (value) => {
    setDistrict(value)
    clearResults()
  }

  const searchPrices = async (event) => {
    event?.preventDefault()

    setLoading(true)
    setError('')
    setRecords([])
    setSearched(false)

    try {
      const response = await getMarketPrices({
        commodity,
        state,
        ...(district ? { district } : {}),
        limit: 10,
      })

      setRecords(response.records || [])
      setSearched(true)
    } catch (err) {
      setRecords([])
      setSearched(true)
      setError(err.message || 'Unable to fetch official mandi prices.')
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setCommodity('Wheat')
    setState(DEFAULT_STATE)
    setDistrict('')
    setRecords([])
    setSearched(false)
  }

  const formatPrice = (value) =>
    Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })

  const averagePrice = records.length
    ? records.reduce((sum, item) => sum + item.modal_price, 0) / records.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-semibold">
              {hi ? 'कृषि बाजार जानकारी' : 'AGRICULTURE MARKET INTELLIGENCE'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {hi ? 'मंडी भाव' : 'Mandi Market Prices'}
          </h1>

          <p className="text-gray-400 mt-2">
            {hi
              ? 'भारत के राज्यों और जिलों के अनुसार उदाहरणात्मक फसल भाव देखें।'
              : 'View the latest available official mandi prices across India.'}
          </p>
        </div>

        <button
          type="button"
          onClick={searchPrices}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          {hi ? 'भाव Refresh करें' : 'Refresh Prices'}
        </button>
      </div>

      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-emerald-300 font-bold text-sm">
            {hi ? 'आधिकारिक मंडी डेटा' : 'OFFICIAL MANDI DATA'}
          </p>
          <p className="text-gray-300 text-xs mt-1">
            {hi
              ? 'डेटा AGMARKNET / भारत सरकार के data.gov.in पोर्टल से प्राप्त किया जाता है। उपलब्धता मंडी के रिकॉर्ड पर निर्भर करती है।'
              : 'Prices are retrieved from AGMARKNET / Government of India data.gov.in. Availability depends on published mandi records.'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-400" />
          {hi ? 'मंडी भाव खोजें' : 'Search Market Prices'}
        </h2>

        <form onSubmit={searchPrices} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="space-y-2">
            <span className="text-sm text-gray-400">{hi ? 'फसल' : 'Commodity'}</span>
            <select
              value={commodity}
              onChange={(e) => {
                setCommodity(e.target.value)
                clearResults()
              }}
              className={selectClass}
            >
              {['Wheat', 'Rice', 'Maize', 'Mustard', 'Potato'].map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-400">{hi ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory'}</span>
            <select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              required
              className={selectClass}
            >
              <option value="" disabled>
                {hi ? 'राज्य चुनें' : 'Select a state / UT'}
              </option>
              <optgroup label={hi ? 'राज्य' : 'States'}>
                {indiaLocations
                  .filter((item) => item.type === 'S')
                  .map((item) => (
                    <option key={item.code} value={item.name}>{item.name}</option>
                  ))}
              </optgroup>
              <optgroup label={hi ? 'केंद्र शासित प्रदेश' : 'Union Territories'}>
                {indiaLocations
                  .filter((item) => item.type === 'U')
                  .map((item) => (
                    <option key={item.code} value={item.name}>{item.name}</option>
                  ))}
              </optgroup>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-gray-400">{hi ? 'जिला' : 'District'}</span>
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!state || availableDistricts.length === 0}
              className={`${selectClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="">
                {hi ? 'सभी जिले' : 'All districts'}
              </option>
              {availableDistricts.map((item) => (
                <option key={item.code} value={item.name}>{item.name}</option>
              ))}
            </select>
            <span className="block text-xs text-gray-500">
              {hi
                ? `${availableDistricts.length} जिले उपलब्ध`
                : `${availableDistricts.length} districts available`}
            </span>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-white font-semibold"
            >
              <Search className="w-4 h-4" />
              {hi ? 'भाव खोजें' : 'Search Prices'}
            </button>
            <button
              type="button"
              onClick={resetFilters}
              title={hi ? 'फिल्टर रीसेट करें' : 'Reset filters'}
              aria-label={hi ? 'फिल्टर रीसेट करें' : 'Reset filters'}
              className="flex items-center justify-center rounded-xl border border-gray-700 hover:bg-gray-800 px-3 py-3 text-gray-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {searched && records.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: hi ? 'कुल मंडी रिकॉर्ड' : 'Total Records', value: records.length, icon: MapPin },
              { label: hi ? 'औसत भाव (₹/क्विंटल)' : 'Average Price (₹/quintal)', value: `₹${formatPrice(averagePrice)}`, icon: IndianRupee },
              { label: hi ? 'चयनित फसल' : 'Selected Crop', value: commodity, icon: TrendingUp },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    {item.label}
                  </div>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-white font-semibold text-lg">
                {hi ? 'आधिकारिक मंडी भाव' : 'Official Mandi Price Results'}
              </h2>
              <p className="text-emerald-400 text-xs mt-1">{hi ? 'स्रोत: AGMARKNET / data.gov.in' : 'Source: AGMARKNET / data.gov.in'}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-800/70 text-gray-400">
                  <tr>
                    <th className="p-4">{hi ? 'मंडी / जिला' : 'Market / District'}</th>
                    <th className="p-4">{hi ? 'किस्म' : 'Variety'}</th>
                    <th className="p-4">{hi ? 'न्यूनतम' : 'Min Price'}</th>
                    <th className="p-4">{hi ? 'अधिकतम' : 'Max Price'}</th>
                    <th className="p-4">{hi ? 'Modal भाव' : 'Modal Price'}</th>
                    <th className="p-4">{hi ? 'तारीख' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {records.map((record, index) => (
                    <tr key={`${record.market}-${index}`} className="hover:bg-gray-800/40">
                      <td className="p-4">
                        <p className="font-semibold text-white">{record.market}</p>
                        <p className="text-xs text-gray-500">{record.district}, {record.state}</p>
                      </td>
                      <td className="p-4">{record.variety}</td>
                      <td className="p-4 whitespace-nowrap">₹{formatPrice(record.min_price)}</td>
                      <td className="p-4 whitespace-nowrap">₹{formatPrice(record.max_price)}</td>
                      <td className="p-4 whitespace-nowrap text-emerald-400 font-bold">₹{formatPrice(record.modal_price)}</td>
                      <td className="p-4 whitespace-nowrap">{record.arrival_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 text-sm text-gray-400">
            <CalendarDays className="w-4 h-4 inline mr-2 text-emerald-400" />
            {hi
              ? 'भाव और तारीख आधिकारिक प्रकाशित मंडी रिकॉर्ड पर आधारित हैं।'
              : 'Prices and dates are based on officially published mandi records.'}
          </div>
        </>
      )}

      {searched && error && (
        <div className="rounded-2xl border border-red-700/40 bg-red-950/20 p-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-red-300 font-semibold">
              {hi ? 'मंडी डेटा प्राप्त नहीं हो सका' : 'Unable to fetch mandi data'}
            </p>
            <p className="text-gray-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      {searched && records.length === 0 && !error && !loading && (
        <div className="rounded-2xl border border-amber-700/40 bg-amber-950/20 p-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-amber-300 font-semibold">
              {hi ? 'इस चयन के लिए मंडी डेटा उपलब्ध नहीं है' : 'No mandi price data available for this selection'}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              {hi
                ? 'चुने गए राज्य, जिले और फसल के लिए अभी कोई डेमो रिकॉर्ड उपलब्ध नहीं है। दूसरे विकल्प चुनकर देखें।'
                : 'No official mandi records were found for this selection. Try another crop, state or district.'}
            </p>
          </div>
        </div>
      )}

      {!searched && (
        <div className="rounded-2xl border border-dashed border-gray-700 p-10 text-center">
          <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-semibold">
            {hi ? 'मंडी भाव देखने के लिए फसल खोजें' : 'Search to view official mandi prices'}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {hi ? 'ऊपर फसल, राज्य और वैकल्पिक जिला चुनें।' : 'Select a crop, state and optional district above to get started.'}
          </p>
        </div>
      )}
    </div>
  )
}
