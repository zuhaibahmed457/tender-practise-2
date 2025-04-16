import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsDateString, IsNotEmpty, IsNumber, IsPositive, IsUUID } from "class-validator";
import * as dayjs from "dayjs";

export class CreateBidDto {
    @IsPositive()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsUUID()
    @IsNotEmpty()
    tender_id: string;

    @IsDateString()
    @Transform(({ value }) => dayjs(value).toISOString())
    @IsNotEmpty()
    delivery_date: Date;
}
