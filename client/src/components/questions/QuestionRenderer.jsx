import TextQuestion from './TextQuestion'
import TextareaQuestion from './TextareaQuestion'
import EmailQuestion from './EmailQuestion'
import PhoneQuestion from './PhoneQuestion'
import NumberQuestion from './NumberQuestion'
import DateQuestion from './DateQuestion'
import TimeQuestion from './TimeQuestion'
import SelectQuestion from './SelectQuestion'
import MultiSelectQuestion from './MultiSelectQuestion'
import RadioQuestion from './RadioQuestion'
import CheckboxQuestion from './CheckboxQuestion'
import RatingQuestion from './RatingQuestion'
import FileQuestion from './FileQuestion'

const questionComponents = {
  text: TextQuestion,
  textarea: TextareaQuestion,
  email: EmailQuestion,
  phone: PhoneQuestion,
  number: NumberQuestion,
  date: DateQuestion,
  time: TimeQuestion,
  select: SelectQuestion,
  multiselect: MultiSelectQuestion,
  radio: RadioQuestion,
  checkbox: CheckboxQuestion,
  rating: RatingQuestion,
  file: FileQuestion,
}

export default function QuestionRenderer({ question, value, onChange, error }) {
  const Component = questionComponents[question.type]

  if (!Component) {
    return (
      <div className="p-4 bg-red-500/20 rounded-lg text-red-200">
        Unknown question type: {question.type}
      </div>
    )
  }

  return (
    <Component
      question={question}
      value={value}
      onChange={onChange}
      error={error}
    />
  )
}

export const QUESTION_TYPES = [
  { value: 'text', label: 'Short Text', icon: 'Aa' },
  { value: 'textarea', label: 'Long Text', icon: '¶' },
  { value: 'email', label: 'Email', icon: '@' },
  { value: 'phone', label: 'Phone', icon: '☎' },
  { value: 'number', label: 'Number', icon: '#' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'time', label: 'Time', icon: '🕐' },
  { value: 'select', label: 'Dropdown', icon: '▼' },
  { value: 'multiselect', label: 'Multi-Select', icon: '☑' },
  { value: 'radio', label: 'Radio Buttons', icon: '◉' },
  { value: 'checkbox', label: 'Checkbox', icon: '☐' },
  { value: 'rating', label: 'Rating', icon: '★' },
  { value: 'file', label: 'File Upload', icon: '📎' },
]
