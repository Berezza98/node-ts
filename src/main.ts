import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';
import App from './app';
import ExceptionFilter from './errors/exception.filter';
import LoggerService from './logger/logger.service';
import UsersController from './users/users.controller';
import ILogger from './logger/logger.interface';
import { TYPES } from './types';
import IExceptionFilter from './errors/exception.filter.interface';
import IUsersController from './users/users.controller.interface';
import IUsersService from './users/users.service.interface';
import UserService from './users/users.service';
import IConfigService from './config/config.service.interface';
import ConfigService from './config/config.service';
import PrismaService from './database/prisma.service';
import IUsersRepository from './users/users.repository.interface';
import UsersRepository from './users/users.repository';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();
	bind<IUsersService>(TYPES.UsersService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
