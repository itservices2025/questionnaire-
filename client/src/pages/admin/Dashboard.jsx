import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiBarChart2,
  FiLink,
  FiCopy,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi'
import api from '../../api/client'
import { GlassNavbar, GlassCard, GlassButton, GlassModal, GlassInput } from '../../components/ui'

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showNewForm, setShowNewForm] = useState(false)
  const [newFormTitle, setNewFormTitle] = useState('')
  const [newFormDesc, setNewFormDesc] = useState('')
  const [deleteForm, setDeleteForm] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const { data } = await api.get('/forms')
      return data.forms
    },
  })

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/forms', formData)
      return data.form
    },
    onSuccess: (form) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      setShowNewForm(false)
      setNewFormTitle('')
      setNewFormDesc('')
      toast.success('Form created!')
      navigate(`/admin/forms/${form.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create form')
    },
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      await api.put(`/forms/${id}`, { isActive })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/forms/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      setDeleteForm(null)
      toast.success('Form deleted')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete form')
    },
  })

  const copyLink = (slug) => {
    const url = `${window.location.origin}/form/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  const handleCreateForm = (e) => {
    e.preventDefault()
    createMutation.mutate({ title: newFormTitle, description: newFormDesc })
  }

  return (
    <div className="min-h-screen">
      <GlassNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Forms</h1>
            <p className="text-white/60 mt-1">Create and manage your questionnaires</p>
          </div>
          <GlassButton variant="primary" onClick={() => setShowNewForm(true)}>
            <FiPlus className="w-5 h-5" />
            New Form
          </GlassButton>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin" />
          </div>
        ) : data?.length === 0 ? (
          <GlassCard className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <FiPlus className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No forms yet</h3>
            <p className="text-white/60 mb-6">Create your first form to get started</p>
            <GlassButton variant="primary" onClick={() => setShowNewForm(true)}>
              <FiPlus className="w-5 h-5" />
              Create Form
            </GlassButton>
          </GlassCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((form) => (
              <GlassCard key={form.id} className="flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {form.title}
                    </h3>
                    {form.description && (
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      toggleMutation.mutate({ id: form.id, isActive: !form.isActive })
                    }
                    className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                    title={form.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {form.isActive ? (
                      <FiToggleRight className="w-6 h-6 text-green-400" />
                    ) : (
                      <FiToggleLeft className="w-6 h-6 text-white/40" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                  <span className="flex items-center gap-1">
                    <FiEdit2 className="w-4 h-4" />
                    {form._count.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <FiBarChart2 className="w-4 h-4" />
                    {form._count.responses} responses
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/10">
                  <GlassButton
                    variant="ghost"
                    className="flex-1 text-sm py-2"
                    onClick={() => navigate(`/admin/forms/${form.id}`)}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    className="flex-1 text-sm py-2"
                    onClick={() => navigate(`/admin/forms/${form.id}/responses`)}
                  >
                    <FiEye className="w-4 h-4" />
                    Responses
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    className="text-sm py-2 px-3"
                    onClick={() => copyLink(form.slug)}
                  >
                    <FiCopy className="w-4 h-4" />
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    className="text-sm py-2 px-3 text-red-400 hover:bg-red-500/20"
                    onClick={() => setDeleteForm(form)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>

      {/* New Form Modal */}
      <GlassModal
        isOpen={showNewForm}
        onClose={() => setShowNewForm(false)}
        title="Create New Form"
        footer={
          <>
            <GlassButton onClick={() => setShowNewForm(false)}>Cancel</GlassButton>
            <GlassButton
              variant="primary"
              onClick={handleCreateForm}
              disabled={!newFormTitle.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Form'}
            </GlassButton>
          </>
        }
      >
        <form onSubmit={handleCreateForm} className="space-y-4">
          <GlassInput
            label="Form Title"
            placeholder="e.g., Customer Feedback Survey"
            value={newFormTitle}
            onChange={(e) => setNewFormTitle(e.target.value)}
            required
          />
          <GlassInput
            label="Description (optional)"
            placeholder="Brief description of your form"
            value={newFormDesc}
            onChange={(e) => setNewFormDesc(e.target.value)}
          />
        </form>
      </GlassModal>

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={!!deleteForm}
        onClose={() => setDeleteForm(null)}
        title="Delete Form"
        size="sm"
        footer={
          <>
            <GlassButton onClick={() => setDeleteForm(null)}>Cancel</GlassButton>
            <GlassButton
              variant="danger"
              onClick={() => deleteMutation.mutate(deleteForm?.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </GlassButton>
          </>
        }
      >
        <p className="text-white/80">
          Are you sure you want to delete "{deleteForm?.title}"? This will also delete
          all responses. This action cannot be undone.
        </p>
      </GlassModal>
    </div>
  )
}
