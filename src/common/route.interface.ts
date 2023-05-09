import { Request, Response, NextFunction, Router } from 'express';

export default interface IControllerRoute {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	func: (req: Request, res: Response, next: NextFunction) => void;
}

export type ExpressReturnType = Response<any, Record<string, any>>;
