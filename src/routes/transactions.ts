import { Request, Response, Router } from "express";
import { TransactionModel, TransactionType } from "../models/transaction";
import { transactionValidationRules } from "../validators/transactionValidator";
import { validationResult } from "express-validator";
import { paramSessionIdValidationRule } from "../validators/paramSessionIdValidator";
import { paramPlayerIdValidationRule } from "../validators/paramPlayerIdValidator";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Create a withdrawal or bet transaction transaction
router.post(
	"/sessions/:sessionId/withdrawals",
	authMiddleware,
	paramSessionIdValidationRule(),
	transactionValidationRules(TransactionType.withdraw, TransactionType.bet),
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const statusCode = errors.array()[0].msg.statusCode || 400;
			return res.status(statusCode).json({ errors: errors.array() });
		}

		const sessionId = parseInt(req.params.sessionId);
		const { amount, type } = req.body;
		try {
			const transaction = await TransactionModel.createWithdrawOrBet(sessionId, amount, type);
			res.status(201).json(transaction);
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	}
);

// Create a deposit or win transaction
router.post(
	"/sessions/:sessionId/deposits",
	authMiddleware,
	paramSessionIdValidationRule(),
	transactionValidationRules(TransactionType.deposit, TransactionType.win),
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const statusCode = errors.array()[0].msg.statusCode || 400;
			return res.status(statusCode).json({ errors: errors.array() });
		}

		const sessionId = parseInt(req.params.sessionId);
		const { amount, type } = req.body;
		try {
			const transaction = await TransactionModel.createDepositOrWin(sessionId, amount, type);
			res.status(201).json(transaction);
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	}
);

// Get transactions for a player
router.get("/players/:playerId/transactions", authMiddleware, paramPlayerIdValidationRule(), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const statusCode = errors.array()[0].msg.statusCode || 400;
		return res.status(statusCode).json({ errors: errors.array() });
	}

	const playerId = parseInt(req.params.playerId);
	try {
		const transactions = await TransactionModel.findByPlayerId(playerId);
		res.status(200).json(transactions);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

// Get transactions for a session
router.get("/sessions/:sessionId/transactions", authMiddleware, paramSessionIdValidationRule(), async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const statusCode = errors.array()[0].msg.statusCode || 400;
		return res.status(statusCode).json({ errors: errors.array() });
	}

	const sessionId = parseInt(req.params.sessionId);
	try {
		const transactions = await TransactionModel.findBySessionId(sessionId);
		res.status(200).json(transactions);
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

export default router;
