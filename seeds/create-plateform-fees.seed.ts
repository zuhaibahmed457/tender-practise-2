import {
  PlatformFee,
  PlatformFeeType,
  PlatformLabel,
} from 'src/modules/platform-fees/entities/platform-fee.entity';
import { DataSource } from 'typeorm';

const platformFees = [
  {
    label: PlatformLabel.TENDER_POSTER_FEE,
    fee: 0.15,
    type: PlatformFeeType.PERCENTAGE,
  },
  {
    label: PlatformLabel.TENDER_BIDDER_FEE,
    fee: 0.15,
    type: PlatformFeeType.PERCENTAGE,
  },
];

export const createPlatformFees = async (AppDataSource: DataSource) => {
  const platformFeeRepository = AppDataSource.getRepository(PlatformFee);

  for (const platformFee of platformFees) {
    const existingPlatformFee = await platformFeeRepository.findOne({
      where: {
        label: platformFee.label,
      },
    });

    if (!existingPlatformFee) {
      const createPlatformFee = platformFeeRepository.create({
        ...platformFee,
      });
      await platformFeeRepository.save(createPlatformFee);
    }
  }

  console.log('Platform Fee seeded successfully');
};
