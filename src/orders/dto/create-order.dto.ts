import { IsNotEmpty, IsOptional, IsString, IsUUID , IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    codigo: string;
  
    @IsNotEmpty()
    @IsString()
    nameCli: string;
  
    @IsNotEmpty()
    @IsString()
    priceTotal: string;

    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsArray()
    @Type(() => String)
    productIds: string[];
}
