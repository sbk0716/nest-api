import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Container Health Check')
@Controller('status')
export class StatusController {
  @Get()
  @ApiOperation({ summary: 'getStatus' })
  @ApiResponse({
    status: 200,
    description:
      'You have successfully completed a health check on the container.',
  })
  getStatus() {
    Logger.log('### Execute getStatus ###');
    return 'Container health check was successful!';
  }
}
