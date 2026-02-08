import express from 'express'
import { body, param } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import ExcelJS from 'exceljs'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { getPresignedDownloadUrl } from '../services/r2.js'

const router = express.Router()
const prisma = new PrismaClient()

// Apply auth to all routes
router.use(authenticate)

// Generate unique slug
const generateSlug = (title) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const suffix = Math.random().toString(36).substring(2, 8)
  return `${base}-${suffix}`
}

// Get all forms for admin
router.get('/', async (req, res, next) => {
  try {
    const forms = await prisma.form.findMany({
      where: { adminId: req.admin.id },
      include: {
        _count: { select: { questions: true, responses: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ forms })
  } catch (error) {
    next(error)
  }
})

// Get single form with questions
router.get('/:id', async (req, res, next) => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, adminId: req.admin.id },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    })

    if (!form) {
      return res.status(404).json({ error: 'Form not found' })
    }

    res.json({ form })
  } catch (error) {
    next(error)
  }
})

// Create form
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description } = req.body
      const slug = generateSlug(title)

      const form = await prisma.form.create({
        data: {
          title,
          description,
          slug,
          adminId: req.admin.id,
        },
      })

      res.status(201).json({ form })
    } catch (error) {
      next(error)
    }
  }
)

// Update form
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, isActive } = req.body

      const existing = await prisma.form.findFirst({
        where: { id: req.params.id, adminId: req.admin.id },
      })

      if (!existing) {
        return res.status(404).json({ error: 'Form not found' })
      }

      const form = await prisma.form.update({
        where: { id: req.params.id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(isActive !== undefined && { isActive }),
        },
      })

      res.json({ form })
    } catch (error) {
      next(error)
    }
  }
)

// Delete form
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.form.findFirst({
      where: { id: req.params.id, adminId: req.admin.id },
    })

    if (!existing) {
      return res.status(404).json({ error: 'Form not found' })
    }

    await prisma.form.delete({ where: { id: req.params.id } })
    res.json({ message: 'Form deleted' })
  } catch (error) {
    next(error)
  }
})

// Save questions (bulk update)
router.put(
  '/:id/questions',
  [body('questions').isArray().withMessage('Questions must be an array')],
  validate,
  async (req, res, next) => {
    try {
      const { questions } = req.body

      const existing = await prisma.form.findFirst({
        where: { id: req.params.id, adminId: req.admin.id },
      })

      if (!existing) {
        return res.status(404).json({ error: 'Form not found' })
      }

      // Delete existing questions and recreate
      await prisma.question.deleteMany({ where: { formId: req.params.id } })

      const createdQuestions = await Promise.all(
        questions.map((q, index) =>
          prisma.question.create({
            data: {
              formId: req.params.id,
              type: q.type,
              label: q.label,
              placeholder: q.placeholder || null,
              helpText: q.helpText || null,
              required: q.required || false,
              options: q.options ? JSON.stringify(q.options) : null,
              validation: q.validation ? JSON.stringify(q.validation) : null,
              order: index,
            },
          })
        )
      )

      res.json({ questions: createdQuestions })
    } catch (error) {
      next(error)
    }
  }
)

// Get form responses
router.get('/:id/responses', async (req, res, next) => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, adminId: req.admin.id },
      include: {
        questions: { orderBy: { order: 'asc' } },
        responses: {
          include: { answers: true },
          orderBy: { submittedAt: 'desc' },
        },
      },
    })

    if (!form) {
      return res.status(404).json({ error: 'Form not found' })
    }

    // Generate presigned download URLs for file-type answers
    const fileQuestionIds = new Set(
      form.questions.filter(q => q.type === 'file').map(q => q.id)
    )

    if (fileQuestionIds.size > 0) {
      for (const response of form.responses) {
        for (const answer of response.answers) {
          if (fileQuestionIds.has(answer.questionId)) {
            try {
              const parsed = JSON.parse(answer.value)
              if (parsed && typeof parsed === 'object' && parsed.fileKey) {
                parsed.downloadUrl = await getPresignedDownloadUrl(parsed.fileKey)
                answer.value = JSON.stringify(parsed)
              }
            } catch {
              // Not a JSON file answer, skip
            }
          }
        }
      }
    }

    res.json({ form })
  } catch (error) {
    next(error)
  }
})

// Export responses to Excel
router.get('/:id/export', async (req, res, next) => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, adminId: req.admin.id },
      include: {
        questions: { orderBy: { order: 'asc' } },
        responses: {
          include: { answers: true },
          orderBy: { submittedAt: 'desc' },
        },
      },
    })

    if (!form) {
      return res.status(404).json({ error: 'Form not found' })
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Responses')

    // Headers
    const headers = [
      'Response ID',
      'Submitted At',
      ...form.questions.map(q => q.label),
    ]
    worksheet.addRow(headers)

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    }

    // Data rows
    form.responses.forEach(response => {
      const row = [
        response.id,
        new Date(response.submittedAt).toLocaleString(),
      ]

      form.questions.forEach(question => {
        const answer = response.answers.find(a => a.questionId === question.id)
        let value = ''
        if (answer) {
          try {
            const parsed = JSON.parse(answer.value)
            if (Array.isArray(parsed)) {
              value = parsed.join(', ')
            } else if (question.type === 'name' && typeof parsed === 'object') {
              value = [parsed.firstName, parsed.lastName].filter(Boolean).join(' ')
            } else if (question.type === 'phone' && typeof parsed === 'object') {
              value = parsed.number ? `${parsed.countryCode} ${parsed.number}` : ''
            } else if (question.type === 'file' && typeof parsed === 'object') {
              value = parsed.fileName || parsed.name || '[file]'
            } else {
              value = String(parsed)
            }
          } catch {
            value = answer.value
          }
        }
        row.push(value)
      })

      worksheet.addRow(row)
    })

    // Auto-width columns
    worksheet.columns.forEach(column => {
      let maxLength = 0
      column.eachCell({ includeEmpty: true }, cell => {
        const cellLength = cell.value ? String(cell.value).length : 10
        if (cellLength > maxLength) maxLength = cellLength
      })
      column.width = Math.min(maxLength + 2, 50)
    })

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.xlsx"`
    )

    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    next(error)
  }
})

export default router
