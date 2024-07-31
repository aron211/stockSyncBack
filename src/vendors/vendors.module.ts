import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Vendor } from './entities/vendor.entity';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';

@Module({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Vendor]),
    forwardRef(() => AuthModule),
  ],
  controllers: [VendorsController],
  providers: [VendorsService]
})
export class VendorsModule {}
