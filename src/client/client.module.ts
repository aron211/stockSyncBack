import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Client } from './entities/client.entity';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';

@Module({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Client]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}
