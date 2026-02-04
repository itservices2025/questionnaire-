import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  FiArrowLeft,
  FiSave,
  FiPlus,
  FiEye,
  FiLink,
  FiCopy,
} from 'react-icons/fi'
import api from '../../api/client'
import {
  GlassNavbar,
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  GlassSelect,
  GlassCheckbox,
} from '../../components/ui'
import { QUESTION_TYPES } from '../../components/questions'
import SortableQuestion from '../../components/SortableQuestion'

export default function FormBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isNew = !id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([])
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch form data
  const { data: form, isLoading } = useQuery({
    queryKey: ['form', id],
    queryFn: async () => {
      const { data } = await api.get(`/forms/${id}`)
      return data.form
    },
    enabled: !!id,
  })

  // Initialize form data when loaded
  useEffect(() => {
    if (form) {
      setTitle(form.title)
      setDescription(form.description || '')
      setQuestions(
        form.questions.map((q) => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : null,
          validation: q.validation ? JSON.parse(q.validation) : null,
        }))
      )
    }
  }, [form])

  // Save mutations
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (id) {
        await api.put(`/forms/${id}`, { title, description })
        await api.put(`/forms/${id}/questions`, { questions })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      queryClient.invalidateQueries({ queryKey: ['form', id] })
      setHasChanges(false)
      toast.success('Form saved!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to save form')
    },
  })

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      setHasChanges(true)
    }
  }

  const addQuestion = (questionData) => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      ...questionData,
    }
    setQuestions([...questions, newQuestion])
    setShowAddQuestion(false)
    setHasChanges(true)
  }

  const updateQuestion = (questionData) => {
    setQuestions(
      questions.map((q) => (q.id === questionData.id ? questionData : q))
    )
    setEditingQuestion(null)
    setHasChanges(true)
  }

  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
    setHasChanges(true)
  }

  const copyLink = () => {
    if (form?.slug) {
      const url = `${window.location.origin}/form/${form.slug}`
      navigator.clipboard.writeText(url)
      toast.success('Link copied!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <GlassNavbar />
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <GlassNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <GlassButton variant="ghost" onClick={() => navigate('/admin')}>
            <FiArrowLeft className="w-5 h-5" />
          </GlassButton>
          <h1 className="text-2xl font-bold text-white flex-1">
            {isNew ? 'New Form' : 'Edit Form'}
          </h1>
          {form?.slug && (
            <GlassButton variant="ghost" onClick={copyLink}>
              <FiCopy className="w-4 h-4" />
              Copy Link
            </GlassButton>
          )}
          {form?.slug && (
            <GlassButton
              variant="ghost"
              onClick={() => window.open(`/form/${form.slug}`, '_blank')}
            >
              <FiEye className="w-4 h-4" />
              Preview
            </GlassButton>
          )}
        </div>

        {/* Form Details */}
        <GlassCard className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Form Details</h2>
          <div className="space-y-4">
            <GlassInput
              label="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setHasChanges(true)
              }}
              placeholder="Form title"
              required
            />
            <GlassInput
              label="Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setHasChanges(true)
              }}
              placeholder="Optional description"
            />
          </div>
        </GlassCard>

        {/* Questions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Questions</h2>
            <GlassButton onClick={() => setShowAddQuestion(true)}>
              <FiPlus className="w-4 h-4" />
              Add Question
            </GlassButton>
          </div>

          {questions.length === 0 ? (
            <GlassCard className="text-center py-8">
              <p className="text-white/60 mb-4">No questions yet</p>
              <GlassButton variant="primary" onClick={() => setShowAddQuestion(true)}>
                <FiPlus className="w-4 h-4" />
                Add First Question
              </GlassButton>
            </GlassCard>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      index={index}
                      onEdit={() => setEditingQuestion(question)}
                      onDelete={() => deleteQuestion(question.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </main>

      {/* Fixed Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-white/60">You have unsaved changes</span>
            <div className="flex gap-3">
              <GlassButton
                onClick={() => {
                  if (form) {
                    setTitle(form.title)
                    setDescription(form.description || '')
                    setQuestions(
                      form.questions.map((q) => ({
                        ...q,
                        options: q.options ? JSON.parse(q.options) : null,
                        validation: q.validation ? JSON.parse(q.validation) : null,
                      }))
                    )
                  }
                  setHasChanges(false)
                }}
              >
                Discard
              </GlassButton>
              <GlassButton
                variant="primary"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
              >
                <FiSave className="w-4 h-4" />
                {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
              </GlassButton>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      <QuestionModal
        isOpen={showAddQuestion}
        onClose={() => setShowAddQuestion(false)}
        onSave={addQuestion}
        title="Add Question"
      />

      {/* Edit Question Modal */}
      <QuestionModal
        isOpen={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        onSave={updateQuestion}
        question={editingQuestion}
        title="Edit Question"
      />
    </div>
  )
}

function QuestionModal({ isOpen, onClose, onSave, question, title }) {
  const [type, setType] = useState('text')
  const [label, setLabel] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [helpText, setHelpText] = useState('')
  const [required, setRequired] = useState(false)
  const [options, setOptions] = useState('')

  useEffect(() => {
    if (question) {
      setType(question.type)
      setLabel(question.label)
      setPlaceholder(question.placeholder || '')
      setHelpText(question.helpText || '')
      setRequired(question.required)
      setOptions(
        question.options ? question.options.join('\n') : ''
      )
    } else {
      setType('text')
      setLabel('')
      setPlaceholder('')
      setHelpText('')
      setRequired(false)
      setOptions('')
    }
  }, [question, isOpen])

  const needsOptions = ['select', 'multiselect', 'radio'].includes(type)

  const handleSave = () => {
    if (!label.trim()) {
      toast.error('Question label is required')
      return
    }
    if (needsOptions && !options.trim()) {
      toast.error('Options are required for this question type')
      return
    }

    const questionData = {
      ...(question && { id: question.id }),
      type,
      label: label.trim(),
      placeholder: placeholder.trim() || null,
      helpText: helpText.trim() || null,
      required,
      options: needsOptions
        ? options
            .split('\n')
            .map((o) => o.trim())
            .filter(Boolean)
        : null,
    }

    onSave(questionData)
  }

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <GlassButton onClick={onClose}>Cancel</GlassButton>
          <GlassButton variant="primary" onClick={handleSave}>
            {question ? 'Update' : 'Add'} Question
          </GlassButton>
        </>
      }
    >
      <div className="space-y-4">
        <GlassSelect
          label="Question Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={QUESTION_TYPES.map((t) => ({
            value: t.value,
            label: `${t.icon} ${t.label}`,
          }))}
        />

        <GlassInput
          label="Question Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., What is your name?"
          required
        />

        <GlassInput
          label="Placeholder Text"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Optional placeholder"
        />

        <GlassInput
          label="Help Text"
          value={helpText}
          onChange={(e) => setHelpText(e.target.value)}
          placeholder="Optional help text below the field"
        />

        {needsOptions && (
          <div>
            <label className="block text-white/90 text-sm font-medium mb-1.5">
              Options (one per line) <span className="text-red-400">*</span>
            </label>
            <textarea
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              rows={4}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5
                text-white placeholder-white/50
                focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
                transition-all"
            />
          </div>
        )}

        <GlassCheckbox
          label="Required field"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
      </div>
    </GlassModal>
  )
}
