import { parseRppFile } from './parseRppFile';
import { Clip } from '../types';

export async function parseRppInput(input: File | string, verbose: boolean): Promise<Clip[]> {
  let content: string;

  if (typeof input === 'string') {
    content = input;
  } else {
    content = await input.text();
  }

  return parseRppFile(content, verbose);
} 