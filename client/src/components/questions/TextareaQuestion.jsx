import { GlassTextarea } from '../ui'

export default function TextareaQuestion({ question, value, onChange, error }) {
  return (
    <GlassTextarea
      label={question.label}
      placeholder={question.placeholder || 'Enter your answer'}
      helpText={question.helpText}
      required={question.required}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      rows={4}
    />
  )
}
