import db from "../config/db";

export interface ISession {
	id: number;
	player_id: number;
	created_at: Date;
	ended_at?: Date;
}

export class SessionModel {
	static async startSession(player_id: number): Promise<ISession> {
		const session = await db.one<ISession>(`INSERT INTO sessions (player_id) VALUES ($1) RETURNING *`, [player_id]);
		return session;
	}

	static async findById(id: number): Promise<ISession | null> {
		const session = await db.oneOrNone<ISession>("SELECT * FROM sessions WHERE id = $1", [id]);
		return session;
	}

	static async findByPlayerId(player_id: number): Promise<ISession[]> {
		const sessions = await db.any<ISession>(`SELECT * FROM sessions WHERE player_id = $1`, [player_id]);
		return sessions;
	}

	static async endSession(session_id: number): Promise<ISession | null> {
		const session = await db.oneOrNone<ISession>(`UPDATE sessions SET ended_at = NOW() WHERE id = $1 AND ended_at IS NULL RETURNING *`, [session_id]);
		return session;
	}
}
