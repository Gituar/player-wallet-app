import 'dotenv/config';

const config = {
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwtSecret: process.env.JWT_SECRET,
  log: {
    level: process.env.LOG_LEVEL,
    filePath: process.env.LOG_FILE_PATH,
  },
};

export default config;