import type { ActionResponse } from '../../types'

interface SendEmailData {
  controlData: string
  revisedData: string
  timestamp: string
}

interface BugReportData {
  name: string
  description: string
  timestamp: string
}

export async function sendEmail(data: SendEmailData): Promise<ActionResponse> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    return await response.json()
  } catch (error) {
    console.error('Send email error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
}

export async function sendBugReport(data: BugReportData): Promise<ActionResponse> {
  try {
    const response = await fetch('/api/send-bug-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    return await response.json()
  } catch (error) {
    console.error('Send bug report error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send bug report'
    }
  }
}
