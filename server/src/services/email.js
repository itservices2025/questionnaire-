import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

// ── Shared email shell ──────────────────────────────────────────────

function emailShell(title, bodyContent) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="dark"/>
  <meta name="supported-color-schemes" content="dark"/>
  <title>${title}</title>
  <!--[if mso]>
  <style>
    table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Montserrat','Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0f0f1a;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="520" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:24px;overflow:hidden;box-shadow:0 8px 32px rgba(31,38,135,0.37),0 0 80px rgba(124,58,237,0.08);">

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">

                <!-- Top glow bar -->
                <tr>
                  <td style="height:3px;background:linear-gradient(90deg,transparent 0%,#a78bfa 30%,#7c3aed 50%,#a78bfa 70%,transparent 100%);"></td>
                </tr>

                <!-- Logo -->
                <tr>
                  <td style="padding:40px 40px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td align="center" style="padding-bottom:32px;">
                          <div style="display:inline-block;border:2.5px solid #ffffff;border-radius:4px;padding:4px 5px 3px 5px;">
                            <div style="font-family:'Montserrat',Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:8px;color:#ffffff;text-align:center;margin:0;line-height:1;">NETRA</div>
                            <div style="text-align:right;margin-top:0;line-height:1;padding-right:0;">
                              <span style="font-family:'Montserrat',Arial,sans-serif;font-size:8px;letter-spacing:0.3px;color:rgba(255,255,255,0.5);font-weight:400;">Stoic </span><span style="font-family:'Montserrat',Arial,sans-serif;font-size:8px;letter-spacing:0.3px;font-weight:700;color:#a78bfa;">DNC</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body content -->
                ${bodyContent}

                <!-- Footer -->
                <tr>
                  <td style="padding:28px 40px 36px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;" align="center">
                          <p style="margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);">
                            &copy; ${new Date().getFullYear()} NETRA Forms by Stoic DNC
                          </p>
                          <p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.15);">
                            This is an automated message. Please do not reply.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}

// ── OTP Email ───────────────────────────────────────────────────────

function buildOtpEmail(otp) {
  const digitBoxes = otp
    .split('')
    .map(
      (d) =>
        `<td style="padding:0 4px;">
          <div style="width:48px;height:56px;line-height:56px;text-align:center;font-size:24px;font-weight:700;font-family:'Courier New',monospace;color:#ffffff;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);border-radius:10px;">
            ${d}
          </div>
        </td>`
    )
    .join('')

  const body = `
                <!-- Glass card with OTP -->
                <tr>
                  <td style="padding:0 28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;overflow:hidden;">
                      <tr>
                        <td align="center" style="padding:32px 24px 0;">
                          <div style="width:56px;height:56px;line-height:56px;text-align:center;background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.25);border-radius:14px;margin:0 auto 16px;">
                            <span style="font-size:26px;">&#x1F512;</span>
                          </div>
                          <h2 style="margin:0 0 6px;font-family:'Montserrat',Arial,sans-serif;font-size:20px;font-weight:700;color:#ffffff;">Verification Code</h2>
                          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.5;">Enter this code to verify your identity</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding:28px 16px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                            <tr>${digitBoxes}</tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding:0 24px 28px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.15);border-radius:10px;">
                            <tr>
                              <td style="padding:10px 20px;">
                                <span style="font-size:16px;vertical-align:middle;">&#9200;</span>
                                <span style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;color:#a78bfa;font-weight:600;vertical-align:middle;margin-left:6px;">Expires in 10 minutes</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Security tips -->
                <tr>
                  <td style="padding:24px 40px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;">
                          <p style="margin:0 0 12px;font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:2px;text-transform:uppercase;">Security</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr><td width="24" valign="top" style="padding:0 10px 8px 0;"><span style="font-size:13px;color:rgba(255,255,255,0.3);">&#x2022;</span></td><td style="padding-bottom:8px;"><span style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.5;">Never share this code with anyone</span></td></tr>
                            <tr><td width="24" valign="top" style="padding:0 10px 8px 0;"><span style="font-size:13px;color:rgba(255,255,255,0.3);">&#x2022;</span></td><td style="padding-bottom:8px;"><span style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.5;">NETRA Forms will never ask for your password via email</span></td></tr>
                            <tr><td width="24" valign="top" style="padding:0 10px 0 0;"><span style="font-size:13px;color:rgba(255,255,255,0.3);">&#x2022;</span></td><td><span style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.5;">If you didn't request this, safely ignore this email</span></td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`

  return emailShell('NETRA Forms - Verification Code', body)
}

// ── Format answer value for emails ──────────────────────────────────

function formatAnswerValue(value, type) {
  if (value === null || value === undefined || value === '') return '—'
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    if (Array.isArray(parsed)) return parsed.join(', ')
    if (typeof parsed === 'boolean') return parsed ? 'Yes' : 'No'
    if (type === 'name' && typeof parsed === 'object') {
      return [parsed.firstName, parsed.lastName].filter(Boolean).join(' ') || '—'
    }
    if (type === 'phone' && typeof parsed === 'object') {
      return parsed.number ? `${parsed.countryCode} ${parsed.number}` : '—'
    }
    if (type === 'file' && typeof parsed === 'object') {
      return parsed.fileName || parsed.name || '[File uploaded]'
    }
    if (typeof parsed === 'object') return JSON.stringify(parsed)
    return String(parsed)
  } catch {
    return String(value)
  }
}

