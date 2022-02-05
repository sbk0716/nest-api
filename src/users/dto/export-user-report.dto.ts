import { ApiProperty } from '@nestjs/swagger';
import { FileFormatType } from '../../report/report.type';

export class ExportUserReportDto {
  @ApiProperty()
  template: string;

  @ApiProperty()
  format: FileFormatType;
}
