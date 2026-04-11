import { Sequelize } from 'sequelize';

// Khởi tạo và export instance thực sự của Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USERNAME || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT as string) || 3306, // Nên có fallback dự phòng
    dialect:
      (process.env.DB_TYPE as
        | 'mysql'
        | 'postgres'
        | 'sqlite'
        | 'mariadb'
        | 'mssql') || 'mysql',
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 60000,
    },
    logging: false,
  },
);
