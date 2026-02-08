import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { createPending, verifyOtp, getPending } from '../services/otp.js'
import { sendOtpEmail } from '../services/email.js'

const router = express.Router()
const prisma = new PrismaClient()

// Register - Step 1: validate & send OTP
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

      const { pendingId, otp } = createPending({
        email,
        type: 'register',
        data: { email, password: hashedPassword, name },
      })

      await sendOtpEmail(email, otp)

      res.json({ pendingId, message: 'Verification code sent to your email' })
    } catch (error) {
      next(error)
    }
  }
)

// Register - Step 2: verify OTP & create account
router.post(
  '/verify-register',
  [
    body('pendingId').trim().notEmpty().withMessage('Pending ID is required'),
    body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { pendingId, otp } = req.body

      const result = verifyOtp(pendingId, otp)
      if (!result.valid) {
        return res.status(400).json({ error: result.error })
      }

      if (result.type !== 'register') {
        return res.status(400).json({ error: 'Invalid verification type' })
      }

      const { email, password, name } = result.data

      // Check again in case someone registered between steps
      const existing = await prisma.admin.findUnique({ where: { email } })
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' })
      }

      const admin = await prisma.admin.create({
        data: { email, password, name },
        select: { id: true, email: true, name: true, createdAt: true },
      })

      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

      res.status(201).json({ admin, token })
    } catch (error) {
      next(error)
    }
  }
)

// Login - Step 1: validate credentials & send OTP
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

      const { pendingId, otp } = createPending({
        email,
        type: 'login',
        data: { adminId: admin.id },
      })

      await sendOtpEmail(email, otp)

      res.json({ pendingId, message: 'Verification code sent to your email' })
    } catch (error) {
      next(error)
    }
  }
)

// Login - Step 2: verify OTP & issue token
router.post(
  '/verify-login',
  [
    body('pendingId').trim().notEmpty().withMessage('Pending ID is required'),
    body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { pendingId, otp } = req.body

      const result = verifyOtp(pendingId, otp)
      if (!result.valid) {
        return res.status(400).json({ error: result.error })
      }

      if (result.type !== 'login') {
        return res.status(400).json({ error: 'Invalid verification type' })
      }

      const admin = await prisma.admin.findUnique({
        where: { id: result.data.adminId },
        select: { id: true, email: true, name: true },
      })

      if (!admin) {
        return res.status(401).json({ error: 'Account not found' })
      }

      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

      res.json({ admin, token })
    } catch (error) {
      next(error)
    }
  }
)

// Resend OTP
router.post(
  '/resend-otp',
  [body('pendingId').trim().notEmpty().withMessage('Pending ID is required')],
  validate,
  async (req, res, next) => {
    try {
      const { pendingId } = req.body
      const entry = getPending(pendingId)

      if (!entry) {
        return res.status(400).json({ error: 'Invalid or expired session. Please start over.' })
      }

      await sendOtpEmail(entry.email, entry.otp)

      res.json({ message: 'Verification code resent' })
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
