import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import IMiddleware from './middleware.interface';

export default class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		const token = req.get('Authorization')?.split(' ')[1];

		if (!token) return next();

		verify(token, this.secret, (err, decoded) => {
			if (err) return next();

			if (!decoded) {
				return next();
			}

			const payload = decoded as { email: string };

			req.user = payload.email;
			next();
		});
	}
}
