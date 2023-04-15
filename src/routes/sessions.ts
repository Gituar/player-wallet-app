import { Request, Response, Router } from "express";
import { SessionModel } from "../models/session";
import config from "../config/config";

const router = Router();

// Create a new session
router.post("/players/:playerId/sessions", async (req: Request, res: Response) => {
	const playerId = parseInt(req.params.playerId);
	try {
		const session = await SessionModel.startSession(playerId);
		res.status(201).json(session);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

if (config.developmentMode) {
	// Get sessions by player ID
	router.get("/players/:playerId/sessions", async (req: Request, res: Response) => {
		const playerId = parseInt(req.params.playerId);
		try {
			const sessions = await SessionModel.findByPlayerId(playerId);
			res.json(sessions);
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	});

	// End a session
	router.patch("/sessions/:session_id/end", async (req: Request, res: Response) => {
		const sessionId = parseInt(req.params.session_id);
		try {
			await SessionModel.endSession(sessionId);
			res.status(200).json({ message: "Session ended" });
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	});
}

export default router;
