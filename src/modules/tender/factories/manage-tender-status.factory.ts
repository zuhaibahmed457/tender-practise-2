import { TenderStatus } from '../entities/tender.entity';
import { BadRequestException } from '@nestjs/common';
import {
  ManageTenderStatusPolicy,
  TenderStatusCanBeUpdatedBy,
} from '../policies/manage-tender-status.policy';
import { UserRole } from 'src/modules/users/entities/user.entity';

export class ManageTenderStatusPolicyFactory {
  static canUpdateStatus(
    currentStatus: TenderStatus,
    newStatus: TenderStatus,
    role: TenderStatusCanBeUpdatedBy,
  ) {
    const allowedTransitions = ManageTenderStatusPolicy[role];

    if (!allowedTransitions) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot change tender status from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
