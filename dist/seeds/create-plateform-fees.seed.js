"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlatformFees = void 0;
const platform_fee_entity_1 = require("../src/modules/platform-fees/entities/platform-fee.entity");
const platformFees = [
    {
        label: platform_fee_entity_1.PlatformLabel.TENDER_POSTER_FEE,
        fee: 0.15,
        type: platform_fee_entity_1.PlatformFeeType.PERCENTAGE,
    },
    {
        label: platform_fee_entity_1.PlatformLabel.TENDER_BIDDER_FEE,
        fee: 0.15,
        type: platform_fee_entity_1.PlatformFeeType.PERCENTAGE,
    },
];
const createPlatformFees = async (AppDataSource) => {
    const platformFeeRepository = AppDataSource.getRepository(platform_fee_entity_1.PlatformFee);
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
exports.createPlatformFees = createPlatformFees;
//# sourceMappingURL=create-plateform-fees.seed.js.map