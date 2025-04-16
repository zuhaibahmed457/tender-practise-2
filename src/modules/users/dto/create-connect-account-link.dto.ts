import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateConnectAccountLink {
  @IsUrl()
  @IsNotEmpty()
  refresh_url: string;

  @IsUrl()
  @IsNotEmpty()
  return_url: string;
}
