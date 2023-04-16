import { body } from "express-validator";
import { TransactionType } from "src/models/transaction";

export const transactionValidationRules = (...transactionTypes: TransactionType[]) => {
	return [
		// Validate the 'amount' field
		body("amount")
			.notEmpty()
			.withMessage("Amount is required")
			.isNumeric()
			.withMessage("Amount must be a number")
			.isFloat({ gt: 0 })
			.withMessage("Amount must be greater than 0"),

		// Validate the 'type' field
		body("type")
			.notEmpty()
			.withMessage("Type is required")
			.isIn([...transactionTypes])
			.withMessage("Invalid transaction type"),
	];
};
