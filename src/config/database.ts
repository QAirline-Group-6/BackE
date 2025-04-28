const config = {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'quocanh',
  PASSWORD: process.env.DB_PASSWORD || '',
  DB: process.env.DB_NAME || 'plane',
  dialect: 'mysql' as const, // Hoặc 'postgres' nếu bạn dùng PostgreSQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

export default config;
