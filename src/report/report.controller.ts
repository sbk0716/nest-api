import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExportReportDto } from './dto/export-report.dto';
import { ReportService } from './report.service';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('export')
  async export(@Body() exportReport: ExportReportDto) {
    const sendData = await this.reportService.export(exportReport);
    return sendData;
  }
}
