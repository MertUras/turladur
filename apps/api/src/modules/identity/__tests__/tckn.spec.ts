import { isValidTckn } from '../../../shared/utils/tckn';

describe('isValidTckn', () => {
  it('accepts a known valid TCKN', () => {
    expect(isValidTckn('10000000146')).toBe(true);
  });

  it('rejects wrong length', () => {
    expect(isValidTckn('123')).toBe(false);
  });

  it('rejects leading zero', () => {
    expect(isValidTckn('01234567890')).toBe(false);
  });

  it('rejects bad checksum', () => {
    expect(isValidTckn('10000000147')).toBe(false);
  });
});
