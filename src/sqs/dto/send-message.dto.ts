import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty()
  body: string;

  @ApiProperty()
  queueUrl: string;
}
