'use server'
import type { ActionResponse } from '../../types'

interface EmailInput {
  controlData: string
  revisedData: string
  timestamp: string
}

export async function sendDatasetEmail(input: EmailInput): Promise<ActionResponse> {
  try {
    // Debug logging
    console.log('Environment variables:', {
      apiKey: process.env.REACT_APP_SENDGRID_API_KEY ? 'Present' : 'Missing',
      fromEmail: process.env.REACT_APP_SENDGRID_FROM_EMAIL,
      allEnvKeys: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
    })

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    return await response.json()
  } catch (error) {
    console.error('Email send error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send dataset for analysis'
    }
  }
}
