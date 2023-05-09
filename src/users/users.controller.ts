import { NextFunction, Request, Response } from 'express';
import BaseController from '../common/base.controller';
import HTTPError from '../errors/http-error';
import ILogger from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import IUsersController from './users.controller.interface';

@injectable()
export default class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'get',
				func: this.register,
			},
			{
				path: '/login',
				method: 'get',
				func: this.login,
			},
		]);
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, { registered: true });
	}

	login(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, { loggedIn: true });
	}
}
