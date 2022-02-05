import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { AwsConfig } from '../configs/aws.config';

@Injectable()
export class SqsService {
  async send({ body, queueUrl }: SendMessageDto) {
    const sqs = new AWS.SQS({
      region: AwsConfig.REGION,
    });
    return sqs
      .sendMessage({
        MessageBody: body,
        QueueUrl: queueUrl,
      })
      .promise();
  }
}
