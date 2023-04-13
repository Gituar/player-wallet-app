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

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  type TEXT NOT NULL,
  balance NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_session_id ON transactions(session_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);