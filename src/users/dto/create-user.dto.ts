import { instanceToPlain } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: false,
    description: 'UUID',
    default: '80000000-4000-4000-4000-120000000000',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

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

  get attributes() {
    return instanceToPlain(this);
  }

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
