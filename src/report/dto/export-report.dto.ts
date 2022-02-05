import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FileFormatType } from '../report.type';

export class ExportReportDto {
  @ApiProperty()
  @IsNotEmpty()
  template: string;

  @ApiProperty()
  format: FileFormatType;

  @ApiProperty()
  data: Record<string, any>;
}
