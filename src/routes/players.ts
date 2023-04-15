import express, { Request, Response } from "express";
import { PlayerModel } from "../models/player";
import { validationResult } from "express-validator";
import { playerValidationRules } from "../validators/playerValidator";

const router = express.Router();

// Get all players
router.get("/", async (_req: Request, res: Response) => {
	try {
		const players = await PlayerModel.findAll();
		res.json(players);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// Create a new player
router.post("/", playerValidationRules(), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
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
