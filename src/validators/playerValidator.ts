import { body } from "express-validator";

export const playerValidationRules = () => {
	return [
		// Validate the 'name' field
		body("name")
			.trim()
			.notEmpty()
			.withMessage("Name is required")
			.isLength({ min: 2, max: 50 })
			.withMessage("Name must be between 2 and 50 characters"),
	];
};
