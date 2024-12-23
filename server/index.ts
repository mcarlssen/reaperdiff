import express from 'express'
import sgMail from '@sendgrid/mail'
import { z } from 'zod'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const app = express()
app.use(express.json({ limit: '10mb' }))

const emailSchema = z.object({
  controlData: z.string().min(1, 'Control data is required'),
  revisedData: z.string().min(1, 'Revised data is required'),
  timestamp: z.string()
})

app.post('/api/send-email', async (req, res) => {
  try {
    // Debug log environment variables (redact sensitive info)
    console.log('Server environment check:', {
      hasApiKey: Boolean(process.env.REACT_APP_SENDGRID_API_KEY),
      hasFromEmail: Boolean(process.env.REACT_APP_SENDGRID_FROM_EMAIL),
      apiKeyPrefix: process.env.REACT_APP_SENDGRID_API_KEY?.substring(0, 5)
    })

    // Validate input
    const validatedData = emailSchema.parse(req.body)
    
    const apiKey = process.env.REACT_APP_SENDGRID_API_KEY
    const fromEmail = process.env.REACT_APP_SENDGRID_FROM_EMAIL

    if (!apiKey || !apiKey.startsWith('SG.')) {
      throw new Error('Invalid SendGrid API key')
    }

    if (!fromEmail) {
      throw new Error('SendGrid from email is not configured')
    }

    // Initialize SendGrid
    sgMail.setApiKey(apiKey)

    const msg = {
      to: 'magnus@carlssen.co.uk',
      from: fromEmail,
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
    res.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    })
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
