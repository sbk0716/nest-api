import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDbService } from '../dynamo-db/dynamo-db.service';
import { SqsService } from '../sqs/sqs.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService, SqsService, DynamoDbService],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
