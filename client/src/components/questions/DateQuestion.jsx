import { GlassInput } from '../ui'

export default function DateQuestion({ question, value, onChange, error }) {
  return (
    <GlassInput
      type="date"
      label={question.label}
      helpText={question.helpText}
      required={question.required}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
    />
  )
}
