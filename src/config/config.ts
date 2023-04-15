import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config = {
	port: Number(process.env.PORT) || 3000,
	db: {
		host: process.env.DB_HOST || "localhost",
		port: Number(process.env.DB_PORT) || 5432,
		database: process.env.DB_NAME || "player_wallet_app",
		user: process.env.DB_USER || "your_username",
		password: process.env.DB_PASSWORD || "your_password",
	},
	jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
	log: {
		level: process.env.LOG_LEVEL || "info",
		filePath: process.env.LOG_FILE_PATH || "./logs/app.log",
	},
};

export default config;
