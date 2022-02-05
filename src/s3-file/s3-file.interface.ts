export interface IS3UploadFileParams {
  file: { name: string; data: any };
  bucketName: string;
  path: string;
}

export interface IS3DownloadFileParams {
  filePath: string;
  bucketName: string;
}

export interface IS3GenerateUrl {
  bucketName: string;
  region: string;

  // example:
  // report
  // report/annualFinance
  path: string;
  fileName: string;
}
