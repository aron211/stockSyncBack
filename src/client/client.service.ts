import {  Injectable,
          BadRequestException,
          UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { PatchType } from '../common/enums/patch.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly configService: ConfigService,
  ) { }

  create(createClientDto: CreateClientDto) {
    return this.clientRepository.save(createClientDto);
    // return 'This action adds a new client';
  }

  async findAll() {
    return await this.clientRepository.find();
    return `This action returns all client`;
  }

  findOneByName(name: string) {
    return this.clientRepository.findOneBy({ name });
  }

  findOneById(id: string) {
    return this.clientRepository.findOne({ 
      where: { id },
      select: [
        'id',
        'name',
        'rif',
        'address',
        'phone'
      ],
     });
    return `This action returns a #${id} client`;
  }

  async findOne(id: string) {

    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new BadRequestException('user not found ');
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);
    if (!client) {
      throw new UnauthorizedException('id is wrong');
    }
    return await this.clientRepository.update(id, { ...UpdateClientDto });
    return `This action updates a #${id} client`;
  }

  async  remove(id: string) {
    await this.findOne(id);
    return this.clientRepository.softRemove({ id });
    return `This action removes a #${id} client`;
  }
}
