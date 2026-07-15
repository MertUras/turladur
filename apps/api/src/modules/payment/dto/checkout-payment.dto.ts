import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CheckoutPaymentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  reservationId!: string;

  @ApiProperty({ example: 'Ahmet Yılmaz' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  cardHolderName!: string;

  @ApiProperty({ example: '5528790000000008' })
  @IsString()
  @MinLength(15)
  @MaxLength(19)
  cardNumber!: string;

  @ApiProperty({ example: '12' })
  @Matches(/^(0[1-9]|1[0-2])$/)
  expireMonth!: string;

  @ApiProperty({ example: '30' })
  @Matches(/^\d{2}$|^\d{4}$/)
  expireYear!: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @MinLength(3)
  @MaxLength(4)
  cvc!: string;
}
