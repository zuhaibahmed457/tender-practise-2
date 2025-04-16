import {  IsNumber, IsOptional, IsPositive, IsString, Max } from "class-validator";

export class GetAllDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @Max(250, { message: "Per page can't be more than 100 records" })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  per_page?: number = 10;

}
