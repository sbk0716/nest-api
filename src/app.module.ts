import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { ReportModule } from './report/report.module';
import { S3FileService } from './s3-file/s3-file.service';
import { S3FileModule } from './s3-file/s3-file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { OrderModule } from './order/order.module';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { DynamoDbModule } from './dynamo-db/dynamo-db.module';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    StatusModule,
    ReportModule,
    S3FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot(),
    UsersModule,
    OrderModule,
    DynamoDbModule,
    SqsModule,
  ],
  providers: [S3FileService, DynamoDbService],
})
export class AppModule {}
