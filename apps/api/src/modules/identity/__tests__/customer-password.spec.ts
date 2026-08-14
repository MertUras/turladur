import { validate } from 'class-validator';

import {
  getCustomerPasswordError,
  isValidCustomerPassword,
} from '../../../../../../packages/shared-validators/src/index';
import { RegisterUserDto } from '../dto/register-user.dto';

function dtoWithPassword(password: string): RegisterUserDto {
  const dto = new RegisterUserDto();
  dto.email = 'ali@example.com';
  dto.password = password;
  dto.phone = '+905551234567';
  dto.identityNumber = '10000000146';
  dto.address = 'Cankaya Mah. Ankara';
  dto.otpCode = '123456';
  return dto;
}

describe('customer password rule (FE helper = BE DTO)', () => {
  it('accepts ASCII uppercase + digit + min 8', () => {
    expect(isValidCustomerPassword('Demo1234!')).toBe(true);
    expect(getCustomerPasswordError('Demo1234!')).toBeNull();
  });

  it('rejects Turkish İ without ASCII A–Z (register screenshot case)', () => {
    expect(isValidCustomerPassword('2908.İrem')).toBe(false);
    expect(getCustomerPasswordError('2908.İrem')).toMatch(/büyük harf/i);
  });

  it('rejects missing digit or missing ASCII uppercase', () => {
    expect(isValidCustomerPassword('Abcdefgh')).toBe(false);
    expect(isValidCustomerPassword('abcdef12')).toBe(false);
    expect(isValidCustomerPassword('Ab1')).toBe(false);
  });

  it('matches RegisterUserDto class-validator on the same passwords', async () => {
    const valid = await validate(dtoWithPassword('Demo1234!'));
    expect(valid.filter((e) => e.property === 'password')).toHaveLength(0);

    const turkishI = await validate(dtoWithPassword('2908.İrem'));
    const passwordErrors = turkishI.filter((e) => e.property === 'password');
    expect(passwordErrors.length).toBeGreaterThan(0);
    expect(JSON.stringify(passwordErrors[0].constraints)).toMatch(
      /büyük harf|minLength/i,
    );
  });
});
