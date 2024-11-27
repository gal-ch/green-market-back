import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UploadService } from 'upload/upload.service';
import { AccountService } from 'account/account.service';
import { StoreService } from 'store/store.service';
import { Store } from 'store/entities/store.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly uploadService: UploadService,
    private readonly accountService: AccountService,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async create(
    productDto: CreateProductDto,
    file: Express.Multer.File,
    req: any,
  ): Promise<Product> {
    let imageUrl = '';
    if (file) {
      imageUrl = await this.uploadService.uploadImageToS3(file);
    }
    const account = await this.accountService.findOne(req.accountId || 1);
    if (!account) throw new UnauthorizedException('Account not found');
    const disabledStoresIds = Array.isArray(productDto.disabledStoresIds)
      ? productDto.disabledStoresIds
      : JSON.parse(productDto.disabledStoresIds || '[]');

    const product = this.productRepository.create({
      ...productDto,
      image: imageUrl,
      account,
      disabledStoresIds,
    });

    return this.productRepository.save(product);
  }

  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async update(
    id: number,
    updateProductDto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    if (file) {
      updateProductDto.image = await this.uploadService.uploadImageToS3(file);
    }
    Object.assign(product, {
      ...updateProductDto,
      disabledStoresIds:
        updateProductDto.disabledStoresIds || product.disabledStoresIds,
    });
    return this.productRepository.save(product);
  }
}
