import type { VercelRequest, VercelResponse } from '@vercel/node'
import sgMail from '@sendgrid/mail'
import { z } from 'zod'

const bugReportSchema = z.object({
  name: z.string(),
  description: z.string(),
  timestamp: z.string()
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const validatedData = bugReportSchema.parse(req.body)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

    const msg = {
      to: 'magnus@carlssen.co.uk',
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: `ReaperDiff Bug Report from ${validatedData.name}`,
      text: `Bug Report Details:\n${validatedData.description}`,
      html: `<h2>Bug Report Details</h2><p>${validatedData.description}</p>`
    }

    await sgMail.send(msg)
    res.json({ success: true })
  } catch (error) {
    console.error('Bug report error:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    })
  }
} 