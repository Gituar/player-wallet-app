import { Request, Response, Router } from "express";
import { WalletModel } from "../models/wallet";
import config from "../config/config";
import { paramPlayerIdValidationRule } from "../validators/paramPlayerIdValidator";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationResult } from "express-validator";

const router = Router();

// Create wallet for a player
router.post("/players/:playerId/wallet", authMiddleware, paramPlayerIdValidationRule(), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const statusCode = errors.array()[0].msg.statusCode || 400;
		return res.status(statusCode).json({ errors: errors.array() });
	}

	const playerId = parseInt(req.params.playerId);
	try {
		const existingWallet = await WalletModel.findByPlayerId(playerId);
		if (existingWallet) {
			return res.status(409).json({ error: "A wallet for this player already exists" });
		}

		const wallet = await WalletModel.create(playerId);
		res.status(201).json(wallet);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

if (config.developmentMode) {
	// Get wallet by player ID
	router.get("/players/:playerId/wallet", authMiddleware, paramPlayerIdValidationRule(), async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const statusCode = errors.array()[0].msg.statusCode || 400;
			return res.status(statusCode).json({ errors: errors.array() });
		}

		const playerId = parseInt(req.params.playerId);
		try {
			const wallet = await WalletModel.findByPlayerId(playerId);
			res.json(wallet);
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	});
}

export default router;
