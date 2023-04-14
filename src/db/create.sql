CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_players_name ON players(name);

CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX idx_wallets_player_id ON wallets(player_id);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_player_id ON sessions(player_id);

CREATE TYPE transaction_type AS ENUM ('withdraw', 'bet', 'deposit', 'win');

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  type TRANSACTION_TYPE NOT NULL,
  balance NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_player_id ON transactions(player_id);
CREATE INDEX idx_transactions_session_id ON transactions(session_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);

CREATE OR REPLACE FUNCTION create_withdraw_transaction(
    p_session_id INTEGER,
    p_amount NUMERIC(15, 2),
    p_type transaction_type
)
RETURNS transactions
AS $$
DECLARE
    v_player_id INTEGER;
    v_wallet_id INTEGER;
    v_old_balance NUMERIC(15, 2);
    v_new_balance NUMERIC(15, 2);
    v_new_transaction transactions%ROWTYPE;
BEGIN
    IF p_type NOT IN ('withdraw', 'bet') THEN
        RAISE EXCEPTION 'Invalid transaction type. Only "withdraw" or "bet" allowed.';
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Invalid amount. The amount must be greater than zero.';
    END IF;

    SELECT player_id INTO v_player_id FROM sessions WHERE id = p_session_id;
    
    SELECT id, balance INTO v_wallet_id, v_old_balance 
    FROM wallets
    WHERE player_id = v_player_id
    ORDER BY id DESC
    LIMIT 1;

    v_new_balance := v_old_balance - p_amount;

    IF v_new_balance < 0 THEN
        RAISE EXCEPTION 'Insufficient funds in the wallet.';
    END IF;

    INSERT INTO transactions (player_id, session_id, wallet_id, amount, type, balance)
    VALUES (v_player_id, p_session_id, v_wallet_id, p_amount, p_type, v_new_balance)
    RETURNING * INTO v_new_transaction;

    UPDATE wallets SET balance = v_new_balance WHERE id = v_wallet_id;

    RETURN v_new_transaction;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_deposit_transaction(
    p_session_id INTEGER,
    p_amount NUMERIC(15, 2),
    p_type transaction_type
)
RETURNS transactions
AS $$
DECLARE
    v_player_id INTEGER;
    v_wallet_id INTEGER;
    v_old_balance NUMERIC(15, 2);
    v_new_balance NUMERIC(15, 2);
    v_new_transaction transactions%ROWTYPE;
BEGIN
    IF p_type NOT IN ('deposit', 'win') THEN
        RAISE EXCEPTION 'Invalid transaction type. Only "deposit" or "win" allowed.';
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Invalid amount. The amount must be greater than zero.';
    END IF;

    SELECT player_id INTO v_player_id FROM sessions WHERE id = p_session_id;
    
    SELECT id, balance INTO v_wallet_id, v_old_balance 
    FROM wallets
    WHERE player_id = v_player_id
    ORDER BY id DESC
    LIMIT 1;

    v_new_balance := v_old_balance + p_amount;

    INSERT INTO transactions (player_id, session_id, wallet_id, amount, type, balance)
    VALUES (v_player_id, p_session_id, v_wallet_id, p_amount, p_type, v_new_balance)
    RETURNING * INTO v_new_transaction;

    UPDATE wallets SET balance = v_new_balance WHERE id = v_wallet_id;

    RETURN v_new_transaction;
END;
$$ LANGUAGE plpgsql;
