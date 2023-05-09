import { Server } from 'node:http';
import express, { Express } from 'express';
import UsersController from './users/users.controller';
import ExceptionFilter from './errors/exception.filter';
import ILogger from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';

@injectable()
export default class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private userController: UsersController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
	) {
		this.app = express();
		this.port = 3333;
	}

	private useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	private useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useRoutes();
		this.useExceptionFilters();

		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Server launched on port: ${this.port}`);
		});
	}
}
