import { UserRole } from 'src/modules/users/entities/user.entity';
import { GetAllTendersDto } from '../dto/get-all-tenders.dto';
import { BadRequestException } from '@nestjs/common';
import { GetAllTendersPolicy } from '../policies/get-all-tenders.policy';

export class GetAllTendersFactory {
  static getAllowedFields(role: UserRole): string[] {
    return GetAllTendersPolicy.allowedFields[role];
  }

  static getAllowedValues(role: UserRole, field: string): string[] {
    return GetAllTendersPolicy.allowedValues[field]?.[role];
  }

  static canFilterByField(role: UserRole, field: string): boolean {
    return this.getAllowedFields(role).includes(field);
  }

  static canFilter(
    role: UserRole,
    getAllTendersDto: GetAllTendersDto,
    isOwner: boolean = false,
  ) {
    Object.keys(getAllTendersDto).forEach((field) => {
      if (!this.canFilterByField(role, field)) {
        throw new BadRequestException(
          `You don't have permission to filter by ${field}`,
        );
      }

      const allowedValues = this.getAllowedValues(role, field);

      if (
        allowedValues &&
        !allowedValues.includes(getAllTendersDto[field]) &&
        !isOwner
      ) {
        throw new BadRequestException(
          `${field} is only allowed to filter by ${allowedValues}`,
        );
      }
    });
  }
}
