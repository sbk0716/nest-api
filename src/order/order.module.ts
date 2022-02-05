import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SqsService } from '../sqs/sqs.service';
import { DynamoDbService } from '../dynamo-db/dynamo-db.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, SqsService, DynamoDbService],
})
export class OrderModule {}
