import { expect } from "chai";
import { PlayerModel } from "../../src/models/player";
import { WalletModel } from "../../src/models/wallet";
import db from "../../src/config/db";

describe("WalletModel", () => {
	let playerId: number;

	beforeEach(async () => {
		await db.none("TRUNCATE players, wallets CASCADE");
		const player = await PlayerModel.create("Test Player");
		playerId = player.id;
	});

	afterEach(async () => {
		await db.none("TRUNCATE wallets CASCADE");
	});

	describe("create", () => {
		it("should create a new wallet for a player", async () => {
			const wallet = await WalletModel.create(playerId);
			expect(wallet).to.have.property("id");
			expect(wallet).to.have.property("player_id", playerId);
			expect(wallet).to.have.property("balance", 0.0);
		});
	});

	describe("findById", () => {
		it("should find a wallet by ID", async () => {
			const wallet = await WalletModel.create(playerId);
			const foundWallet = await WalletModel.findById(wallet.id);
			expect(foundWallet).to.not.be.null;
			expect(foundWallet).to.deep.equal(wallet);
		});

		it("should return null if the wallet ID is not found", async () => {
			const wallet = await WalletModel.findById(-1);
			expect(wallet).to.be.null;
		});
	});

	describe("findByPlayerId", () => {
		it("should find a wallet by player ID", async () => {
			const wallet = await WalletModel.create(playerId);
			const foundWallet = await WalletModel.findByPlayerId(playerId);
			expect(foundWallet).to.not.be.null;
			expect(foundWallet).to.deep.equal(wallet);
		});

		it("should return null if the player ID is not found", async () => {
			const wallet = await WalletModel.findByPlayerId(-1);
			expect(wallet).to.be.null;
		});
	});
});
