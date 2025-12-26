import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';
import { Product } from 'generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalPages = await this.prisma.product.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        totalPages: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productoToUpdate = await this.findOne(id);

    const newProduct = await this.prisma.product.update({
      where: {
        id: productoToUpdate.id,
      },
      data: updateProductDto,
    });

    return newProduct;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
