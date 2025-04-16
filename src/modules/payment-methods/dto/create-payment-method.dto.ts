import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentMethodType } from '../entities/payment-method.entity';

export class CreatePaymentMethodDto {
  @IsEnum(PaymentMethodType, { each: true })
  @IsNotEmpty()
  payment_method_types: PaymentMethodType[];
}
