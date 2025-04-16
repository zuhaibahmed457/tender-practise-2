import { BadRequestException } from '@nestjs/common';
import { BidStatusCanBeRetrieveBy, GetAllBidsPolicy } from '../policies/get-all-bids.policy';
import { GetAllBidsDto } from '../dto/get-all-bid.dto';

export class GetAllBidsFactory {
  static getAllowedFields(role: BidStatusCanBeRetrieveBy): string[] {
    return GetAllBidsPolicy.allowedFields[role];
  }

  static getAllowedValues(role: BidStatusCanBeRetrieveBy, field: string): string[] {
    return GetAllBidsPolicy.allowedValues[field]?.[role];
  }

  static canFilterByField(role: BidStatusCanBeRetrieveBy, field: string): boolean {
    return this.getAllowedFields(role).includes(field);
  }

  static canFilter(
    role: BidStatusCanBeRetrieveBy,
    getAllBidderDto: GetAllBidsDto,
    isOwner: boolean = false,
  ) {
    Object.keys(getAllBidderDto).forEach((field) => {
      if (!this.canFilterByField(role, field)) {
        throw new BadRequestException(
          `You don't have permission to filter by ${field}`,
        );
      }

      const allowedValues = this.getAllowedValues(role, field);

      if (
        allowedValues &&
        !allowedValues.includes(getAllBidderDto[field]) &&
        !isOwner
      ) {
        throw new BadRequestException(
          `${field} is only allowed to filter by ${allowedValues}`,
        );
      }
    });
  }
}
