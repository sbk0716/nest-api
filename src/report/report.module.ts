import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { S3FileService } from '../s3-file/s3-file.service';
import { ReportController } from './report.controller';

@Module({
  controllers: [ReportController],
  providers: [ReportService, S3FileService],
  exports: [ReportService, S3FileService],
})
export class ReportModule {}
