import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body

      const existing = await prisma.admin.findUnique({ where: { email } })
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const admin = await prisma.admin.create({
        data: { email, password: hashedPassword, name },
        select: { id: true, email: true, name: true, createdAt: true },
      })

      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

      res.status(201).json({ admin, token })
    } catch (error) {
      next(error)
    }
  }
)

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body

      const admin = await prisma.admin.findUnique({ where: { email } })
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const validPassword = await bcrypt.compare(password, admin.password)
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

      res.json({
        admin: { id: admin.id, email: admin.email, name: admin.name },
        token,
      })
    } catch (error) {
      next(error)
    }
  }
)

// Get current admin
router.get('/me', authenticate, (req, res) => {
  res.json({ admin: req.admin })
})

export default router
