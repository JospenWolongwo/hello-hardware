import { join } from 'path';

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  useUTC: true,
  entities: [join(__dirname, 'src/**/*.entity.ts')],
  seeds: [join(__dirname, 'src/database/seeds/*.seed.ts')],
  factories: [join(__dirname, 'src/database/factories/*.factory.ts')],
};
