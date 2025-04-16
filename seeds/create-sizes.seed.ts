import { Size } from 'src/modules/sizes/entities/size.entity';
import { DataSource } from 'typeorm';

// Hardcoded company sizes
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

export const createSizes = async (AppDataSource: DataSource) => {
  const companySizeRepository = AppDataSource.getRepository(Size);

  // Insert each company size
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
