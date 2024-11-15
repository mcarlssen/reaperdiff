interface AlgorithmDescription {
  name: string
  criteria: string[]
}

const algorithmDescriptions: Record<string, AlgorithmDescription> = {
  fingerprint: {
    name: 'Fingerprint Detection',
    criteria: [
      'Flags a clip as changed when either:',
      '• Length difference ≥ 0.005 seconds',
      '• Offset difference ≥ 0.005 seconds'
    ]
  },
  position: {
    name: 'Position Detection',
    criteria: [
      'Flags a clip as changed when:',
      '• Position values differ between control and revised'
    ]
  },
  length: {
    name: 'Length Detection',
    criteria: [
      'Flags a clip as changed when:',
      '• Length difference > 0.001 seconds'
    ]
  },
  overlap: {
    name: 'Overlap Detection',
    criteria: [
      'Flags clips as changed when:',
      '• End position of clip overlaps start of next clip'
    ]
  },
  addsdeletes: {
    name: 'Added/Deleted Clip Detection',
    criteria: [
      'Identifies truly new or deleted clips by:',
      '• Finding clips with no fingerprint match',
      '• Verifying surrounding clips match in both files',
      '• Confirming position shifts match clip length'
    ]
  }
}

export function generateAlgorithmTooltip(algorithm: string): string {
  const description = algorithmDescriptions[algorithm.toLowerCase()]
  if (!description) return ''
  
  //return [description.name, '', ...description.criteria].join('\n')
  return [...description.criteria].join('\n')
} 