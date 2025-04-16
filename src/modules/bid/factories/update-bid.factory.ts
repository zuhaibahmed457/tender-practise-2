import { BadRequestException } from '@nestjs/common';
import { BidStatus } from '../entities/bid.entity';
import { UpdateBidDto } from '../dto/update-bid.dto';
import { BidPolicy } from '../policies/update-bid.policy';

export class BidPolicyFactory {
  private static getAllowedFields(status: BidStatus): string[] {
    return BidPolicy[status];
  }

  static canUpdate(status: BidStatus, updateTenderDto: UpdateBidDto) {
    const allowedFields = BidPolicyFactory.getAllowedFields(status);

    return Object.keys(updateTenderDto).forEach((field) => {
      if (!allowedFields.includes(field)) {
        throw new BadRequestException(
          `Field ${field} is not allowed, when tender is in ${status}`,
        );
      }
    });
  }
}
