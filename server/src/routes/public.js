import express from 'express'
import { body, param } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { validate } from '../middleware/validate.js'

const router = express.Router()
const prisma = new PrismaClient()

// Get form by slug (public)
router.get('/forms/:slug', async (req, res, next) => {
  try {
    const form = await prisma.form.findUnique({
      where: { slug: req.params.slug },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    })

    if (!form) {
      return res.status(404).json({ error: 'Form not found' })
    }

    if (!form.isActive) {
      return res.status(403).json({ error: 'Form is not accepting responses' })
    }

    // Parse JSON fields
    const questions = form.questions.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
      validation: q.validation ? JSON.parse(q.validation) : null,
    }))

    res.json({
      form: {
        id: form.id,
        title: form.title,
        description: form.description,
        questions,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Submit form response (public)
router.post(
  '/forms/:slug/submit',
  [body('answers').isObject().withMessage('Answers must be an object')],
  validate,
  async (req, res, next) => {
    try {
      const { answers } = req.body

      const form = await prisma.form.findUnique({
        where: { slug: req.params.slug },
        include: {
          questions: { orderBy: { order: 'asc' } },
        },
      })

      if (!form) {
        return res.status(404).json({ error: 'Form not found' })
      }

      if (!form.isActive) {
        return res.status(403).json({ error: 'Form is not accepting responses' })
      }

      // Validate required fields
      const errors = []
      form.questions.forEach(q => {
        if (q.required) {
          const answer = answers[q.id]
          if (
            answer === undefined ||
            answer === null ||
            answer === '' ||
            (Array.isArray(answer) && answer.length === 0)
          ) {
            errors.push({ field: q.id, message: `${q.label} is required` })
          }
        }
      })

      if (errors.length > 0) {
        return res.status(400).json({ error: 'Validation failed', details: errors })
      }

      // Create response with answers
      const response = await prisma.response.create({
        data: {
          formId: form.id,
          metadata: JSON.stringify({
            userAgent: req.headers['user-agent'],
            ip: req.ip,
            submittedAt: new Date().toISOString(),
          }),
          answers: {
            create: Object.entries(answers)
              .filter(([questionId]) =>
                form.questions.some(q => q.id === questionId)
              )
              .map(([questionId, value]) => ({
                questionId,
                value: JSON.stringify(value),
              })),
          },
        },
        include: {
          answers: {
            include: { question: true },
          },
        },
      })

      res.status(201).json({
        message: 'Response submitted successfully',
        response: {
          id: response.id,
          submittedAt: response.submittedAt,
          formTitle: form.title,
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

// Get response for receipt (public)
router.get('/responses/:id', async (req, res, next) => {
  try {
    const response = await prisma.response.findUnique({
      where: { id: req.params.id },
      include: {
        form: true,
        answers: {
          include: { question: true },
        },
      },
    })

    if (!response) {
      return res.status(404).json({ error: 'Response not found' })
    }

    // Format response for receipt
    const formattedAnswers = response.answers
      .sort((a, b) => a.question.order - b.question.order)
      .map(answer => {
        let value
        try {
          value = JSON.parse(answer.value)
          if (Array.isArray(value)) value = value.join(', ')
        } catch {
          value = answer.value
        }
        return {
          question: answer.question.label,
          answer: value,
        }
      })

    res.json({
      receipt: {
        id: response.id,
        formTitle: response.form.title,
        submittedAt: response.submittedAt,
        answers: formattedAnswers,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
