import { z } from 'zod';

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
