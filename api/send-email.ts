const { default: sgMail } = require('@sendgrid/mail')
const { z } = require('zod')

const emailSchema = z.object({
  controlData: z.string(),
  revisedData: z.string(),
  timestamp: z.string()
})

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Received email request')

    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key is not configured')
    }
    if (!process.env.SENDGRID_FROM_EMAIL) {
      throw new Error('SendGrid from email is not configured')
    }

    const validatedData = emailSchema.parse(req.body)
    console.log('Data validated successfully')

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    console.log('SendGrid initialized')

    const msg = {
      to: 'magnus@carlssen.co.uk',
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Reaperdiff dataset for analysis',
      text: `Dataset analysis request submitted on ${validatedData.timestamp}`,
      attachments: [
        {
          content: Buffer.from(validatedData.controlData).toString('base64'),
          filename: 'control_dataset.txt',
          type: 'text/plain',
          disposition: 'attachment'
        },
        {
          content: Buffer.from(validatedData.revisedData).toString('base64'),
          filename: 'revised_dataset.txt',
          type: 'text/plain',
          disposition: 'attachment'
        }
      ]
    }

    await sgMail.send(msg)
    console.log('Email sent successfully')

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Email error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        hasFromEmail: !!process.env.SENDGRID_FROM_EMAIL
      }
    })

    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    })
  }
} 