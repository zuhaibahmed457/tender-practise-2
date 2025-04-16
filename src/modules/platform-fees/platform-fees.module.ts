import { Module } from '@nestjs/common';
import { PlatformFeesService } from './platform-fees.service';
import { PlatformFeesController } from './platform-fees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformFee } from './entities/platform-fee.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformFee]), SharedModule],
  controllers: [PlatformFeesController],
  providers: [PlatformFeesService],
})
export class PlatformFeesModule {}
