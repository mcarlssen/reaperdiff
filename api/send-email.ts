import type { VercelRequest, VercelResponse } from '@vercel/node'
import sgMail from '@sendgrid/mail'
import { z } from 'zod'

const emailSchema = z.object({
  controlData: z.string(),
  revisedData: z.string(),
  timestamp: z.string()
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const validatedData = emailSchema.parse(req.body)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

    const msg = {
      to: 'magnus@carlssen.co.uk',
      from: process.env.SENDGRID_FROM_EMAIL as string,
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
    console.error('Email error:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    })
  }
} 