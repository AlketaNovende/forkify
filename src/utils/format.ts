import type { RecipePreview } from '../types/recipe';

const FRACTIONS: Array<[number, string]> = [
  [0.125, '1/8'],
  [0.25, '1/4'],
  [0.333, '1/3'],
  [0.5, '1/2'],
  [0.667, '2/3'],
  [0.75, '3/4'],
];

export function formatQuantity(quantity: number | null): string {
  if (quantity === null || Number.isNaN(quantity) || quantity === 0) return '';
  if (Number.isInteger(quantity)) return String(quantity);

  const whole = Math.trunc(quantity);
  const decimal = quantity - whole;
  const fraction = FRACTIONS.find(([value]) => Math.abs(decimal - value) < 0.03)?.[1];

  if (fraction) return whole ? `${whole} ${fraction}` : fraction;

  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
  }).format(quantity);
}

export function getVisibleResults(
  results: RecipePreview[],
  page: number,
  resultsPerPage: number
): RecipePreview[] {
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  return results.slice(start, end);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
