import { Request, Response, NextFunction } from 'express';
import IMiddleware from './middleware.interface';

export default class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.user) {
			res.status(401).send({ error: 'Unauthorized' });
			return;
		}

		next();
	}
}
