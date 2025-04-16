import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { Country } from '../country/entities/country.entity';
import { Industry } from '../industry/entities/industry.entity';
import { CompanyType } from '../company-type/entities/company-type.entity';
import { UserIndustries } from './entities/user-industries.entity';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Country,
      CompanyType,
      UserIndustries,
      Industry,
    ]),
    NotificationsModule,
    MediaModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
