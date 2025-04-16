"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanyTypes = void 0;
const company_type_entity_1 = require("../src/modules/company-type/entities/company-type.entity");
const companyTypes = [
    'Educational',
    'Educational Institution',
    'Government Agency',
    'Non Profit',
    'Partnership',
    'Privately Held',
    'Public Company',
    'Self Employed',
    'Self Owned',
    'Sole Proprietorship',
];
const createCompanyTypes = async (AppDataSource) => {
    const companyTypeRepository = AppDataSource.getRepository(company_type_entity_1.CompanyType);
    for (const name of companyTypes) {
        const exists = await companyTypeRepository.findOne({ where: { name } });
        if (!exists) {
            const companyTypeEntity = companyTypeRepository.create({
                name,
                status: company_type_entity_1.CompanyTypeStatus.ACTIVE,
            });
            await companyTypeRepository.save(companyTypeEntity);
        }
    }
    console.log('All company types seeded successfully.');
};
exports.createCompanyTypes = createCompanyTypes;
//# sourceMappingURL=create-company-type.seed.js.map