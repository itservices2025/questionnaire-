import express from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { getPresignedUploadUrl } from '../services/r2.js'

const router = express.Router()

// Get presigned upload URL (no auth required - public form submissions need this)
router.post(
  '/presign',
  [
    body('fileName').trim().notEmpty().withMessage('File name is required'),
    body('fileType').trim().notEmpty().withMessage('File type is required'),
    body('fileSize').isInt({ min: 1 }).withMessage('File size must be a positive integer'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { fileName, fileType, fileSize } = req.body

      const result = await getPresignedUploadUrl(fileName, fileType, fileSize)

      if (!result.valid) {
        return res.status(400).json({ error: result.error })
      }

      res.json({ uploadUrl: result.uploadUrl, fileKey: result.fileKey })
    } catch (error) {
      next(error)
    }
  }
)

export default router
