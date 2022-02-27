import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    description: 'Email',
    default: 'shohei_ohtani@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    description: 'First Name',
    default: '翔平',
  })
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({
    required: false,
    description: 'Last Name',
    default: '大谷',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: false,
    description: 'First Name Kana',
    default: 'ショーヘイ',
  })
  @IsNotEmpty()
  firstNameKana: string;

  @ApiProperty({
    required: false,
    description: 'Las Name Kana',
    default: 'オオタニ',
  })
  @IsNotEmpty()
  lastNameKana: string;

  get hasRequiredAttributes(): boolean {
    if (this.email) return true;
    return false;
  }
}
