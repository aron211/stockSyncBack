import {  Injectable,
          BadRequestException,
          UnauthorizedException,
 } from '@nestjs/common';
 import { Repository } from 'typeorm';
 import { InjectRepository } from '@nestjs/typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly configService: ConfigService,
  ) { }
  create(createVendorDto: CreateVendorDto) {
    return this.vendorRepository.save(createVendorDto);
  }

  async findAll() {
    return await this.vendorRepository.find();
    return `This action returns all vendors`;
  }

  async findOne(id: string) {
    const vendor = await this.vendorRepository.findOneBy({ id });
    if (!vendor) {
      throw new BadRequestException('user not found ');
    }
    return vendor;
  }
  findOneById(id: string) {
    return this.vendorRepository.findOne({ 
      where: { id },
      select: [
        'id',
        'ci',
        'name',
        'lastname',
        'phone'
      ],
     });
    return `This action returns a #${id} client`;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.findOne(id);
    if (!vendor) {
      throw new UnauthorizedException('id is wrong');
    }
    return await this.vendorRepository.update(id, { ...UpdateVendorDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.vendorRepository.softRemove({ id });
    return `This action removes a #${id} vendor`;
  }
}
