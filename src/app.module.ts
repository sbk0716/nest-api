/**
 * app.module.ts
 * The root module of the application.
 */
import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { getConnectionOptions } from 'typeorm';

@Module({
  /**
   * ModuleMetadata | imports
   * Optional list of imported modules that export the providers
   * which are required in this module.
   * @see https://docs.nestjs.com/techniques/database#typeorm-integration
   */
  imports: [
    // Import the TypeOrmModule with the settings related to the DB connection.
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const connectionOptions = await getConnectionOptions();
        return Object.assign(connectionOptions, {
          retryAttempts: 10, // Number of attempts to connect to the database (default: 10)
          retryDelay: 3000, // Delay between connection retry attempts (ms) (default: 3000)
          autoLoadEntities: true, // If true, entities will be loaded automatically (default: false)
          keepConnectionAlive: false, // If true, connection will not be closed on application shutdown (default: false)
        });
      },
    }),
    // Import the UsersModule.
    UsersModule,
    // Import the StatusModule.
    StatusModule,
  ],
})
export class AppModule {}
