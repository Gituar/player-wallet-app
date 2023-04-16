import db from "../config/db";

export interface IPlayer {
	id: number;
	name: string;
}

export class PlayerModel {
	static async create(name: string): Promise<IPlayer> {
		const player = await db.one<IPlayer>("INSERT INTO players (name) VALUES ($1) RETURNING *", [name]);
		return player;
	}

	static async findById(id: number): Promise<IPlayer | null> {
		const player = await db.oneOrNone<IPlayer>("SELECT * FROM players WHERE id = $1", [id]);
		return player;
	}

	static async findAll(): Promise<IPlayer[]> {
		const players = await db.manyOrNone<IPlayer>("SELECT * FROM players");
		return players;
	}

	static async deleteById(id: number): Promise<boolean> {
		const deletedRowCount = await db.result("DELETE FROM players WHERE id = $1", [id], (r) => r.rowCount);
		return deletedRowCount > 0;
	}
}
