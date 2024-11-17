import { TestDataset } from '../../types'

export default {
  id: 'unique-id',
  name: 'Display Name',
  description: 'Dataset description for tooltip',
  controlData: `<REAPER_PROJECT ...>
    // Control file content
  </REAPER_PROJECT>`,
  revisedData: `<REAPER_PROJECT ...>
    // Revised file content
  </REAPER_PROJECT>`
} as const satisfies TestDataset 