import express, { Request, Response } from "express";
import { PlayerModel } from "../models/player";
import { validationResult } from "express-validator";
import { playerValidationRules } from "../validators/playerValidator";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Get all players
router.get("/", authMiddleware, async (_req: Request, res: Response) => {
	try {
		const players = await PlayerModel.findAll();
		res.json(players);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// Create a new player
router.post("/", authMiddleware, playerValidationRules(), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const statusCode = errors.array()[0].msg.statusCode || 400;
		return res.status(statusCode).json({ errors: errors.array() });
	}

	const { name } = req.body;
	try {
		const newPlayer = await PlayerModel.create(name);
		res.status(201).json(newPlayer);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

export default router;
