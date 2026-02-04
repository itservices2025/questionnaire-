import { GlassInput } from '../ui'

export default function PhoneQuestion({ question, value, onChange, error }) {
  return (
    <GlassInput
      type="tel"
      label={question.label}
      placeholder={question.placeholder || '+1 (555) 000-0000'}
      helpText={question.helpText}
      required={question.required}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
    />
  )
}
