"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const create_super_admin_seed_1 = require("./create-super-admin.seed");
const create_sizes_seed_1 = require("./create-sizes.seed");
const create_industries_seed_1 = require("./create-industries.seed");
const create_countries_seed_1 = require("./create-countries.seed");
const create_company_type_seed_1 = require("./create-company-type.seed");
const create_plateform_fees_seed_1 = require("./create-plateform-fees.seed");
(0, dotenv_1.config)({
    path: `.env.${process.env.NODE_ENV}`,
});
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
    logging: true,
    ...(process.env.NODE_ENV !== 'development' && {
        ssl: {
            rejectUnauthorized: false,
        },
    }),
});
const seed = async () => {
    try {
        console.log('Initializing database connection...');
        await AppDataSource.initialize();
        console.log('Connected to the database!');
        await (0, create_super_admin_seed_1.createSuperAdmin)(AppDataSource);
        await (0, create_sizes_seed_1.createSizes)(AppDataSource);
        await (0, create_industries_seed_1.createIndustries)(AppDataSource);
        await (0, create_countries_seed_1.createCountries)(AppDataSource);
        await (0, create_company_type_seed_1.createCompanyTypes)(AppDataSource);
        await (0, create_plateform_fees_seed_1.createPlatformFees)(AppDataSource);
        console.log('Seeding complete!');
    }
    catch (error) {
        console.error('Error seeding industries:', error);
    }
    finally {
        await AppDataSource.destroy();
        console.log('Database connection closed.');
    }
};
seed();
//# sourceMappingURL=index.seed.js.map