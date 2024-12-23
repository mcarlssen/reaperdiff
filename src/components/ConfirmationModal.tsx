import { Modal, Button, Fade } from '@mui/material'

interface ConfirmationModalProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({ open, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <Modal 
      open={open} 
      onClose={onCancel}
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
        <div className="confirmation-modal">
          <h2 id="modal-title">Send Dataset for Analysis?</h2>
          <p>This will transmit the current Control and Revised datasets to an encrypted server for human review.</p>
          <p>No personally identifiable information will be included.</p>
          <p>Only a subset of your Reaper project data will be sent, including clip Position, Length, Offset, and Filename.</p>
          <p>Allowing us to review your dataset is the best way to help improve reaperdiff.app. We sincerely thank you!</p>
          <div className="modal-actions">
            <Button onClick={onConfirm} variant="contained">Send</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}
