import { expect } from "chai";
import { PlayerModel } from "../../src/models/player";
import { WalletModel } from "../../src/models/wallet";
import { SessionModel } from "../../src/models/session";
import { TransactionModel, TransactionType } from "../../src/models/transaction";
import db from "../../src/config/db";

describe("TransactionModel", () => {
	let playerId: number;
	let walletId: number;
	let sessionId: number;

	before(async () => {
		await db.none("TRUNCATE players, wallets, sessions, transactions CASCADE");

		const player = await PlayerModel.create("Test Player");
		playerId = player.id;

		const wallet = await WalletModel.create(playerId);
		walletId = wallet.id;

		const session = await SessionModel.startSession(playerId);
		sessionId = session.id;

		await db.none("UPDATE wallets SET balance = 50 WHERE id = $1", [walletId]);
	});

	afterEach(async () => {
		await db.none("TRUNCATE transactions");
		await db.none("UPDATE wallets SET balance = 50 WHERE id = $1", [walletId]);
	});

	describe("createWithdrawOrBet", () => {
		it("should create a withdrawal or bet transaction", async () => {
			const transaction = await TransactionModel.createWithdrawOrBet(sessionId, 50, TransactionType.withdraw);
			expect(transaction).to.have.property("id");
			expect(transaction).to.have.property("player_id", playerId);
			expect(transaction).to.have.property("session_id", sessionId);
			expect(transaction).to.have.property("wallet_id", walletId);
			expect(transaction).to.have.property("amount", 50);
			expect(transaction).to.have.property("type", TransactionType.withdraw);
			expect(transaction).to.have.property("balance");
			expect(transaction).to.have.property("created_at");
		});
	});

	describe("createDepositOrWin", () => {
		it("should create a deposit or win transaction", async () => {
			const transaction = await TransactionModel.createDepositOrWin(sessionId, 100, TransactionType.deposit);
			expect(transaction).to.have.property("id");
			expect(transaction).to.have.property("player_id", playerId);
			expect(transaction).to.have.property("session_id", sessionId);
			expect(transaction).to.have.property("wallet_id", walletId);
			expect(transaction).to.have.property("amount", 100);
			expect(transaction).to.have.property("type", TransactionType.deposit);
			expect(transaction).to.have.property("balance");
			expect(transaction).to.have.property("created_at");
		});
	});

	describe("findBySessionId", () => {
		it("should find all transactions for a session", async () => {
			await TransactionModel.createDepositOrWin(sessionId, 100, TransactionType.deposit);
			await TransactionModel.createWithdrawOrBet(sessionId, 50, TransactionType.withdraw);

			const transactions = await TransactionModel.findBySessionId(sessionId);
			expect(transactions).to.have.length(2);

			transactions.forEach((transaction) => {
				expect(transaction).to.have.property("id");
				expect(transaction).to.have.property("player_id", playerId);
				expect(transaction).to.have.property("session_id", sessionId);
				expect(transaction).to.have.property("wallet_id", walletId);
				expect(transaction).to.have.property("amount");
				expect(transaction).to.have.property("type");
				expect(transaction).to.have.property("balance");
				expect(transaction).to.have.property("created_at");
			});
		});
	});

	describe("findByPlayerId", () => {
		it("should find all transactions for a player", async () => {
			await TransactionModel.createDepositOrWin(sessionId, 100, TransactionType.deposit);
			await TransactionModel.createWithdrawOrBet(sessionId, 50, TransactionType.withdraw);

			const transactions = await TransactionModel.findByPlayerId(playerId);
			expect(transactions).to.have.length(2);

			transactions.forEach((transaction) => {
				expect(transaction).to.have.property("id");
				expect(transaction).to.have.property("player_id", playerId);
				expect(transaction).to.have.property("session_id", sessionId);
				expect(transaction).to.have.property("wallet_id", walletId);
				expect(transaction).to.have.property("amount");
				expect(transaction).to.have.property("type");
				expect(transaction).to.have.property("balance");
				expect(transaction).to.have.property("created_at");
			});
		});
	});
});
