import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Unique
  } from 'typeorm';
  @Entity()
export class Client{
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false })
    codigo: string;
  
    @Column({ nullable: false })
    name: string;
  
    @Column({ unique: true, nullable: false })
    rif: string;

    @Column({ nullable: true })
    address: string;
  
    @Column({ nullable: true })
    phone: string;
  
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


}