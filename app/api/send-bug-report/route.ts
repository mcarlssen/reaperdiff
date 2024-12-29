import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function POST(request: Request) {
  try {
    const { name, description, timestamp } = await request.json()

    if (!name || !description) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    const msg = {
      to: process.env.SENDGRID_TO_EMAIL as string,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: `ReaperDiff Bug Report from ${name}`,
      text: `
Bug Report Details:
------------------
Name: ${name}
Timestamp: ${timestamp}

Description:
${description}
      `,
      html: `
        <h2>Bug Report Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <h3>Description:</h3>
        <p>${description.replace(/\n/g, '<br>')}</p>
      `
    }

    await sgMail.send(msg)

    return NextResponse.json({ 
      success: true,
      message: 'Bug report sent successfully' 
    })

  } catch (error) {
    console.error('Send bug report error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to send bug report' 
    }, { status: 500 })
  }
} 