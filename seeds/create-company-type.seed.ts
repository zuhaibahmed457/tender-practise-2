import {
  CompanyType,
  CompanyTypeStatus,
} from 'src/modules/company-type/entities/company-type.entity';
import { DataSource } from 'typeorm';

// Hardcoded company types
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

export const createCompanyTypes = async (AppDataSource: DataSource) => {
  const companyTypeRepository = AppDataSource.getRepository(CompanyType);

  // Insert each company type
  for (const name of companyTypes) {
    const exists = await companyTypeRepository.findOne({ where: { name } });
    if (!exists) {
      const companyTypeEntity = companyTypeRepository.create({
        name,
        status: CompanyTypeStatus.ACTIVE,
      });

      await companyTypeRepository.save(companyTypeEntity);
    }
  }

  console.log('All company types seeded successfully.');
};