// ── Submission Email (shared layout for respondent + admin) ─────────

function buildSubmissionEmail({ formTitle, answers, isAdmin, submittedAt, responseId }) {
  const icon = isAdmin ? '&#x1F4E8;' : '&#x2705;'
  const heading = isAdmin ? 'New Response Received' : 'Response Confirmed'
  const subtitle = isAdmin
    ? `A new submission was received for <strong style="color:#ffffff;">${escapeHtml(formTitle)}</strong>`
    : `Your response to <strong style="color:#ffffff;">${escapeHtml(formTitle)}</strong> has been recorded`

  const time = new Date(submittedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  // Build Q&A rows
  const answerRows = answers
    .map(
      (a, i) => `
                            <tr>
                              <td style="padding:${i === 0 ? '0' : '14px'} 0 0 0;" colspan="2">
                                <p style="margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:700;color:#a78bfa;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(a.question)}</p>
                                <p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:14px;color:#ffffff;line-height:1.5;word-break:break-word;">${escapeHtml(a.answer)}</p>
                              </td>
                            </tr>
                            ${i < answers.length - 1 ? `<tr><td colspan="2" style="padding-top:14px;"><div style="height:1px;background:rgba(255,255,255,0.06);"></div></td></tr>` : ''}`
    )
    .join('')

  const body = `
                <!-- Glass card: header -->
                <tr>
                  <td style="padding:0 28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;overflow:hidden;">

                      <!-- Icon + heading -->
                      <tr>
                        <td align="center" style="padding:32px 24px 0;">
                          <div style="width:56px;height:56px;line-height:56px;text-align:center;background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.25);border-radius:14px;margin:0 auto 16px;">
                            <span style="font-size:26px;">${icon}</span>
                          </div>
                          <h2 style="margin:0 0 6px;font-family:'Montserrat',Arial,sans-serif;font-size:20px;font-weight:700;color:#ffffff;">${heading}</h2>
                          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.5;">${subtitle}</p>
                        </td>
                      </tr>

                      <!-- Metadata pill -->
                      <tr>
                        <td align="center" style="padding:20px 24px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="padding:6px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:8px;">
                                <span style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.4);">&#x1F4C5; ${time}</span>
                                ${responseId ? `<span style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.25);padding:0 8px;">|</span><span style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.4);">ID: ${responseId.slice(-8)}</span>` : ''}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding:20px 24px 0;">
                          <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
                        </td>
                      </tr>

                      <!-- Answers section label -->
                      <tr>
                        <td style="padding:16px 24px 0;">
                          <p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:2px;text-transform:uppercase;">
                            ${isAdmin ? 'Submission Details' : 'Your Answers'}
                          </p>
                        </td>
                      </tr>

                      <!-- Q&A rows -->
                      <tr>
                        <td style="padding:16px 24px 28px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            ${answerRows}
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>

                <!-- Tip text -->
                <tr>
                  <td style="padding:20px 40px 0;">
                    <p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.3);text-align:center;line-height:1.5;">
                      ${isAdmin ? 'You received this because a form you manage got a new submission.' : 'Keep this email as a confirmation of your submission.'}
                    </p>
                  </td>
                </tr>`

  const subject = isAdmin
    ? `New response: ${formTitle}`
    : `Your submission to ${formTitle}`

  return { html: emailShell(`NETRA Forms - ${heading}`, body), subject }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Exports ─────────────────────────────────────────────────────────

export async function sendOtpEmail(to, otp) {
  if (!process.env.SMTP_HOST) {
    console.log(`[DEV OTP] ${to}: ${otp}`)
    return
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER

  await getTransporter().sendMail({
    from,
    to,
    subject: 'NETRA Forms - Verification Code',
    html: buildOtpEmail(otp),
  })
}

export async function sendSubmissionEmails({ adminEmail, respondentEmail, formTitle, questions, answers, submittedAt, responseId }) {
  // Format answers for display
  const formattedAnswers = questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id)
    return {
      question: q.label,
      answer: answer ? formatAnswerValue(answer.value, q.type) : '—',
    }
  })

  const opts = { formTitle, answers: formattedAnswers, submittedAt, responseId }

  // Admin notification
  const adminEmail_ = buildSubmissionEmail({ ...opts, isAdmin: true })
  // Respondent confirmation
  const respondentEmail_ = buildSubmissionEmail({ ...opts, isAdmin: false })

  if (!process.env.SMTP_HOST) {
    console.log(`[DEV EMAIL] Admin notification -> ${adminEmail} | Subject: ${adminEmail_.subject}`)
    if (respondentEmail) {
      console.log(`[DEV EMAIL] Respondent confirmation -> ${respondentEmail} | Subject: ${respondentEmail_.subject}`)
    }
    return
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  const transport = getTransporter()

  // Send both in parallel, don't let failures block the response
  const sends = [
    transport.sendMail({ from, to: adminEmail, subject: adminEmail_.subject, html: adminEmail_.html }),
  ]
  if (respondentEmail) {
    sends.push(
      transport.sendMail({ from, to: respondentEmail, subject: respondentEmail_.subject, html: respondentEmail_.html })
    )
  }

  await Promise.allSettled(sends)
}
