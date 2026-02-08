export default function NameQuestion({ question, value, onChange, error }) {
  const parsed = typeof value === 'object' && value !== null
    ? value
    : { firstName: '', lastName: '' }

  const handleChange = (field, val) => {
    onChange({ ...parsed, [field]: val })
  }

  return (
    <div className="w-full">
      <label className="block text-white/90 text-sm font-medium mb-1.5">
        {question.label}
        {question.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            value={parsed.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder={question.placeholder || 'First name'}
            required={question.required}
            className={`w-full bg-white/10 backdrop-blur-sm border rounded-lg px-4 py-2.5
              text-white placeholder-white/50
              focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
              transition-all ${error ? 'border-red-400/50' : 'border-white/20'}`}
          />
          <p className="mt-1 text-xs text-white/40">First name</p>
        </div>
        <div>
          <input
            type="text"
            value={parsed.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Last name"
            required={question.required}
            className={`w-full bg-white/10 backdrop-blur-sm border rounded-lg px-4 py-2.5
              text-white placeholder-white/50
              focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
              transition-all ${error ? 'border-red-400/50' : 'border-white/20'}`}
          />
          <p className="mt-1 text-xs text-white/40">Last name</p>
        </div>
      </div>

      {question.helpText && !error && (
        <p className="mt-2 text-sm text-white/50">{question.helpText}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
