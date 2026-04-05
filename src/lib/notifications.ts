type OperationalEmail = {
  to: string
  subject: string
  html: string
  text?: string
  tag?: string
}

export async function sendOperationalEmail(email: OperationalEmail) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    console.info('Operational email skipped: missing Resend configuration', {
      to: email.to,
      subject: email.subject,
      tag: email.tag,
    })
    return { delivered: false, provider: 'console' as const }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      tags: email.tag ? [{ name: 'flow', value: email.tag }] : undefined,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error('Resend failed', body)
    throw new Error('Failed to send operational email')
  }

  return { delivered: true, provider: 'resend' as const }
}
