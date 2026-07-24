/**
 * Official Turkish National ID (TCKN) checksum.
 * Empty / null → skip (optional field).
 */
export function isValidTckn(value: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(value)) return false;
  const digits = value.split('').map(Number);
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  if ((oddSum * 7 - evenSum) % 10 !== digits[9]) return false;
  const firstTenSum = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  return firstTenSum % 10 === digits[10];
}
