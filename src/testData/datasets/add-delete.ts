import { TestDataset } from '../../types'

export const addDeleteDataset: TestDataset = {
  id: 'add-delete',
  name: 'Add/Delete Test',
  description: 'Tests addition and deletion of clips',
  controlData: `<REAPER_PROJECT ...>
    // Your test control .rpp content here
  </REAPER_PROJECT>`,
  revisedData: `<REAPER_PROJECT ...>
    // Your test revised .rpp content here
  </REAPER_PROJECT>`
} as const satisfies TestDataset