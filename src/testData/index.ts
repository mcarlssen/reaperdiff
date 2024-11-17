import { TestDataset } from '../types'
import { addDeleteDataset } from './datasets/add-delete'
import { slippedClipsDataset } from './datasets/slipped-clips'
// Import other datasets here as they are added
// import { comboDataset } from './datasets/combo'
// import { comboDataset } from './datasets/combo'

// Type guard to ensure dataset matches interface
function isValidDataset(dataset: unknown): dataset is TestDataset {
  return (
    dataset !== null &&
    typeof dataset === 'object' &&
    'id' in dataset &&
    'name' in dataset &&
    'description' in dataset &&
    'controlData' in dataset &&
    'revisedData' in dataset
  )
}

// Collect all datasets
export const testDatasets: TestDataset[] = [
  addDeleteDataset,
  slippedClipsDataset
  // Add other datasets here as they are imported
].filter(isValidDataset)

export const getDatasetById = (id: string): TestDataset | undefined => 
  testDatasets.find(dataset => dataset.id === id)
