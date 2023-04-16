import { param } from "express-validator";
import { SessionModel } from "../models/session";

export const paramSessionIdValidationRule = () => {
	return [
		// Validate the 'sessionId' parameter
		param("sessionId")
			.notEmpty()
			.withMessage("Session ID is required")
			.isNumeric()
			.withMessage("Session ID must be a number")
			.isInt({ gt: 0 })
			.withMessage("Session ID must be greater than 0")
			.custom(async (sessionId) => {
				const session = await SessionModel.findById(parseInt(sessionId));
				if (!session) {
					throw { statusCode: 404, message: "Session ID not found" };
				}
			}),
	];
};
