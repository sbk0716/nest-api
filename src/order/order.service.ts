import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { DynamoDbService } from '../dynamo-db/dynamo-db.service';
import { SqsService } from '../sqs/sqs.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private sqsService: SqsService,
    private dynamoDbService: DynamoDbService,
  ) {}

  async request(params: ICreateQuery, body: CreateOrderDto) {
    const orderId = uuidv4();
    const messageBody = {
      region: 'ap-northeast-1',
      table: 'reporting_orders',
      consoleEmail: body.consoleEmail,
      orderId,
    };
    const sendResult = await this.sqsService.send({
      body: JSON.stringify(messageBody),
      queueUrl:
        'https://sqs.ap-northeast-1.amazonaws.com/026353949484/prd-reporting-order-queue',
    });
    if (!sendResult.MessageId) {
      throw new Error('Send message to SQS failed');
    }

    const templateItemResponse = await this.dynamoDbService.get({
      keyData: {
        id: parseInt(params.tid.toString(), 10),
      },
      tableName: 'reporting_templates',
    });
    if (!templateItemResponse.Item) {
      throw new Error('Template file does not exists');
    }

    const templateItem = AWS.DynamoDB.Converter.unmarshall(
      templateItemResponse.Item,
    );
    const statusOrderId = `OPEN#${orderId}`;
    const orderItem = {
      consoleEmail: body.consoleEmail,
      statusOrderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ttl: 1615095844968,
      messageId: sendResult.MessageId,
      templateId: templateItem.id,
      templateName: templateItem.templateName,
      displayName: templateItem.displayName,
      formatId: parseInt(params.fid.toString(), 10),
      group: 'engineer',
      bucket: 'prd-reporting-file',
      data: body.data,
    };

    await this.dynamoDbService.add({
      item: orderItem,
      tableName: 'reporting_orders',
    });

    return {
      statusOrderId,
      messageId: sendResult.MessageId,
    };
  }
}
