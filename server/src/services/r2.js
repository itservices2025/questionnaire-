import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
])

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

let client = null

function getClient() {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return client
}

export function validateFileUpload(fileName, fileType, fileSize) {
  if (!ALLOWED_TYPES.has(fileType)) {
    return { valid: false, error: `File type "${fileType}" is not allowed` }
  }
  if (fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 50MB limit` }
  }
  return { valid: true }
}

export async function getPresignedUploadUrl(fileName, fileType, fileSize) {
  const validation = validateFileUpload(fileName, fileType, fileSize)
  if (!validation.valid) {
    return validation
  }

  const fileKey = `uploads/${crypto.randomUUID()}/${fileName}`

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
    ContentLength: fileSize,
  })

  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn: 900 }) // 15 min

  return { valid: true, uploadUrl, fileKey }
}

export async function getPresignedDownloadUrl(fileKey) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
  })

  return getSignedUrl(getClient(), command, { expiresIn: 3600 }) // 1 hour
}
