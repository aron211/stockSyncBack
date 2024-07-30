import { IsNotEmpty, IsOptional, IsString, IsUUID , IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductQuantityDto {
    @IsUUID()
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

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
    @ValidateNested({ each: true })
    @Type(() => ProductQuantityDto)
    products: ProductQuantityDto[];
}
