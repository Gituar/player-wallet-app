import { param } from "express-validator";
import { PlayerModel } from "../models/player";

export const paramPlayerIdValidationRule = () => {
	return [
		// Validate the 'playerId' parameter
		param("playerId")
			.notEmpty()
			.withMessage("Player ID is required")
			.isNumeric()
			.withMessage("Player ID must be a number")
			.isInt({ gt: 0 })
			.withMessage("Player ID must be greater than 0")
			.custom(async (playerId) => {
				const player = await PlayerModel.findById(parseInt(playerId));
				if (!player) {
					throw { statusCode: 404, message: "Player ID not found" };
				}
			}),
	];
};
