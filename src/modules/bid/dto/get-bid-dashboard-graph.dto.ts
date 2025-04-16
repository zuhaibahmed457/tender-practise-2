import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetBidDashboardGraphDto {
  @IsUUID('all')
  @IsOptional()
  organization_id?: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;
}
