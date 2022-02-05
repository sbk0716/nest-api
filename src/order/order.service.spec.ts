import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDbService } from '../dynamo-db/dynamo-db.service';
import { SqsService } from '../sqs/sqs.service';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, SqsService, DynamoDbService],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
