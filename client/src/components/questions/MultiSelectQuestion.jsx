import { GlassCheckbox } from '../ui'

export default function MultiSelectQuestion({ question, value, onChange, error }) {
  const options = question.options || []
  const selectedValues = Array.isArray(value) ? value : []

  const handleChange = (optionValue, checked) => {
    if (checked) {
      onChange([...selectedValues, optionValue])
    } else {
      onChange(selectedValues.filter((v) => v !== optionValue))
    }
  }

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
            <GlassCheckbox
              key={idx}
              label={optionLabel}
              checked={selectedValues.includes(optionValue)}
              onChange={(e) => handleChange(optionValue, e.target.checked)}
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
