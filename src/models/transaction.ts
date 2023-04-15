import db from '../config/db';

export interface ITransaction {
  id: number;
  player_id: number;
  session_id: number;
  wallet_id: number;
  amount: number;
  type: string;
  balance: number;
  created_at: Date;
}

export enum TransactionType {
  deposit = 'deposit',
  withdraw = 'withdraw',
  bet = 'bet',
  win = 'win',
}

export class TransactionModel {
  /**
   * Calls the create_withdraw_transaction function in the database to create a withdrawal or bet transaction.
   * @param session_id 
   * @param amount 
   * @param type either 'withdraw' or 'bet'
   * @returns 
   */
  static async createWithdrawOrBet(
    session_id: number,
    amount: number,
    type: TransactionType
  ): Promise<ITransaction> {
    const transaction = await db.one<ITransaction>(
      `SELECT * FROM create_withdraw_transaction($1, $2, $3)`,
      [session_id, amount, type]
    );
    return transaction;
  }

  /**
   * Calls the create_deposit_transaction function in the database to create a deposit or win transaction.
   * @param session_id 
   * @param amount 
   * @param type either 'deposit' or 'win'
   * @returns 
   */
  static async createDepositOrWin(
    session_id: number,
    amount: number,
    type: TransactionType
  ): Promise<ITransaction> {
    const transaction = await db.one<ITransaction>(
      `SELECT * FROM create_deposit_transaction($1, $2, $3)`,
      [session_id, amount, type]
    );
    return transaction;
  }

  static async findBySessionId(session_id: number): Promise<ITransaction[]> {
    const transactions = await db.any<ITransaction>(
      `SELECT * FROM transactions WHERE session_id = $1`,
      [session_id]
    );
    return transactions;
  }

  static async findByPlayerId(player_id: number): Promise<ITransaction[]> {
    const transactions = await db.any<ITransaction>(
      `SELECT * FROM transactions WHERE player_id = $1`,
      [player_id]
    );
    return transactions;
  }
}
