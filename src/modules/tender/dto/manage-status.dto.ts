import { IsEnum, IsNotEmpty } from 'class-validator';
import { TenderStatus } from '../entities/tender.entity';

export class ManageStatusDto {
  @IsEnum(TenderStatus)
  @IsNotEmpty()
  tender_status: TenderStatus;
}
