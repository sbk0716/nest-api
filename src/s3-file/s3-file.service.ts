import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  IS3UploadFileParams,
  IS3DownloadFileParams,
  IS3GenerateUrl,
} from './s3-file.interface';

@Injectable()
export class S3FileService {
  async upload({ file, bucketName, path }: IS3UploadFileParams) {
    let key = file.name;
    if (path) {
      key = `${path}/${key}`;
    }
    const buffer = Buffer.from(file.data);
    const sendData = await new AWS.S3.ManagedUpload({
      params: {
        Bucket: bucketName,
        Body: buffer,
        Key: key,
      },
    }).promise();

    return sendData;
  }

  async download({ filePath, bucketName }: IS3DownloadFileParams) {
    const s3 = new AWS.S3();
    const params = {
      Bucket: bucketName,
      Key: filePath,
    };
    const objectOutput = await s3.getObject(params).promise();
    return objectOutput;
  }

  generateS3Url({ bucketName, region, path, fileName }: IS3GenerateUrl) {
    return `https://${bucketName}.s3-${region}.amazonaws.com/${path}/${fileName}`;
  }
}
