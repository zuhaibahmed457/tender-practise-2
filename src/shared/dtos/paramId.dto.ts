import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ParamIdDto {
  @IsUUID('all', { message: 'invalid id' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
