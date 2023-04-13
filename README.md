# Player Wallet App

Backend wallet application for storing balances and allowing bets and wins inside play sessions.

## Prerequisites

PostgreSQL on your local machine or a remote PostgreSQL server.

## Installation

To install the application, follow these steps:

1. Clone the repository: `git clone https://github.com/Gituar/player-wallet-app.git`
2. Install dependencies: `npm install`
3. To build the project run `npm run build`
4. You can run tests with `npm test`

## Usage

Start the application: `npm start`

The application exposes the following endpoints:

- `POST /players/:playerId/wallet`: Create a new wallet for a player.
- `GET /players/:playerId/wallet`: Get the wallet of a player.
- `POST /players/:playerId/sessions`: Create a new play session for a player.
- `GET /players/:playerId/sessions`: Get all play sessions for a player.
- `POST /players/:playerId/sessions/:sessionId/withdrawals`: Make a withdrawal or bet transaction within a session.
- `POST /players/:playerId/sessions/:sessionId/deposits`: Make a deposit or win transaction within a play session.
- `GET /players/:playerId/sessions/:sessionId/transactions`: Retrieve all transactions for a player in a play session.

[API Documentation](https://gituar.github.io/player-wallet-app/swagger-ui)

## Database schema

## Contributing

If you would like to contribute, please fork the repository and create a pull request. Please ensure that your code adheres to the observables specified in the requirements and has appropriate test coverage.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project was created as part of a job pre-hire assessment.