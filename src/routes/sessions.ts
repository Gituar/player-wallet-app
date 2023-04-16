import { Request, Response, Router } from "express";
import { SessionModel } from "../models/session";
import config from "../config/config";
import { paramSessionIdValidationRule } from "../validators/paramSessionIdValidator";
import { paramPlayerIdValidationRule } from "../validators/paramPlayerIdValidator";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationResult } from "express-validator";

const router = Router();

// Create a new session
router.post("/players/:playerId/sessions", authMiddleware, paramPlayerIdValidationRule(), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const statusCode = errors.array()[0].msg.statusCode || 400;
		return res.status(statusCode).json({ errors: errors.array() });
	}

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
	router.get("/players/:playerId/sessions", authMiddleware, paramPlayerIdValidationRule(), async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const statusCode = errors.array()[0].msg.statusCode || 400;
			return res.status(statusCode).json({ errors: errors.array() });
		}

		const playerId = parseInt(req.params.playerId);
		try {
			const sessions = await SessionModel.findByPlayerId(playerId);
			res.json(sessions);
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	});

	// End a session
	router.patch("/sessions/:sessionId/end", authMiddleware, paramSessionIdValidationRule(), async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const statusCode = errors.array()[0].msg.statusCode || 400;
			return res.status(statusCode).json({ errors: errors.array() });
		}

		const sessionId = parseInt(req.params.sessionId);
		try {
			await SessionModel.endSession(sessionId);
			res.status(200).json({ message: "Session ended" });
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	});
}

export default router;
