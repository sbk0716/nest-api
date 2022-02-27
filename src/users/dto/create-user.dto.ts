import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    description: 'Email',
    default: 'shohei_ohtani@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'First Name',
    default: '翔平',
  })
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'Last Name',
    default: '大谷',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: true,
    description: 'First Name Kana',
    default: 'ショーヘイ',
  })
  @IsNotEmpty()
  firstNameKana: string;

  @ApiProperty({
    required: true,
    description: 'Last Name Kana',
    default: 'オオタニ',
  })
  @IsNotEmpty()
  lastNameKana: string;

  get hasRequiredAttributes(): boolean {
    if (
      this.email &&
      this.firstName &&
      this.lastName &&
      this.firstName &&
      this.firstNameKana &&
      this.lastNameKana
    )
      return true;
    return false;
  }
}
