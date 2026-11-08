import { useEffect, useState } from 'react'
import indiaLocations from '../data/indiaLocations.json'
import {
  RefreshCw, Search, TrendingUp, MapPin, CalendarDays,
  IndianRupee, AlertCircle, Info, RotateCcw, Sprout,
  Wheat, Store, BarChart3, ChevronDown
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import {
  getMarketPrices,
  getMarketPriceFilters
} from '../services/api'
import './MarketPrices.css'

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
  const masterStateName = STATE_NAME_ALIASES[normalizedState] || stateName

  const stateEntry = indiaLocations.find(
    item => item.name.trim().toLowerCase() === masterStateName.trim().toLowerCase()
  )

  return stateEntry
    ? stateEntry.districts.map(item => item.name).sort((a, b) => a.localeCompare(b))
    : []
}

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

  const clearResults = () => {
    setRecords([])
    setTotalRecords(0)
    setSearched(false)
    setError('')
  }

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

        setCommodity(cropList.includes(DEFAULT_COMMODITY)
          ? DEFAULT_COMMODITY : (cropList[0] || ''))

        setState(stateList.includes(DEFAULT_STATE)
          ? DEFAULT_STATE : (stateList[0] || ''))
      } catch (err) {
        if (active) setFilterError(err.message || 'Unable to load official mandi filters.')
      } finally {
        if (active) setFiltersLoading(false)
      }
    }

    loadGlobalFilters()
    return () => { active = false }
  }, [])

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

        if (market && !marketList.includes(market)) setMarket('')
      } catch (err) {
        if (active) {
          setMarkets([])
          setFilterError(err.message || 'Unable to load market filters.')
        }
      }
    }

    loadLocationFilters()
    return () => { active = false }
  }, [state, commodity, district])

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
      setTotalRecords(response.total ?? response.total_records ?? resultList.length)
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
    setCommodity(commodities.includes(DEFAULT_COMMODITY)
      ? DEFAULT_COMMODITY : (commodities[0] || ''))

    setState(states.includes(DEFAULT_STATE)
      ? DEFAULT_STATE : (states[0] || ''))

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
    ? records.reduce((sum, item) => sum + (Number(item.modal_price) || 0), 0) / records.length
    : 0

  const labels = hi ? {
    eyebrow: 'कृषि बाजार जानकारी',
    title: 'मंडी भाव',
    subtitle: 'भारत की मंडियों में उपलब्ध फसलों के आधिकारिक भाव एक ही जगह देखें।',
    refresh: 'भाव देखें',
    official: 'आधिकारिक मंडी डेटा',
    officialText: 'डेटा AGMARKNET / भारत सरकार के data.gov.in पोर्टल से प्राप्त प्रकाशित मंडी रिकॉर्ड पर आधारित है।',
    searchTitle: 'अपनी मंडी का भाव खोजें',
    crop: 'फसल / कमोडिटी',
    state: 'राज्य / केंद्र शासित प्रदेश',
    district: 'जिला',
    market: 'मंडी / बाजार',
    chooseCrop: 'फसल चुनें',
    chooseState: 'राज्य चुनें',
    allDistricts: 'सभी उपलब्ध जिले',
    allMarkets: 'सभी उपलब्ध मंडियां',
    search: 'मंडी भाव खोजें',
    reset: 'फिल्टर रीसेट करें',
    available: 'उपलब्ध',
    crops: 'फसलें',
    states: 'राज्य / UT',
    districts: 'जिले',
    markets: 'मंडियां',
    selectDistrict: 'मंडी चुनने के लिए पहले जिला चुनें',
    total: 'कुल उपलब्ध रिकॉर्ड',
    average: 'औसत मॉडल भाव',
    selected: 'चयनित फसल',
    results: 'मंडी भाव के परिणाम',
    source: 'स्रोत: AGMARKNET / data.gov.in',
    showing: 'रिकॉर्ड दिखाए जा रहे हैं',
    marketDistrict: 'मंडी / जिला',
    variety: 'किस्म',
    min: 'न्यूनतम भाव',
    max: 'अधिकतम भाव',
    modal: 'मॉडल भाव',
    date: 'तारीख',
    noData: 'इस चयन के लिए मंडी भाव उपलब्ध नहीं हैं',
    noDataText: 'किसी दूसरी फसल या जिले का चयन करके उपलब्ध रिकॉर्ड देखें।',
    error: 'मंडी डेटा प्राप्त नहीं हो सका',
    initial: 'मंडी भाव देखने के लिए अपनी फसल चुनें',
    initialText: 'ऊपर फसल, राज्य और वैकल्पिक जिला तथा मंडी चुनकर खोज शुरू करें।',
    loading: 'उपलब्ध फसलें और राज्य लोड हो रहे हैं...',
    records: 'रिकॉर्ड',
    perQuintal: '₹ / क्विंटल',
    dateNote: 'भाव और तारीख प्रकाशित मंडी रिकॉर्ड पर आधारित हैं।',
    first: 'दिखाए जा रहे हैं',
    of: 'कुल उपलब्ध रिकॉर्ड में से'
  } : {
    eyebrow: 'AGRICULTURE MARKET INTELLIGENCE',
    title: 'Mandi Market Prices',
    subtitle: 'Explore officially published crop prices from agricultural markets across India.',
    refresh: 'View Prices',
    official: 'Official Mandi Data',
    officialText: 'Records are based on published AGMARKNET / Government of India data.gov.in mandi data.',
    searchTitle: 'Find prices in your market',
    crop: 'Crop / Commodity',
    state: 'State / Union Territory',
    district: 'District',
    market: 'Market / Mandi',
    chooseCrop: 'Select a crop',
    chooseState: 'Select a state',
    allDistricts: 'All available districts',
    allMarkets: 'All available markets',
    search: 'Search Mandi Prices',
    reset: 'Reset filters',
    available: 'available',
    crops: 'crops',
    states: 'states / UTs',
    districts: 'districts',
    markets: 'markets',
    selectDistrict: 'Select a district first',
    total: 'Total matching records',
    average: 'Average modal price',
    selected: 'Selected commodity',
    results: 'Mandi Price Results',
    source: 'SOURCE: AGMARKNET / DATA.GOV.IN',
    showing: 'records found',
    marketDistrict: 'Market / District',
    variety: 'Variety',
    min: 'Minimum price',
    max: 'Maximum price',
    modal: 'Modal price',
    date: 'Date',
    noData: 'No mandi prices available for this selection',
    noDataText: 'Try another crop or district to explore available mandi records.',
    error: 'Unable to fetch mandi data',
    initial: 'Select a crop to explore mandi prices',
    initialText: 'Choose a crop, state and optional district or market above to get started.',
    loading: 'Loading available crops and states...',
    records: 'records',
    perQuintal: '₹ / quintal',
    dateNote: 'Prices and dates are based on officially published mandi records.',
    first: 'Showing',
    of: 'of total available records'
  }

  return (
    <main className="market-page">
      <section className="market-hero">
        <div className="market-hero-copy">
          <div className="market-eyebrow">
            <span className="market-eyebrow-icon"><Sprout size={16} /></span>
            {labels.eyebrow}
          </div>
          <h1>{labels.title}</h1>
          <p>{labels.subtitle}</p>
          <div className="market-hero-meta">
            <span><Wheat size={15} /> {commodities.length} {labels.crops}</span>
            <span><MapPin size={15} /> {states.length} {labels.states}</span>
          </div>
        </div>
        <div className="market-hero-art" aria-hidden="true">
          <div className="market-art-circle">
            <BarChart3 size={64} strokeWidth={1.15} />
          </div>
          <div className="market-art-caption">FARM TO MARKET</div>
        </div>
      </section>

      <section className="market-source-strip">
        <div className="market-source-icon"><Info size={20} /></div>
        <div>
          <strong>{labels.official}</strong>
          <p>{labels.officialText}</p>
        </div>
        <span className="market-source-mark">AGMARKNET</span>
      </section>

      <section className="market-filter-card">
        <div className="market-section-heading">
          <div className="market-section-icon"><Search size={20} /></div>
          <div>
            <span className="market-section-kicker">MARKET EXPLORER</span>
            <h2>{labels.searchTitle}</h2>
          </div>
        </div>

        {filtersLoading && <div className="market-loading-line"><RefreshCw size={15} className="market-spin" /> {labels.loading}</div>}

        {filterError && <div className="market-filter-error"><AlertCircle size={17} /> {filterError}</div>}

        <form onSubmit={searchPrices} className="market-filter-grid">
          <label className="market-field">
            <span><Wheat size={15} /> {labels.crop}</span>
            <div className="market-select-wrap">
              <select value={commodity} onChange={e => handleCommodityChange(e.target.value)} disabled={filtersLoading || commodities.length === 0}>
                <option value="">{labels.chooseCrop}</option>
                {commodities.map(crop => <option key={crop} value={crop}>{crop}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>
            <small>{commodities.length} {labels.crops} {labels.available}</small>
          </label>

          <label className="market-field">
            <span><MapPin size={15} /> {labels.state}</span>
            <div className="market-select-wrap">
              <select value={state} onChange={e => handleStateChange(e.target.value)} disabled={filtersLoading || states.length === 0} required>
                <option value="">{labels.chooseState}</option>
                {states.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>
            <small>{states.length} {labels.states} {labels.available}</small>
          </label>

          <label className="market-field">
            <span><MapPin size={15} /> {labels.district}</span>
            <div className="market-select-wrap">
              <select value={district} onChange={e => handleDistrictChange(e.target.value)} disabled={!state || !commodity || districts.length === 0}>
                <option value="">{labels.allDistricts}</option>
                {districts.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>
            <small>{districts.length} {labels.districts} {labels.available}</small>
          </label>

          <label className="market-field">
            <span><Store size={15} /> {labels.market}</span>
            <div className="market-select-wrap">
              <select value={market} onChange={e => { setMarket(e.target.value); clearResults() }} disabled={!district || markets.length === 0}>
                <option value="">{labels.allMarkets}</option>
                {markets.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>
            <small>{district ? `${markets.length} ${labels.markets} ${labels.available}` : labels.selectDistrict}</small>
          </label>

          <div className="market-filter-actions">
            <button type="submit" className="market-search-button" disabled={loading || filtersLoading || !commodity || !state}>
              {loading ? <RefreshCw size={17} className="market-spin" /> : <Search size={17} />}
              {loading ? (hi ? 'खोज जारी है...' : 'Searching...') : labels.search}
            </button>
            <button type="button" className="market-reset-button" onClick={resetFilters} title={labels.reset} aria-label={labels.reset}>
              <RotateCcw size={17} />
            </button>
          </div>
        </form>
      </section>

      {searched && records.length > 0 && (
        <>
          <section className="market-stat-grid">
            <article className="market-stat-card">
              <div className="market-stat-icon"><Store size={20} /></div>
              <span>{labels.total}</span>
              <strong>{totalRecords.toLocaleString('en-IN')}</strong>
              <small>{labels.records}</small>
            </article>
            <article className="market-stat-card market-stat-featured">
              <div className="market-stat-icon"><IndianRupee size={20} /></div>
              <span>{labels.average}</span>
              <strong>₹{formatPrice(averagePrice)}</strong>
              <small>{labels.perQuintal}</small>
            </article>
            <article className="market-stat-card">
              <div className="market-stat-icon"><Wheat size={20} /></div>
              <span>{labels.selected}</span>
              <strong className="market-stat-crop">{commodity}</strong>
              <small>{state}{district ? ` · ${district}` : ''}</small>
            </article>
          </section>

          <section className="market-results-card">
            <div className="market-results-heading">
              <div>
                <span className="market-section-kicker">{labels.source}</span>
                <h2>{labels.results}</h2>
                <p>{labels.first} {records.length} {labels.of} {totalRecords} {labels.records}.</p>
              </div>
              <div className="market-results-count"><TrendingUp size={17} /> {records.length}</div>
            </div>

            <div className="market-table-wrap">
              <table className="market-table">
                <thead>
                  <tr>
                    <th>{labels.marketDistrict}</th>
                    <th>{labels.variety}</th>
                    <th>{labels.min}</th>
                    <th>{labels.max}</th>
                    <th>{labels.modal}</th>
                    <th>{labels.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={`${record.market}-${record.district}-${index}`}>
                      <td>
                        <strong>{record.market}</strong>
                        <small>{record.district}, {record.state}</small>
                      </td>
                      <td>{record.variety || '—'}</td>
                      <td className="market-price-cell">₹{formatPrice(record.min_price)}</td>
                      <td className="market-price-cell">₹{formatPrice(record.max_price)}</td>
                      <td><span className="market-modal-price">₹{formatPrice(record.modal_price)}</span></td>
                      <td className="market-date-cell"><CalendarDays size={14} /> {record.arrival_date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {totalRecords > records.length && (
            <div className="market-limit-note">
              <Info size={17} />
              {hi
                ? `अभी ${records.length} रिकॉर्ड दिखाए जा रहे हैं। कुल ${totalRecords} रिकॉर्ड उपलब्ध हैं।`
                : `Showing the first ${records.length} records. ${totalRecords} records are available in total.`}
            </div>
          )}

          <div className="market-data-footnote"><CalendarDays size={15} /> {labels.dateNote}</div>
        </>
      )}

      {searched && error && (
        <div className="market-state-card market-error-card">
          <AlertCircle size={27} />
          <div><strong>{labels.error}</strong><p>{error}</p></div>
        </div>
      )}

      {searched && records.length === 0 && !error && !loading && (
        <div className="market-state-card market-empty-card">
          <div className="market-empty-icon"><AlertCircle size={27} /></div>
          <div>
            <strong>{labels.noData}</strong>
            <p>{labels.noDataText}</p>
            <small>{district || state} · {commodity}</small>
          </div>
        </div>
      )}

      {!searched && (
        <section className="market-welcome-card">
          <div className="market-welcome-icon"><TrendingUp size={31} /></div>
          <div>
            <span className="market-section-kicker">YOUR AGRICULTURAL MARKET DESK</span>
            <h2>{labels.initial}</h2>
            <p>{labels.initialText}</p>
          </div>
          <div className="market-welcome-decoration"><Wheat size={76} strokeWidth={.8} /></div>
        </section>
      )}
    </main>
  )
}
