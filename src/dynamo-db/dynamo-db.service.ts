import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { GetDynamoDbItemDto } from './dto/get-dynamo-db-item.dto';
import { AwsConfig } from '../configs/aws.config';
import { CreateDynamoDbItemDto } from './dto/create-dynamo-db-item.dto';

@Injectable()
export class DynamoDbService {
  async get({ keyData, tableName }: GetDynamoDbItemDto) {
    AWS.config.region = AwsConfig.REGION;
    const dynamoDb = new AWS.DynamoDB();
    return dynamoDb
      .getItem({
        Key: AWS.DynamoDB.Converter.marshall(keyData),
        TableName: tableName,
      })
      .promise();
  }

  async add({ item, tableName }: CreateDynamoDbItemDto) {
    AWS.config.region = AwsConfig.REGION;
    const dynamoDb = new AWS.DynamoDB();
    const parsedItem = AWS.DynamoDB.Converter.marshall(item);
    return dynamoDb
      .putItem({
        Item: parsedItem,
        TableName: tableName,
      })
      .promise();
  }
}
