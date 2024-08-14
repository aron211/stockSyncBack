import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { InventoryService } from '../inventory/inventory.service';
import { Inventory } from '../inventory/entities/inventory.entity';
import { OrderCodeService } from '../order-code/order-code.service'; // Asegúrate de ajustar la ruta


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    private readonly usersService: UsersService,
    private readonly inventoryService: InventoryService,
    private readonly orderCodeService: OrderCodeService,
  ) {}

async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
  const { userEmail, products, priceTotal, nameCli, cliente, nomCli, rif, comen1, comen2, status, dtot_ped } = createOrderDto;

  // Obtén el codven usando el email del usuario
  const codven = userEmail;

  // Genera el código automáticamente usando el OrderCodeService
  const codigo = await this.orderCodeService.getNextCode();

  // Verifica si los productos existen y prepara los productos con cantidades
  const productEntities = await Promise.all(
    products.map(async (p) => {
      const product = await this.inventoryService.findOne(p.productId);
      if (!product) {
        throw new BadRequestException(`Product ${p.productId} not found`);
      }
      if (product.cant < p.quantity) {
        throw new BadRequestException(`Insufficient quantity for product ${p.productId}`);
      }
      return { product, quantity: p.quantity };
    })
  );

  // Crea el pedido
  const order = this.orderRepository.create({
    codigo,
    priceTotal,
    nameCli,
    cliente,
    nomCli,
    rif,
    codven, // Usa el email directamente como codven
    comen1,
    comen2,
    status,
    dtot_ped,
    orderProducts: productEntities.map(({ product, quantity }) => {
      const orderProduct = new OrderProduct();
      orderProduct.product = product;
      orderProduct.quantity = quantity;
      return orderProduct;
    })
  });

  // Guarda el pedido y las relaciones
  const savedOrder = await this.orderRepository.save(order);

  // Actualiza la cantidad de productos en el inventario
  await Promise.all(
    productEntities.map(async ({ product, quantity }) => {
      product.cant -= quantity;
      await this.inventoryService.update(product.id, { cant: product.cant });
    })
  );

  return this.orderRepository.findOne({
    where: { id: savedOrder.id },
    relations: ['user', 'orderProducts', 'orderProducts.product'],
  });
}

async findAll(): Promise<Order[]> {
  return this.orderRepository.find({
    relations: ['products', 'orderProducts.product', 'user'],
  });
}

async findOne(id: string): Promise<Order> {
  return this.orderRepository.findOne({
    where: { id },
    relations: ['products', 'orderProducts.product', 'user'],
  });
}

  async remove(id: string) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return this.orderRepository.softRemove(order);
  }
}
