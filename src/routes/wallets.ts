import { Request, Response, Router } from "express";
import { WalletModel } from "../models/wallet";
import config from "../config/config";

const router = Router();

// Create wallet for a player
router.post("/players/:playerId/wallet", async (req: Request, res: Response) => {
	const playerId = parseInt(req.params.playerId);
	try {
		const wallet = await WalletModel.create(playerId);
		res.status(201).json(wallet);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

if (config.developmentMode) {
	// Get wallet by player ID
	router.get("/players/:playerId/wallet", async (req: Request, res: Response) => {
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
