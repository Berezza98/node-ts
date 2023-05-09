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

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
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