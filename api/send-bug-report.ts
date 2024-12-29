const sgMail = require('@sendgrid/mail')
const { z } = require('zod')

const bugReportSchema = z.object({
  name: z.string(),
  description: z.string(),
  timestamp: z.string()
})

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Received bug report request')

    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key is not configured')
    }
    if (!process.env.SENDGRID_FROM_EMAIL) {
      throw new Error('SendGrid from email is not configured')
    }

    const validatedData = bugReportSchema.parse(req.body)
    console.log('Data validated successfully')

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    console.log('SendGrid initialized')

    const msg = {
      to: 'magnus@carlssen.co.uk',
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `ReaperDiff Bug Report from ${validatedData.name}`,
      text: `Bug Report Details:\n${validatedData.description}`,
      html: `<h2>Bug Report Details</h2><p>${validatedData.description}</p>`
    }

    await sgMail.send(msg)
    console.log('Email sent successfully')

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Bug report error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        hasFromEmail: !!process.env.SENDGRID_FROM_EMAIL
      }
    })

    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send bug report'
    })
  }
} 