import { NextFunction, Request, Response } from 'express';

export default interface IUsersController {
	register: (req: Request, res: Response, next: NextFunction) => void;
	login: (req: Request, res: Response, next: NextFunction) => void;
}
