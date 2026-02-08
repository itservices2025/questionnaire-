import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  FiArrowLeft,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiFile,
} from 'react-icons/fi'
import api from '../../api/client'
import { GlassNavbar, GlassCard, GlassButton } from '../../components/ui'

export default function FormResponses() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expandedResponse, setExpandedResponse] = useState(null)
  const [exporting, setExporting] = useState(false)

  const { data: form, isLoading } = useQuery({
    queryKey: ['form-responses', id],
    queryFn: async () => {
      const { data } = await api.get(`/forms/${id}/responses`)
      return data.form
    },
  })

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await api.get(`/forms/${id}/export`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${form?.title.replace(/[^a-z0-9]/gi, '_')}_responses.xlsx`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Export downloaded!')
    } catch (error) {
      toast.error('Failed to export responses')
    } finally {
      setExporting(false)
    }
  }

  const formatAnswer = (answer, question) => {
    if (!answer) return '-'
    try {
      const value = JSON.parse(answer.value)
      if (Array.isArray(value)) return value.join(', ')
      if (typeof value === 'boolean') return value ? 'Yes' : 'No'
      // R2 file with download URL
      if (typeof value === 'object' && value.fileKey && value.downloadUrl) {
        return (
          <a
            href={value.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 underline"
          >
            <FiFile className="w-4 h-4" />
            {value.fileName || 'Download file'}
          </a>
        )
      }
      // Legacy base64 file
      if (typeof value === 'object' && value.name && value.data) {
        return (
          <a
            href={value.data}
            download={value.name}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 underline"
          >
            <FiFile className="w-4 h-4" />
            {value.name}
          </a>
        )
      }
      // Name field (firstName + lastName)
      if (typeof value === 'object' && value.firstName !== undefined) {
        return [value.firstName, value.lastName].filter(Boolean).join(' ') || '-'
      }
      // Phone field (countryCode + number)
      if (typeof value === 'object' && value.countryCode !== undefined) {
        return value.number ? `${value.countryCode} ${value.number}` : '-'
      }
      if (typeof value === 'object' && value.name) return value.name
      return String(value)
    } catch {
      return answer.value
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
    <div className="min-h-screen">
      <GlassNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <GlassButton variant="ghost" onClick={() => navigate('/admin')}>
            <FiArrowLeft className="w-5 h-5" />
          </GlassButton>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{form?.title}</h1>
            <p className="text-white/60 mt-1">
              {form?.responses.length} response{form?.responses.length !== 1 ? 's' : ''}
            </p>
          </div>
          {form?.responses.length > 0 && (
            <GlassButton
              variant="primary"
              onClick={handleExport}
              disabled={exporting}
            >
              <FiDownload className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export Excel'}
            </GlassButton>
          )}
        </div>

        {form?.responses.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-white/60">No responses yet</p>
            <p className="text-white/40 text-sm mt-2">
              Share your form to start collecting responses
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {form?.responses.map((response, idx) => (
              <GlassCard key={response.id} className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedResponse(
                      expandedResponse === response.id ? null : response.id
                    )
                  }
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-white font-medium">
                      {form.responses.length - idx}
                    </span>
                    <div>
                      <p className="text-white font-medium">
                        Response #{form.responses.length - idx}
                      </p>
                      <p className="text-white/50 text-sm flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(response.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {expandedResponse === response.id ? (
                    <FiChevronUp className="w-5 h-5 text-white/50" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-white/50" />
                  )}
                </button>

                {expandedResponse === response.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                    {form.questions.map((question) => {
                      const answer = response.answers.find(
                        (a) => a.questionId === question.id
                      )
                      return (
                        <div key={question.id} className="grid gap-1">
                          <p className="text-white/60 text-sm">{question.label}</p>
                          <p className="text-white">
                            {formatAnswer(answer, question)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
