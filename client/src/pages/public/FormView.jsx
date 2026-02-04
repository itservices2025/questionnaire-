import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { FiSend, FiAlertCircle } from 'react-icons/fi'
import api from '../../api/client'
import { GlassCard, GlassButton } from '../../components/ui'
import { QuestionRenderer } from '../../components/questions'

export default function FormView() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})

  const { data: form, isLoading, error } = useQuery({
    queryKey: ['public-form', slug],
    queryFn: async () => {
      const { data } = await api.get(`/public/forms/${slug}`)
      return data.form
    },
  })

  const submitMutation = useMutation({
    mutationFn: async (answers) => {
      const { data } = await api.post(`/public/forms/${slug}/submit`, { answers })
      return data
    },
    onSuccess: (data) => {
      navigate(`/thank-you/${data.response.id}`)
    },
    onError: (error) => {
      if (error.response?.data?.details) {
        const newErrors = {}
        error.response.data.details.forEach((err) => {
          newErrors[err.field] = err.message
        })
        setErrors(newErrors)
        toast.error('Please fill in all required fields')
      } else {
        toast.error(error.response?.data?.error || 'Submission failed')
      }
    },
  })

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    // Client-side validation
    const newErrors = {}
    form?.questions.forEach((q) => {
      if (q.required) {
        const value = answers[q.id]
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[q.id] = `${q.label} is required`
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }

    submitMutation.mutate(answers)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    const message =
      error.response?.status === 404
        ? 'Form not found'
        : error.response?.status === 403
        ? 'This form is no longer accepting responses'
        : 'An error occurred'

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="text-center max-w-md">
          <FiAlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
          <p className="text-white/60">{message}</p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <GlassCard className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{form?.title}</h1>
          {form?.description && (
            <p className="text-white/60">{form.description}</p>
          )}
        </GlassCard>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {form?.questions.map((question) => (
              <GlassCard key={question.id}>
                <QuestionRenderer
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => handleChange(question.id, value)}
                  error={errors[question.id]}
                />
              </GlassCard>
            ))}
          </div>

          <div className="mt-6">
            <GlassButton
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  Submit
                </>
              )}
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  )
}
