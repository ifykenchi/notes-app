import { Request, Response, NextFunction } from "express";
import env from "../env";

import jwt from "jsonwebtoken";

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		res.sendStatus(401);
		return;
	}

	if (!env.ACCESS_TOKEN_SECRET) {
		res.status(500).json({ error: "Server configuration error" });
		return;
	}

	jwt.verify(
		token,
		env.ACCESS_TOKEN_SECRET,
		(err: jwt.VerifyErrors | null, user: unknown) => {
			if (err) return res.sendStatus(401);

			(req as any).user = user;
			return next();
		}
	);
}

export default { authenticateToken };
