import { Server } from 'node:http';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import ILogger from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import IConfigService from './config/config.service.interface';
import IExceptionFilter from './errors/exception.filter.interface';
import UsersController from './users/users.controller';
import PrismaService from './database/prisma.service';

@injectable()
export default class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private userController: UsersController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 3334;
	}

	private useMiddlewares(): void {
		this.app.use(bodyParser.json());
	}

	private useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	private useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();

		await this.prismaService.connect();

		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Server launched on port: ${this.port}`);
		});
	}
}
