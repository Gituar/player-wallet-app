import db from '../config/db';

export interface IWallet {
  id: number;
  player_id: number;
  balance: number;
}

export class WalletModel {
  static async create(player_id: number): Promise<IWallet> {
    const wallet = await db.one<IWallet>(
      `INSERT INTO wallets (player_id) VALUES ($1) RETURNING *`,
      [player_id]
    );
    return wallet;
  }

  static async findById(wallet_id: number): Promise<IWallet | null> {
    const wallet = await db.oneOrNone<IWallet>(
      `SELECT * FROM wallets WHERE id = $1`,
      [wallet_id]
    );
    return wallet;
  }

  static async findByPlayerId(player_id: number): Promise<IWallet | null> {
    const wallet = await db.oneOrNone<IWallet>(
      `SELECT * FROM wallets WHERE player_id = $1`,
      [player_id]
    );
    return wallet;
  }
}
