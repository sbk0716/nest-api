import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExportUserReportDto } from './dto/export-user-report.dto';
import { ReportService } from '../report/report.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reportService: ReportService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Post(':id/report')
  async exportReport(
    @Param('id') id: number,
    @Body() exportUserReportDto: ExportUserReportDto,
  ) {
    const userInfo = await this.usersService.findOne(id);
    const sendData = await this.reportService.export({
      template: exportUserReportDto.template,
      format: exportUserReportDto.format,
      data: userInfo,
    });
    return sendData.Location;
  }
}
