import { GlassInput } from '../ui'

export default function NumberQuestion({ question, value, onChange, error }) {
  const validation = question.validation || {}

  return (
    <GlassInput
      type="number"
      label={question.label}
      placeholder={question.placeholder || 'Enter a number'}
      helpText={question.helpText}
      required={question.required}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      min={validation.min}
      max={validation.max}
      step={validation.step || 1}
    />
  )
}
