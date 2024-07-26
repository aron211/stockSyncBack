import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { InventoryService } from '../inventory/inventory.service';
import { Inventory } from '../inventory/entities/inventory.entity';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly inventoryService: InventoryService
  ) {}

  // async create(createOrderDto: CreateOrderDto) {
  //   const user = await this.usersService.findOne(createOrderDto.userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const order = this.orderRepository.create({
  //     ...createOrderDto,
  //     user,
  //   });

  //   return this.orderRepository.save(order);
  // }
// async create(createOrderDto: CreateOrderDto) {
//   const { userId, ...orderData } = createOrderDto;

//   // Encuentra el usuario
//   const user = await this.usersService.findOne(userId);

//   if (!user) {
//     throw new NotFoundException('User not found');
//   }

//   // Encuentra los productos
//   const productIds = createOrderDto.productIds;
//   const products = await this.inventoryService.findByIds(productIds);

//   if (!products.length) {
//     throw new NotFoundException('No products found');
//   }

//   // Crea el pedido
//   const order = this.orderRepository.create({
//     ...orderData,
//     user,
//     products,
//   });

//   return this.orderRepository.save(order);
// }
async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
  const { userId, productIds, ...orderData } = createOrderDto;

  // Verifica si el usuario existe
  const user = await this.usersService.findOne(userId);
  if (!user) {
    throw new BadRequestException('User not found');
  }

  // Verifica si los productos existen
  const products = await this.inventoryService.findByIds(productIds);
  if (products.length !== productIds.length) {
    throw new BadRequestException('Some products not found');
  }

  // Crea la nueva orden
  const order = this.orderRepository.create({
    ...orderData,
    user,
    products,
  });

  try {
    return await this.orderRepository.save(order);
  } catch (error) {
    // Maneja y loggea el error para diagnóstico
    console.error('Error creating order:', error);
    throw new InternalServerErrorException('Error creating order');
  }
}

async findAll(): Promise<Order[]> {
  return this.orderRepository.find({
    relations: ['products', 'user'],
  });
}

async findOne(id: string): Promise<Order> {
  return this.orderRepository.findOne({
    where: { id },
    relations: ['products', 'user'],
  });
}

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return this.orderRepository.softRemove(order);
  }
}
// @Injectable()
// export class OrdersService {
//   constructor(
//     @InjectRepository(Order)
//     private ordersRepository: Repository<Order>,
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//   ) {}
//   async create(createOrderDto: CreateOrderDto): Promise<Order> {
//     const user = await this.usersRepository.findOne(createOrderDto.userId);
//     if (!user) {
//       throw new Error('User not found');
//     }

//     const order = this.ordersRepository.create({
//       ...createOrderDto,
//       user,
//     });
//     return this.ordersRepository.save(order);
//   }

//   findAll() {
//     return `This action returns all orders`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} order`;
//   }

//   update(id: number, updateOrderDto: UpdateOrderDto) {
//     return `This action updates a #${id} order`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} order`;
//   }
// }
