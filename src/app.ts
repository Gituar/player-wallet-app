import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import playerRoutes from "./routes/players";
import walletRoutes from "./routes/wallets";
import sessionRoutes from "./routes/sessions";
import transactionRoutes from "./routes/transactions";
import config from "./config/config";
import logger from "./config/logger";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/", walletRoutes);
app.use("/", sessionRoutes);
app.use("/", transactionRoutes);
if (config.developmentMode) {
	app.use("/players", playerRoutes);
}

// Default route
app.get("/", (req: Request, res: Response) => {
	res.send("Welcome to the Player Wallet App!");
});

// Error handling
app.use((err: Error, req: Request, res: Response /*, next: Function*/) => {
	logger.error(err.message);
	res.status(500).send("An unexpected error occurred.");
});

app.listen(config.port, () => {
	logger.info(`Server is running on port ${config.port}`);
});

export default app;
