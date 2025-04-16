"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSizes = void 0;
const size_entity_1 = require("../src/modules/sizes/entities/size.entity");
const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5001-10000',
    '10001+',
];
const createSizes = async (AppDataSource) => {
    const companySizeRepository = AppDataSource.getRepository(size_entity_1.Size);
    for (const size of companySizes) {
        const exists = await companySizeRepository.findOne({
            where: { range: size },
        });
        if (!exists) {
            const companySizeEntity = companySizeRepository.create({
                range: size,
            });
            await companySizeRepository.save(companySizeEntity);
        }
    }
    console.log('All sizes seeded successfully.');
};
exports.createSizes = createSizes;
//# sourceMappingURL=create-sizes.seed.js.map