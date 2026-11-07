import { useEffect, useState } from 'react'
import indiaLocations from '../data/indiaLocations.json'
import {
  RefreshCw, Search, TrendingUp, MapPin,
  CalendarDays, IndianRupee, AlertCircle, Info, RotateCcw
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import {
  getMarketPrices,
  getMarketPriceFilters
} from '../services/api'

const DEFAULT_STATE = 'Uttar Pradesh'
const DEFAULT_COMMODITY = 'Wheat'
const RESULT_LIMIT = 100

const STATE_NAME_ALIASES = {
  'andaman and nicobar': 'Andaman And Nicobar Islands',
  'chattisgarh': 'Chhattisgarh',
  'keralam': 'Kerala',
  'nct of delhi': 'Delhi'
}

const getMasterDistricts = (stateName) => {
  if (!stateName) return []

  const normalizedState = stateName.trim().toLowerCase()
  const masterStateName =
    STATE_NAME_ALIASES[normalizedState] || stateName

  const stateEntry = indiaLocations.find(
    (item) =>
      item.name.trim().toLowerCase() ===
      masterStateName.trim().toLowerCase()
  )

  return stateEntry
    ? stateEntry.districts
        .map((item) => item.name)
        .sort((a, b) => a.localeCompare(b))
    : []
}

const selectClass =
  'w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed'

export default function MarketPrices() {
  const { language } = useLanguage()
  const hi = language === 'hi'

  const [commodity, setCommodity] = useState(DEFAULT_COMMODITY)
  const [state, setState] = useState(DEFAULT_STATE)
  const [district, setDistrict] = useState('')
  const [market, setMarket] = useState('')

  const [commodities, setCommodities] = useState([])
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [markets, setMarkets] = useState([])

  const [records, setRecords] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)

  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterError, setFilterError] = useState('')

  // Load all crops and states from the official snapshot.
  useEffect(() => {
    let active = true

    const loadGlobalFilters = async () => {
      setFiltersLoading(true)
      setFilterError('')

      try {
        const response = await getMarketPriceFilters()

        if (!active) return

        const cropList = response.commodities || []
        const stateList = response.states || []

        setCommodities(cropList)
        setStates(stateList)

        setCommodity(
          cropList.includes(DEFAULT_COMMODITY)
            ? DEFAULT_COMMODITY
            : (cropList[0] || '')
        )

        setState(
          stateList.includes(DEFAULT_STATE)
            ? DEFAULT_STATE
            : (stateList[0] || '')
        )
      } catch (err) {
        if (active) {
          setFilterError(
            err.message || 'Unable to load official mandi filters.'
          )
        }
      } finally {
        if (active) setFiltersLoading(false)
      }
    }

    loadGlobalFilters()

    return () => {
      active = false
    }
  }, [])

  // Show every master-list district; load markets from official mandi data.
  useEffect(() => {
    let active = true

    const loadLocationFilters = async () => {
      if (!state || !commodity) {
        setDistricts([])
        setMarkets([])
        return
      }

      const districtList = getMasterDistricts(state)
      setDistricts(districtList)

      if (district && !districtList.includes(district)) {
        setDistrict('')
        setMarket('')
        setMarkets([])
        return
      }

      try {
        const response = await getMarketPriceFilters({
          state,
          commodity,
          ...(district ? { district } : {})
        })

        if (!active) return

        const marketList = response.markets || []
        setMarkets(district ? marketList : [])

        if (market && !marketList.includes(market)) {
          setMarket('')
        }
      } catch (err) {
        if (active) {
          setMarkets([])
          setFilterError(
            err.message || 'Unable to load market filters.'
          )
        }
      }
    }

    loadLocationFilters()

    return () => {
      active = false
    }
  }, [state, commodity, district])

  const clearResults = () => {
    setRecords([])
    setTotalRecords(0)
    setSearched(false)
    setError('')
  }

  const handleCommodityChange = (value) => {
    setCommodity(value)
    setDistrict('')
    setMarket('')
    setDistricts([])
    setMarkets([])
    clearResults()
  }

  const handleStateChange = (value) => {
    setState(value)
    setDistrict('')
    setMarket('')
    setDistricts([])
    setMarkets([])
    clearResults()
  }

  const handleDistrictChange = (value) => {
    setDistrict(value)
    setMarket('')
    setMarkets([])
    clearResults()
  }

  const searchPrices = async (event) => {
    event?.preventDefault()

    if (!commodity || !state) return

    setLoading(true)
    setError('')
    setRecords([])
    setTotalRecords(0)
    setSearched(false)

    try {
      const response = await getMarketPrices({
        commodity,
        state,
        ...(district ? { district } : {}),
        ...(market ? { market } : {}),
        limit: RESULT_LIMIT
      })

      const resultList = response.records || []

      setRecords(resultList)
      setTotalRecords(
        response.total ?? response.total_records ?? resultList.length
      )
      setSearched(true)
    } catch (err) {
      setRecords([])
      setTotalRecords(0)
      setSearched(true)
      setError(err.message || 'Unable to fetch official mandi prices.')
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setCommodity(
      commodities.includes(DEFAULT_COMMODITY)
        ? DEFAULT_COMMODITY
        : (commodities[0] || '')
    )
    setState(
      states.includes(DEFAULT_STATE)
        ? DEFAULT_STATE
        : (states[0] || '')
    )
    setDistrict('')
    setMarket('')
    setDistricts([])
    setMarkets([])
    clearResults()
    setFilterError('')
  }

  const formatPrice = (value) => {
    const number = Number(value)

    return Number.isFinite(number)
      ? number.toLocaleString('en-IN', { maximumFractionDigits: 2 })
      : '—'
  }

  const averagePrice = records.length
    ? records.reduce(
        (sum, item) => sum + (Number(item.modal_price) || 0),
        0
      ) / records.length
    : 0

  return (
    <div className="space-y-6">
      {/* Page heading */}
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
              ? 'भारत के उपलब्ध आधिकारिक मंडी रिकॉर्ड के अनुसार फसल के भाव देखें।'
              : 'View available official mandi prices across India.'}
          </p>
        </div>

        <button
          type="button"
          onClick={searchPrices}
          disabled={loading || filtersLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          {hi ? 'भाव रिफ्रेश करें' : 'Refresh Prices'}
        </button>
      </div>

      {/* Official data information */}
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-emerald-300 font-bold text-sm">
            {hi ? 'आधिकारिक मंडी डेटा' : 'OFFICIAL MANDI DATA'}
          </p>
          <p className="text-gray-300 text-xs mt-1">
            {hi
              ? 'डेटा AGMARKNET / भारत सरकार के data.gov.in पोर्टल से प्राप्त किया जाता है। उपलब्धता प्रकाशित मंडी रिकॉर्ड पर निर्भर करती है।'
              : 'Prices are retrieved from AGMARKNET / Government of India data.gov.in. Availability depends on published mandi records.'}
          </p>
        </div>
      </div>

      {/* Dynamic filters */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-400" />
          {hi ? 'मंडी भाव खोजें' : 'Search Market Prices'}
        </h2>

        {filtersLoading && (
          <p className="text-emerald-400 text-sm mb-4">
            {hi ? 'फसल और राज्य की सूची लोड हो रही है...' : 'Loading available crops and states...'}
          </p>
        )}

        {filterError && (
          <div className="rounded-xl border border-red-700/40 bg-red-950/20 p-3 mb-4 text-sm text-red-300">
            {filterError}
          </div>
        )}

        <form
          onSubmit={searchPrices}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Crop */}
          <label className="space-y-2">
            <span className="text-sm text-gray-400">
              {hi ? 'फसल' : 'Commodity'}
            </span>

            <select
              value={commodity}
              onChange={(e) => handleCommodityChange(e.target.value)}
              disabled={filtersLoading || commodities.length === 0}
              className={selectClass}
            >
              <option value="">
                {hi ? 'फसल चुनें' : 'Select a crop'}
              </option>

              {commodities.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>

            <span className="block text-xs text-gray-500">
              {commodities.length} {hi ? 'फसलें उपलब्ध' : 'crops available'}
            </span>
          </label>

          {/* State */}
          <label className="space-y-2">
            <span className="text-sm text-gray-400">
              {hi ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory'}
            </span>

            <select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              disabled={filtersLoading || states.length === 0}
              required
              className={selectClass}
            >
              <option value="">
                {hi ? 'राज्य चुनें' : 'Select a state / UT'}
              </option>

              {states.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <span className="block text-xs text-gray-500">
              {states.length} {hi ? 'राज्य/UT उपलब्ध' : 'states/UTs available'}
            </span>
          </label>

          {/* District */}
          <label className="space-y-2">
            <span className="text-sm text-gray-400">
              {hi ? 'जिला' : 'District'}
            </span>

            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!state || !commodity || districts.length === 0}
              className={selectClass}
            >
              <option value="">
                {hi ? 'सभी उपलब्ध जिले' : 'All available districts'}
              </option>

              {districts.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <span className="block text-xs text-gray-500">
              {districts.length} {hi ? 'जिले उपलब्ध' : 'districts available'}
            </span>
          </label>

          {/* Market */}
          <label className="space-y-2">
            <span className="text-sm text-gray-400">
              {hi ? 'मंडी / बाजार' : 'Market / Mandi'}
            </span>

            <select
              value={market}
              onChange={(e) => {
                setMarket(e.target.value)
                clearResults()
              }}
              disabled={!district || markets.length === 0}
              className={selectClass}
            >
              <option value="">
                {hi ? 'सभी उपलब्ध मंडियां' : 'All available markets'}
              </option>

              {markets.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <span className="block text-xs text-gray-500">
              {district
                ? `${markets.length} ${hi ? 'मंडियां उपलब्ध' : 'markets available'}`
                : (hi ? 'मंडी चुनने के लिए पहले जिला चुनें' : 'Select a district first')}
            </span>
          </label>

          {/* Search and reset */}
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              disabled={loading || filtersLoading || !commodity || !state}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-white font-semibold disabled:opacity-50"
            >
              {loading
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <Search className="w-4 h-4" />}
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

      {/* Search results */}
      {searched && records.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: hi ? 'कुल उपलब्ध रिकॉर्ड' : 'Total Matching Records',
                value: totalRecords.toLocaleString('en-IN'),
                icon: MapPin
              },
              {
                label: hi ? 'औसत भाव (₹/क्विंटल)' : 'Average Price (₹/quintal)',
                value: `₹${formatPrice(averagePrice)}`,
                icon: IndianRupee
              },
              {
                label: hi ? 'चयनित फसल' : 'Selected Crop',
                value: commodity,
                icon: TrendingUp
              }
            ].map((item, index) => {
              const Icon = item.icon

              return (
                <div key={index} className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    {item.label}
                  </div>

                  <p className="text-2xl font-bold text-white break-words">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-white font-semibold text-lg">
                {hi ? 'आधिकारिक मंडी भाव' : 'Official Mandi Price Results'}
              </h2>

              <p className="text-emerald-400 text-xs mt-1">
                {hi ? 'स्रोत: AGMARKNET / data.gov.in' : 'Source: AGMARKNET / data.gov.in'}
              </p>

              <p className="text-gray-400 text-xs mt-2">
                {hi
                  ? `इस खोज में ${totalRecords} रिकॉर्ड मिले। ${records.length} रिकॉर्ड दिखाए जा रहे हैं।`
                  : `Found ${totalRecords} matching records. Showing ${records.length} records.`}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-800/70 text-gray-400">
                  <tr>
                    <th className="p-4">{hi ? 'मंडी / जिला' : 'Market / District'}</th>
                    <th className="p-4">{hi ? 'किस्म' : 'Variety'}</th>
                    <th className="p-4">{hi ? 'न्यूनतम भाव' : 'Min Price'}</th>
                    <th className="p-4">{hi ? 'अधिकतम भाव' : 'Max Price'}</th>
                    <th className="p-4">{hi ? 'मॉडल भाव' : 'Modal Price'}</th>
                    <th className="p-4">{hi ? 'तारीख' : 'Date'}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {records.map((record, index) => (
                    <tr
                      key={`${record.market}-${record.district}-${index}`}
                      className="hover:bg-gray-800/40"
                    >
                      <td className="p-4">
                        <p className="font-semibold text-white">{record.market}</p>
                        <p className="text-xs text-gray-500">
                          {record.district}, {record.state}
                        </p>
                      </td>

                      <td className="p-4">{record.variety || '—'}</td>
                      <td className="p-4 whitespace-nowrap">₹{formatPrice(record.min_price)}</td>
                      <td className="p-4 whitespace-nowrap">₹{formatPrice(record.max_price)}</td>
                      <td className="p-4 whitespace-nowrap text-emerald-400 font-bold">
                        ₹{formatPrice(record.modal_price)}
                      </td>
                      <td className="p-4 whitespace-nowrap">{record.arrival_date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalRecords > records.length && (
            <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-4 text-sm text-amber-200">
              {hi
                ? `अभी पहले ${records.length} रिकॉर्ड दिखाए गए हैं। कुल ${totalRecords} रिकॉर्ड उपलब्ध हैं।`
                : `Only the first ${records.length} records are displayed. ${totalRecords} records are available in total.`}
            </div>
          )}

          <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 text-sm text-gray-400">
            <CalendarDays className="w-4 h-4 inline mr-2 text-emerald-400" />
            {hi
              ? 'भाव और तारीख आधिकारिक रूप से प्रकाशित मंडी रिकॉर्ड पर आधारित हैं।'
              : 'Prices and dates are based on officially published mandi records.'}
          </div>
        </>
      )}

      {/* Error */}
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

            {/* No records */}
      {searched && records.length === 0 && !error && !loading && (
        <div className="rounded-2xl border border-amber-700/40 bg-amber-950/20 p-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />

          <div>
            <p className="text-amber-300 font-semibold">
              {hi
                ? 'इस फसल का मंडी भाव अभी उपलब्ध नहीं है'
                : 'Price data for this crop is currently unavailable'}
            </p>

            <p className="text-gray-300 text-sm mt-2">
              {hi
                ? `${district || state} में ${commodity} के लिए चुनी गई मंडी में अभी कोई आधिकारिक भाव रिकॉर्ड उपलब्ध नहीं है।`
                : `No official ${commodity} price record is currently available for the selected market in ${district || state}.`}
            </p>

            <p className="text-gray-400 text-sm mt-2">
              {hi
                ? 'आप दूसरी फसल चुनकर उसके उपलब्ध मंडी भाव देख सकते हैं। मंडी की सूची में दिखाई देने का अर्थ यह नहीं है कि हर फसल का रिकॉर्ड उपलब्ध है।'
                : 'Try selecting another crop to view its available mandi prices. A market appearing in the list does not mean records are available for every crop.'}
            </p>
          </div>
        </div>
      )}

      {/* Initial state */}
      {!searched && (
        <div className="rounded-2xl border border-dashed border-gray-700 p-10 text-center">
          <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-3" />

          <p className="text-white font-semibold">
            {hi ? 'मंडी भाव देखने के लिए फसल खोजें' : 'Search to view official mandi prices'}
          </p>

          <p className="text-gray-500 text-sm mt-2">
            {hi
              ? 'ऊपर फसल, राज्य और वैकल्पिक जिला तथा मंडी चुनें।'
              : 'Select a crop, state and optional district and market above to get started.'}
          </p>
        </div>
      )}
    </div>
  )
}
