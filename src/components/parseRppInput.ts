import { parseRppFile } from './parseRppFile';
import { Clip } from '../types';

export async function parseRppInput(
  content: string
): Promise<Clip[]> {
  if (!content) {
    throw new Error('No content provided')
  }

  return parseRppFile(content, 'test data')
} 