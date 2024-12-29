import React, { useState } from 'react'
import { Modal, Button, Fade, Switch } from '@mui/material'
import { sendBugReport } from './helpers/sendEmail'
import { toast } from 'react-hot-toast'

interface InfoModalProps {
  open: boolean
  onClose: () => void
  type: 'about' | 'howto' | 'bug' | null
  onTypeChange: (newType: 'about' | 'howto' | 'bug') => void
}

// Define types for our content items
type ContentItem = {
  type: 'component'
  component: React.ReactElement
} | {
  type: 'html'
  content: string
}

interface ContentSection {
  title: string
  content: ContentItem[]
}

export function InfoModal({ open, onClose, type, onTypeChange }: InfoModalProps) {
  const [bugName, setBugName] = useState('')
  const [bugDescription, setBugDescription] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    
    const response = await sendBugReport({
      name: bugName,
      description: bugDescription,
      timestamp: new Date().toISOString()
    })

    setIsSending(false)
    if (response.success) {
      toast.success('Report sent successfully, thank you!')
      onClose()
      setBugName('')
      setBugDescription('')
    } else {
      toast.error(response.error || 'Failed to send bug report')
    }
    // Optionally handle error case
  }

  const getContent = (): ContentSection => {
    switch (type) {
      case 'about':
        return {
          title: '',
          content: [
            {
              type: 'html',
              content: `<h2>To get started, check out <a href="#" onclick="return false" class="modal-link" data-type="howto">how to use ReaperDiff</a>.</h3>
              <h3>What is ReaperDiff?</h2>
              <p><b>Have you ever been burned by unexpected ripple edits or in/out slips in longform audio timelines? Perhaps one minor clip deletion that did not ripple on all tracks?</b></p>
              <p>It has happened to all of us. To provide a fast, simple QA check (and save our sanity), ReaperDiff was created: simply <i>upload the before-and-after Reaper project files (revisioned appropriately) and ReaperDiff will generate a simple, color-coded, at-a-glance list of changes.</i></p>
              <p class="info-modal-note">
                <span class="info-modal-icon info"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg></span>
                This tool works best on longform, single- or dual-track projects, such as audiobooks, podcasts, and other audio projects. You can try it with more complex timelines, but the results may be difficult to interpret!
              </p>
              <p class="info-modal-warning">
                <span class="info-modal-icon warning"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#bf4136" viewBox="0 0 256 256"><path d="M120,16V8a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm80,32a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,200,48ZM50.34,45.66A8,8,0,0,0,61.66,34.34l-8-8A8,8,0,0,0,42.34,37.66Zm87,26.45a8,8,0,1,0-2.64,15.78C153.67,91.08,168,108.32,168,128a8,8,0,0,0,16,0C184,100.6,163.93,76.57,137.32,72.11ZM232,176v24a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V176a16,16,0,0,1,16-16V128a88,88,0,0,1,88.67-88c48.15.36,87.33,40.29,87.33,89v31A16,16,0,0,1,232,176ZM56,160H200V129c0-40-32.05-72.71-71.45-73H128a72,72,0,0,0-72,72Zm160,40V176H40v24H216Z"></path></svg></span>
                If at any time the results are not what you expect, click the warning-light icon to email the dataset to us for analysis. This helps us make the tool more useful and reliable!
              </p>
              <p class="info-modal-footnote">ReaperDiff was designed and built by <a href="https://github.com/mcarlssen" class="modal-link" target="_blank">Magnus Carlssen</a></p>`
            }
          ]
        }
      case 'howto':
        return {
          title: 'How to use ReaperDiff',
          content: [
            {
              type: 'html',
              content: `
                <p class="info-modal-note"><b>To try out ReaperDiff's features without uploading your own project files, toggle the "Test Mode" switch in the top-right corner.</b></p>
                <h3>ReaperDiff works by comparing changes between two .RPP files.</h3>
                <p>Drag-and-drop or click on the drop zones to select an 'original' project file, and a 'revised' project file, then click "Compare Files."</p>
                <p>ReaperDiff will create a timeline visualization, color-coded to the type of changes detected.</p>
                <p>Below the timeline, you'll find a list of changes, and summary stats. Hover over an entry to find the corresponding clip on the timeline, and vice versa!.</p>
                <div class="info-modal-note info-modal-list">
                  <p><b>ALGORITHM NOTES:</b></p> 
                  <p>ReaperDiff detects changes based on a clip's start time, duration, source media offset, source file name, and mute state.</p>
                  <p>The algorithm will ignore all clips and tracks in a MUTED state.</p>
                  <p>The algorithm has a hard-coded 5ms tolerance, and will not detect changes smaller than this. If you require more precision, please <a href="#" onclick="return false" class="modal-link" data-type="bug">let me know</a>.</p>
                </div>
                <p>To see more details about a specific clip's classification, hover over the clip on the timeline, or its corresponding list entry.</p>
                <p>If the results aren't quite what you expect, click the warning-light icon to email the dataset to us for analysis. This helps us make the tool more useful and reliable!</p>
                <p class="info-modal-warning">Please note that no PII is ever collected or stored, and only the minimum data necessary from your Reaper project files is submitted for manual review.</p>
                <p>Lastly, if you discover a bug, please <a href="#" onclick="return false" class="modal-link" data-type="bug">click here</a> to report it!</p>
                `
            }
          ]
        }
      case 'bug':
        return {
          title: 'Found a bug? Unexpected behavior? Please let us know!',
          content: [
            {
              type: 'component',
              component: (
                <form onSubmit={handleBugSubmit}>
                  <div className="info-modal-form-group">
                    <label htmlFor="bugName">Name</label>
                    <input
                      id="bugName"
                      type="text"
                      value={bugName}
                      onChange={(e) => setBugName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="info-modal-form-group">
                    <label htmlFor="bugDescription">Description of issue</label>
                    <textarea
                      id="bugDescription"
                      value={bugDescription}
                      onChange={(e) => setBugDescription(e.target.value)}
                      required
                      rows={4}
                    />
                  </div>
                  <div className="modal-actions">
                    <Button 
                      type="submit" 
                      disabled={isSending}
                      variant="contained"
                    >
                      {isSending ? 'Sending...' : 'Submit'}
                    </Button>
                  </div>
                </form>
              )
            }
          ]
        }
      default:
        return { title: '', content: [] }
    }
  }

  const handleModalLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('modal-link')) {
      const newType = target.getAttribute('data-type') as 'about' | 'howto' | 'bug'
      if (newType) onTypeChange(newType)
    }
  }

  const { title, content } = getContent()

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="modal-title"
      BackdropProps={{
        timeout: 500,
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }
      }}
    >
      <Fade in={open}>
        <div className="info-modal" onClick={handleModalLinkClick}>
          <h2 id="modal-title">{title}</h2>
          {content.map((item: ContentItem, index) => (
            item.type === 'component' 
              ? item.component
              : <div 
                  key={index} 
                  dangerouslySetInnerHTML={{ __html: item.content }}
                  className="info-modal-paragraph"
                />
          ))}
          <div className="modal-actions">
            <Button onClick={onClose} className="modal-close-button">Close</Button>
          </div>
        </div>
      </Fade>
    </Modal>
  )
} 