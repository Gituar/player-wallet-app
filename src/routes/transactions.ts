import { Request, Response, Router } from "express";
import { TransactionModel, TransactionType } from "../models/transaction";
import { transactionValidationRules } from "../validators/transactionValidator";
import { validationResult } from "express-validator";

const router = Router();

// Create a withdrawal or bet transaction transaction
router.post("/sessions/:sessionId/withdrawals", transactionValidationRules(TransactionType.withdraw, TransactionType.bet), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const sessionId = parseInt(req.params.sessionId);
	const { amount, type } = req.body;
	try {
		const transaction = await TransactionModel.createWithdrawOrBet(sessionId, amount, type);
		res.status(201).json(transaction);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// Create a deposit or win transaction
router.post("/sessions/:sessionId/deposits", transactionValidationRules(TransactionType.deposit, TransactionType.win), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const sessionId = parseInt(req.params.sessionId);
	const { amount, type } = req.body;
	try {
		const transaction = await TransactionModel.createDepositOrWin(sessionId, amount, type);
		res.status(201).json(transaction);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// Get transactions for a player
router.get("/players/:playerId/transactions", async (req: Request, res: Response) => {
	const playerId = parseInt(req.params.playerId);

	try {
		const transactions = await TransactionModel.findByPlayerId(playerId);
		res.json(transactions);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// Get transactions for a session
router.get("/sessions/:sessionId/transactions", async (req: Request, res: Response) => {
	const sessionId = parseInt(req.params.sessionId);

	try {
		const transactions = await TransactionModel.findBySessionId(sessionId);
		res.json(transactions);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

export default router;
