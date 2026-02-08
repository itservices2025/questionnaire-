import crypto from 'crypto'

const OTP_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes
const MAX_ATTEMPTS = 5
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

// In-memory store: Map<pendingId, { email, otp, type, data, expiresAt, attempts }>
const store = new Map()

// Periodic cleanup of expired entries
setInterval(() => {
  const now = Date.now()
  for (const [id, entry] of store) {
    if (now > entry.expiresAt) {
      store.delete(id)
    }
  }
}, CLEANUP_INTERVAL_MS)

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function createPending({ email, type, data }) {
  const pendingId = crypto.randomUUID()
  const otp = generateOtp()

  store.set(pendingId, {
    email,
    otp,
    type,
    data,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  })

  return { pendingId, otp }
}

export function verifyOtp(pendingId, otp) {
  const entry = store.get(pendingId)

  if (!entry) {
    return { valid: false, error: 'Invalid or expired verification code' }
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(pendingId)
    return { valid: false, error: 'Verification code has expired' }
  }

  entry.attempts += 1

  if (entry.attempts > MAX_ATTEMPTS) {
    store.delete(pendingId)
    return { valid: false, error: 'Too many attempts. Please request a new code.' }
  }

  if (entry.otp !== otp) {
    return { valid: false, error: 'Incorrect verification code' }
  }

  // Valid - remove from store and return data
  store.delete(pendingId)
  return { valid: true, data: entry.data, email: entry.email, type: entry.type }
}

export function getPending(pendingId) {
  return store.get(pendingId) || null
}
