import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  consoleEmail: string;

  @ApiProperty()
  data: Record<string, any>;
}
