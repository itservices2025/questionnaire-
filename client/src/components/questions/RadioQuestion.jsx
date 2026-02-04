import { GlassRadio } from '../ui'

export default function RadioQuestion({ question, value, onChange, error }) {
  const options = question.options || []

  return (
    <div className="w-full">
      <label className="block text-white/90 text-sm font-medium mb-3">
        {question.label}
        {question.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option, idx) => {
          const optionValue = typeof option === 'string' ? option : option.value
          const optionLabel = typeof option === 'string' ? option : option.label

          return (
            <GlassRadio
              key={idx}
              name={question.id}
              label={optionLabel}
              value={optionValue}
              checked={value === optionValue}
              onChange={(e) => onChange(e.target.value)}
            />
          )
        })}
      </div>
      {question.helpText && !error && (
        <p className="mt-2 text-sm text-white/50">{question.helpText}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
