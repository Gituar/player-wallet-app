import pgPromise from "pg-promise";
import { IMain, IDatabase, IInitOptions, IEventContext, IResultExt } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import config from "./config";
import logger from "./logger";

/**
 * Initialization options for pg-promise
 * Documentation: https://vitaly-t.github.io/pg-promise/module-pg-promise.html
 */
const initOptions: IInitOptions = {
	// This handler logs the SQL query being executed.
	query(e) {
		logger.info(`Query: ${e.query}`);
	},
	// This handler logs any errors that occur during query execution, along with the associated query and parameters, if available.
	error(err, e) {
		logger.error("Error executing query:", err);
		if (e.query) {
			logger.error(`Query: ${e.query}`);
			if (e.params) {
				logger.error(`Parameters: ${JSON.stringify(e.params)}`);
			}
		}
	},
	// This handler logs the number of rows received for a given query.
	receive(e: { data: unknown[]; result: void | IResultExt<unknown>; ctx: IEventContext<IClient> }) {
		logger.info(`Received ${e.data.length} rows for query "${e.ctx.query}"`);
	},
};

const pgp: IMain = pgPromise(initOptions);
const db: IDatabase<unknown> = pgp(config.db);

export default db;
