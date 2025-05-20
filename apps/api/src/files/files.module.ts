import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entity/product.entity';
import { Stock } from '../stock/entity/stock.entity';
import { FilesController } from './controller/file.controller';
import { File } from './entities/file.entity';
import { FilesService } from './service/file.service';
@Module({
  imports: [TypeOrmModule.forFeature([File, Product, Stock])],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
