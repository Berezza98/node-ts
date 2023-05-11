import { Request, Response, NextFunction } from 'express';

export default interface IMiddleware {
	execute: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
}
