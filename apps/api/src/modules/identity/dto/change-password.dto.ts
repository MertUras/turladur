import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @ApiProperty({
    description: 'Min 8 chars, 1 uppercase, 1 digit',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Yeni şifre en az 1 büyük harf ve 1 rakam içermelidir',
  })
  newPassword!: string;
}
