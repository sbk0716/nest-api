import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Query() params: ICreateQuery, @Body() body: CreateOrderDto) {
    return this.orderService.request(params, body);
  }
}
