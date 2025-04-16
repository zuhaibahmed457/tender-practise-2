import { BadRequestException } from '@nestjs/common';
import { UpdateTenderDto } from '../dto/update-tender.dto';
import { TenderStatus } from '../entities/tender.entity';
import { TenderPolicy } from '../policies/update-tender-policy';

export class TenderPolicyFactory {
  private static getAllowedFields(status: TenderStatus): string[] {
    return TenderPolicy[status];
  }

  static canUpdate(status: TenderStatus, updateTenderDto: UpdateTenderDto) {
    const allowedFields = TenderPolicyFactory.getAllowedFields(status);

    return Object.keys(updateTenderDto).forEach((field) => {
      if (!allowedFields.includes(field)) {
        throw new BadRequestException(
          `Field ${field} is not allowed, when tender is in ${status}`,
        );
      }
    });
  }
}
