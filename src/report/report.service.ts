import { Injectable } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { AwsConfig } from '../configs/aws.config';
import { S3FileService } from '../s3-file/s3-file.service';
import { ExportReportDto } from './dto/export-report.dto';
import { FileFormat, FileFormatType } from './report.type';

// @todo This library have not support TypeScript as well, so we have to declare by using require
// explained in this thread https://forum.stimulsoft.com/viewtopic.php?t=58886
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stimulsoft = require('stimulsoft-reports-js');

@Injectable()
export class ReportService {
  constructor(private readonly s3FileService: S3FileService) {
    // Load font for export pdf file
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile(
      'assets/Meiryo-01.ttf',
      'Meiryo',
    );
  }

  getFileFormat({ format }: { format: FileFormatType }) {
    switch (format) {
      case FileFormat.Pdf:
        return Stimulsoft.Report.StiExportFormat.Pdf;
      case FileFormat.Word:
        return Stimulsoft.Report.StiExportFormat.Word2007;
      case FileFormat.Excel:
        return Stimulsoft.Report.StiExportFormat.Excel2007;
      default:
        throw new Error(`This format ${format} have not supported yet`);
    }
  }

  getFileExtension({ format }: { format: FileFormatType }) {
    switch (format) {
      case FileFormat.Pdf:
        return 'pdf';
      case FileFormat.Word:
        return 'docx';
      case FileFormat.Excel:
        return 'xlsx';
      default:
        throw new Error(`This format ${format} have not supported yet`);
    }
  }

  async export({
    template,
    format,
    data,
  }: ExportReportDto): Promise<ManagedUpload.SendData> {
    console.time('export file processing');
    const report = new Stimulsoft.Report.StiReport();

    // load template file
    console.time('download s3 file');
    const downloadedFile = await this.s3FileService.download({
      filePath: `template/engineer/${template}.mrt`,
      bucketName: AwsConfig.BUCKET_NAME,
    });
    console.timeEnd('download s3 file');
    report.load(downloadedFile.Body);
    report.dictionary.databases.clear();

    // load data (should be load from database)
    const dataSet = new Stimulsoft.System.Data.DataSet();
    if (
      template === 'SaleContract' ||
      template === 'SaleContractV2' ||
      template === 'SaleContractMeiryo'
    ) {
      dataSet.readJson({
        saleContract_trusteeA: {
          name: '代表取締役中島一樹',
          companyName: '株式会社 NKC ASIA',
          address:
            '〒150-0022\n東京都渋谷区恵比寿南 1-1-1\nヒューマックス恵比寿ビル 3F',
        },
        saleContract_trusteeB: {
          name: '代表取締役中島一樹',
          companyName: '株式会社 NKC ASIA',
          address:
            '〒150-0022\n東京都渋谷区恵比寿南 1-1-1\nヒューマックス恵比寿ビル 3F',
        },
      });
    } else {
      dataSet.readJson(data);
    }

    report.regData(dataSet.dataSetName, '', dataSet);

    console.time('render file');
    await report.renderAsync2();
    console.timeEnd('render file');

    console.time('export pdf');
    const exportedData = await report.exportDocumentAsync2(
      this.getFileFormat({ format }),
    );
    const buffer = Buffer.from(exportedData);

    console.timeEnd('export pdf');

    console.time('upload file to s3');
    const sendData = await this.s3FileService.upload({
      file: {
        name: `${template}-${new Date().getTime()}.${this.getFileExtension({
          format,
        })}`,
        data: buffer,
      },
      bucketName: AwsConfig.BUCKET_NAME,
      path: 'report',
    });
    console.timeEnd('upload file to s3');
    console.timeEnd('export file processing');
    return sendData;
  }
}
