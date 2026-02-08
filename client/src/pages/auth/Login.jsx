import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FiMail, FiLock, FiLogIn, FiSun, FiMoon, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { GlassCard, GlassInput, GlassButton, Logo } from '../../components/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [pendingId, setPendingId] = useState(null)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef([])
  const { login, verifyLogin, resendOtp } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(email, password)
      setPendingId(data.pendingId)
      setStep(2)
      toast.success('Verification code sent to your email')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit code')
      return
    }
    setLoading(true)
    try {
      await verifyLogin(pendingId, code)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await resendOtp(pendingId)
      toast.success('Code resent to your email')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
      </button>

      <GlassCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="large" />
          </div>
          {step === 1 ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/60">Sign in to manage your forms</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Verify Your Identity</h1>
              <p className="text-white/60">Enter the 6-digit code sent to <span className="text-purple-400">{email}</span></p>
            </>
          )}
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
              <GlassInput
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
              <GlassInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11"
              />
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Sending code...
                </span>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </GlassButton>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify & Sign In'
              )}
            </GlassButton>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']) }}
                className="text-white/60 hover:text-white text-sm flex items-center gap-1"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleResend}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-white/60">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300">
            Sign up
          </Link>
        </p>
      </GlassCard>
    </div>
  )
}
