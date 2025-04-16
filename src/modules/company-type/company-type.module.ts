import { Module } from '@nestjs/common';
import { CompanyTypeService } from './company-type.service';
import { CompanyTypeController } from './company-type.controller';
import { CompanyType } from './entities/company-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyType])],
  controllers: [CompanyTypeController],
  providers: [CompanyTypeService],
})
export class CompanyTypeModule {}
