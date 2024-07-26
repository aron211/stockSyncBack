import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToMany
  } from 'typeorm';
  import { Order } from '../../orders/entities/order.entity';
  @Entity()
export class Inventory {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false })
    codigo: string;
  
    @Column({ nullable: false })
    name: string;
  
    @Column({nullable: false })
    marca: string;
    
    @Column()
    cant: number;

    @Column({ type: 'float', nullable: true })
    priceD: number;
    
    @Column({ type: 'float', nullable: true })
    priceM: number;
    
    @Column({nullable: false })
    country: string;
  
    @DeleteDateColumn({ select: false })
    deletedAt: Date;
  
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;

    @ManyToMany(() => Order, order => order.products)
    orders: Order[];
}
