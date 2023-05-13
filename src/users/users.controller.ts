import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import BaseController from '../common/base.controller';
import HTTPError from '../errors/http-error';
import ILogger from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import IUsersController from './users.controller.interface';
import UserRegisterDto from './dto/user-register.dto';
import UserLoginDto from './dto/user-login.dto';
import User from './user.entity';
import UserService from './users.service';
import ValidateMiddleware from '../common/validate.middleware';
import IConfigService from '../config/config.service.interface';

@injectable()
export default class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private usersService: UserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this.usersService.createUser(req.body);

		if (!newUser) {
			return next(new HTTPError(422, 'User has been already registered'));
		}

		this.ok(res, newUser);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const valid = await this.usersService.validateUser(req.body);

		if (!valid) return next(new HTTPError(401, 'Authorization error'));

		const jwt = await this.signJWT(req.body.email, this.configService.get('JWT_SECRET'));
		this.ok(res, { token: jwt });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) rej();

					res(token as string);
				},
			);
		});
	}
}
