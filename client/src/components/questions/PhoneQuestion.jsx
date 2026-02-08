import { useState, useEffect, useRef } from 'react'
import { FiChevronDown, FiSearch } from 'react-icons/fi'

const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
  { code: '+1', country: 'CA', flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada' },
  { code: '+44', country: 'GB', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
  { code: '+91', country: 'IN', flag: '\u{1F1EE}\u{1F1F3}', name: 'India' },
  { code: '+61', country: 'AU', flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
  { code: '+49', country: 'DE', flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  { code: '+81', country: 'JP', flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan' },
  { code: '+86', country: 'CN', flag: '\u{1F1E8}\u{1F1F3}', name: 'China' },
  { code: '+82', country: 'KR', flag: '\u{1F1F0}\u{1F1F7}', name: 'South Korea' },
  { code: '+55', country: 'BR', flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil' },
  { code: '+52', country: 'MX', flag: '\u{1F1F2}\u{1F1FD}', name: 'Mexico' },
  { code: '+34', country: 'ES', flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain' },
  { code: '+39', country: 'IT', flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy' },
  { code: '+31', country: 'NL', flag: '\u{1F1F3}\u{1F1F1}', name: 'Netherlands' },
  { code: '+46', country: 'SE', flag: '\u{1F1F8}\u{1F1EA}', name: 'Sweden' },
  { code: '+47', country: 'NO', flag: '\u{1F1F3}\u{1F1F4}', name: 'Norway' },
  { code: '+45', country: 'DK', flag: '\u{1F1E9}\u{1F1F0}', name: 'Denmark' },
  { code: '+41', country: 'CH', flag: '\u{1F1E8}\u{1F1ED}', name: 'Switzerland' },
  { code: '+43', country: 'AT', flag: '\u{1F1E6}\u{1F1F9}', name: 'Austria' },
  { code: '+48', country: 'PL', flag: '\u{1F1F5}\u{1F1F1}', name: 'Poland' },
  { code: '+351', country: 'PT', flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal' },
  { code: '+7', country: 'RU', flag: '\u{1F1F7}\u{1F1FA}', name: 'Russia' },
  { code: '+90', country: 'TR', flag: '\u{1F1F9}\u{1F1F7}', name: 'Turkey' },
  { code: '+966', country: 'SA', flag: '\u{1F1F8}\u{1F1E6}', name: 'Saudi Arabia' },
  { code: '+971', country: 'AE', flag: '\u{1F1E6}\u{1F1EA}', name: 'UAE' },
  { code: '+972', country: 'IL', flag: '\u{1F1EE}\u{1F1F1}', name: 'Israel' },
  { code: '+65', country: 'SG', flag: '\u{1F1F8}\u{1F1EC}', name: 'Singapore' },
  { code: '+60', country: 'MY', flag: '\u{1F1F2}\u{1F1FE}', name: 'Malaysia' },
  { code: '+66', country: 'TH', flag: '\u{1F1F9}\u{1F1ED}', name: 'Thailand' },
  { code: '+62', country: 'ID', flag: '\u{1F1EE}\u{1F1E9}', name: 'Indonesia' },
  { code: '+63', country: 'PH', flag: '\u{1F1F5}\u{1F1ED}', name: 'Philippines' },
  { code: '+84', country: 'VN', flag: '\u{1F1FB}\u{1F1F3}', name: 'Vietnam' },
  { code: '+64', country: 'NZ', flag: '\u{1F1F3}\u{1F1FF}', name: 'New Zealand' },
  { code: '+27', country: 'ZA', flag: '\u{1F1FF}\u{1F1E6}', name: 'South Africa' },
  { code: '+234', country: 'NG', flag: '\u{1F1F3}\u{1F1EC}', name: 'Nigeria' },
  { code: '+254', country: 'KE', flag: '\u{1F1F0}\u{1F1EA}', name: 'Kenya' },
  { code: '+20', country: 'EG', flag: '\u{1F1EA}\u{1F1EC}', name: 'Egypt' },
  { code: '+92', country: 'PK', flag: '\u{1F1F5}\u{1F1F0}', name: 'Pakistan' },
  { code: '+880', country: 'BD', flag: '\u{1F1E7}\u{1F1E9}', name: 'Bangladesh' },
  { code: '+94', country: 'LK', flag: '\u{1F1F1}\u{1F1F0}', name: 'Sri Lanka' },
  { code: '+977', country: 'NP', flag: '\u{1F1F3}\u{1F1F5}', name: 'Nepal' },
  { code: '+54', country: 'AR', flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina' },
  { code: '+57', country: 'CO', flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia' },
  { code: '+56', country: 'CL', flag: '\u{1F1E8}\u{1F1F1}', name: 'Chile' },
  { code: '+353', country: 'IE', flag: '\u{1F1EE}\u{1F1EA}', name: 'Ireland' },
  { code: '+358', country: 'FI', flag: '\u{1F1EB}\u{1F1EE}', name: 'Finland' },
  { code: '+32', country: 'BE', flag: '\u{1F1E7}\u{1F1EA}', name: 'Belgium' },
  { code: '+30', country: 'GR', flag: '\u{1F1EC}\u{1F1F7}', name: 'Greece' },
  { code: '+420', country: 'CZ', flag: '\u{1F1E8}\u{1F1FF}', name: 'Czech Republic' },
  { code: '+36', country: 'HU', flag: '\u{1F1ED}\u{1F1FA}', name: 'Hungary' },
  { code: '+40', country: 'RO', flag: '\u{1F1F7}\u{1F1F4}', name: 'Romania' },
  { code: '+380', country: 'UA', flag: '\u{1F1FA}\u{1F1E6}', name: 'Ukraine' },
  { code: '+852', country: 'HK', flag: '\u{1F1ED}\u{1F1F0}', name: 'Hong Kong' },
  { code: '+886', country: 'TW', flag: '\u{1F1F9}\u{1F1FC}', name: 'Taiwan' },
]

export default function PhoneQuestion({ question, value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  // Parse value: { countryCode, number } or fallback
  const parsed = typeof value === 'object' && value !== null
    ? value
    : { countryCode: '+1', country: 'US', flag: '\u{1F1FA}\u{1F1F8}', number: '' }

  const selectedEntry = COUNTRY_CODES.find(
    (c) => c.code === parsed.countryCode && c.country === parsed.country
  ) || COUNTRY_CODES[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  const filtered = search
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search) ||
          c.country.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRY_CODES

  const handleSelect = (entry) => {
    onChange({ countryCode: entry.code, country: entry.country, flag: entry.flag, number: parsed.number })
    setOpen(false)
    setSearch('')
  }

  const handleNumberChange = (e) => {
    const num = e.target.value.replace(/[^\d\s\-()]/g, '')
    onChange({ ...parsed, number: num })
  }

  return (
    <div className="w-full">
      <label className="block text-white/90 text-sm font-medium mb-1.5">
        {question.label}
        {question.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="flex gap-2">
        {/* Country code selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-1.5 h-[42px] px-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white
              focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
              transition-all whitespace-nowrap ${error ? 'border-red-400/50' : 'border-white/20'}`}
          >
            <span className="text-lg">{selectedEntry.flag}</span>
            <span className="text-sm">{selectedEntry.code}</span>
            <FiChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute z-50 top-full mt-1 left-0 w-64 max-h-60 overflow-hidden bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl flex flex-col">
              {/* Search */}
              <div className="p-2 border-b border-white/10">
                <div className="relative">
                  <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country..."
                    className="w-full bg-white/10 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50"
                  />
                </div>
              </div>
              {/* List */}
              <div className="overflow-y-auto flex-1">
                {filtered.length === 0 ? (
                  <div className="p-3 text-center text-white/40 text-sm">No results</div>
                ) : (
                  filtered.map((entry, i) => (
                    <button
                      key={`${entry.country}-${i}`}
                      type="button"
                      onClick={() => handleSelect(entry)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-white/10 transition-colors
                        ${entry.country === selectedEntry.country && entry.code === selectedEntry.code ? 'bg-purple-500/20 text-purple-300' : 'text-white'}`}
                    >
                      <span className="text-base">{entry.flag}</span>
                      <span className="flex-1 truncate">{entry.name}</span>
                      <span className="text-white/50">{entry.code}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone number input */}
        <input
          type="tel"
          value={parsed.number}
          onChange={handleNumberChange}
          placeholder={question.placeholder || 'Phone number'}
          required={question.required}
          className={`flex-1 bg-white/10 backdrop-blur-sm border rounded-lg px-4 py-2.5
            text-white placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
            transition-all ${error ? 'border-red-400/50' : 'border-white/20'}`}
        />
      </div>

      {question.helpText && !error && (
        <p className="mt-1 text-sm text-white/50">{question.helpText}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  )
}
