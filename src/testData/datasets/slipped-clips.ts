import { TestDataset } from '../../types'

export const slippedClipsDataset: TestDataset = {
  id: 'slipped-clips',
  name: 'Slipped Clips Test',
  description: 'Tests slipped clips',
  controlData: `<REAPER_PROJECT ...>
    // Your test control .rpp content here
  </REAPER_PROJECT>`,
  revisedData: `<REAPER_PROJECT ...>
    // Your test revised .rpp content here
  </REAPER_PROJECT>`
} as const satisfies TestDataset