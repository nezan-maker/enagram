import { z } from 'zod';
import * as XLSX from 'xlsx';

const rowSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(5),
  role: z.enum(['HR_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_MANAGER', 'CHEF', 'WAITER']),
  email: z.string().email().optional(),
});

export interface ParsedRow {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  email?: string;
}

export interface ParseResult {
  valid: ParsedRow[];
  invalid: { row: number; reasons: string[] }[];
}

export const parseRows = (rawRows: Record<string, string>[]): ParseResult => {
  const result: ParseResult = { valid: [], invalid: [] };
  rawRows.forEach((row, i) => {
    const parsed = rowSchema.safeParse(row);
    if (parsed.success) {
      result.valid.push(parsed.data);
    } else {
      result.invalid.push({
        row: i + 1,
        reasons: parsed.error.issues.map(e => `${e.path.join('.')}: ${e.message}`),
      });
    }
  });
  return result;
};

/**
 * Parse an uploaded enrollment file (CSV or Excel) from a Buffer.
 * Returns an array of valid ParsedRow objects.
 */
export const parseEnrollmentFile = async (buffer: Buffer, fileType: string): Promise<ParsedRow[]> => {
  let rawRows: Record<string, string>[] = [];

  if (fileType.includes('csv') || fileType.endsWith('.csv')) {
    // Parse CSV buffer
    const content = buffer.toString('utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
      rawRows.push(row);
    }
  } else {
    // Parse Excel buffer using SheetJS
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return [];
    const sheet = workbook.Sheets[sheetName];
    rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
  }

  const { valid } = parseRows(rawRows);
  return valid;
};
