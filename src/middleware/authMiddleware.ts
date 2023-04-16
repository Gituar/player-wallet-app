import { Request, Response, NextFunction } from "express";
import config from "../config/config";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	// Get the authorization header
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ message: "Authorization header is required" });
	}

	const token = authHeader.split(" ")[1];

	if (config.jwtSecret !== token) {
		return res.status(403).json({ message: "Invalid token" });
	}

	next();
};
