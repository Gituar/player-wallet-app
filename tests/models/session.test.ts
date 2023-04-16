import { expect } from "chai";
import { PlayerModel } from "../../src/models/player";
import { SessionModel } from "../../src/models/session";
import db from "../../src/config/db";

describe("SessionModel", () => {
	let playerId: number;

	before(async () => {
		await db.none("TRUNCATE players, sessions CASCADE");
		const player = await PlayerModel.create("Test Player");
		playerId = player.id;
	});

	afterEach(async () => {
		await db.none("TRUNCATE sessions CASCADE");
	});

	describe("startSession", () => {
		it("should create a new session for a player", async () => {
			const session = await SessionModel.startSession(playerId);
			expect(session).to.have.property("id");
			expect(session).to.have.property("player_id", playerId);
			expect(session).to.have.property("created_at");
		});
	});

	describe("findByPlayerId", () => {
		it("should find all sessions for a player", async () => {
			await SessionModel.startSession(playerId);
			await SessionModel.startSession(playerId);

			const sessions = await SessionModel.findByPlayerId(playerId);
			expect(sessions).to.have.length(2);

			sessions.forEach((session) => {
				expect(session).to.have.property("id");
				expect(session).to.have.property("player_id", playerId);
				expect(session).to.have.property("created_at");
			});
		});
	});

	describe("findById", () => {
		it("should find a session by its ID", async () => {
			const session = await SessionModel.startSession(playerId);
			const foundSession = await SessionModel.findById(session.id);

			expect(foundSession).to.not.be.null;
			expect(foundSession).to.deep.equal(session);
		});

		it("should return null if the session ID is not found", async () => {
			const foundSession = await SessionModel.findById(-1);
			expect(foundSession).to.be.null;
		});
	});

	describe("endSession", () => {
		it("should end a session and update its 'ended_at' property", async () => {
			const session = await SessionModel.startSession(playerId);
			expect(session).to.have.property("ended_at", null);

			const endedSession = await SessionModel.endSession(session.id);
			expect(endedSession).to.not.be.null;
			expect(endedSession).to.have.property("id", session.id);
			expect(endedSession).to.have.property("ended_at").that.is.not.null;
		});

		it("should return null if the session ID is not found or the session is already ended", async () => {
			const endedSession = await SessionModel.endSession(-1);
			expect(endedSession).to.be.null;
		});
	});
});
