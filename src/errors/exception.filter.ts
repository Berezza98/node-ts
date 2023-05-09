import { NextFunction, Request, Response } from 'express';
import LoggerService from '../logger/logger.service';
import IExceptionFilter from './exception.filter.interface';
import HTTPError from './http-error';
import { inject, injectable } from 'inversify';
import ILogger from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export default class ExceptionFilter implements IExceptionFilter {
	private logger: ILogger;

	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		this.logger = logger;
	}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context || ''}] ${err.message}`);
			res.status(err.statusCode).send({ error: err.message });

			return;
		}

		this.logger.error(`${err.message}`);
		res.status(500).send({ error: err.message });
	}
}
